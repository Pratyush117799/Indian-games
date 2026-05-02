/**
 * Ganjifa — Socket.IO
 *
 * Client → Server:
 *   room:join        { roomCode }
 *   room:ready       { roomCode }
 *   room:leave       { roomCode }
 *   room:chat        { roomCode, message }
 *   game:hukm        { roomCode, suit }        declare trump
 *   game:skip_hukm   { roomCode }              no trump this round
 *   game:play        { roomCode, cardId }       play a card
 *   game:next_round  { roomCode }              ready for next round (host only)
 *
 * Server → Client:
 *   room:state       { room, players }
 *   room:start       { state }                 personalised per socket
 *   room:message     { username, message, ts }
 *   room:player_joined { username }
 *   room:abandoned   { message }
 *   game:state       { state }                 personalised (only own hand)
 *   game:trick_end   { trickWinner, trick, state }
 *   game:round_end   { roundWinner, scores, state }
 *   game:over        { winner, finalScores }
 *   game:hukm_declared { suit, declaredBy }
 *   game:error       { message }
 */

const { verifyAccess } = require('../utils/jwt');
const db     = require('../config/db');
const logger = require('../utils/logger');
const {
  createGameState, dealRound, declareHukm, skipHukm,
  playCard, getLegalPlays, startNextRound,
  serialiseForPlayer, serialiseForDB,
} = require('../game-logic/engine/engine');
const { getAiMove, chooseHukm, createMemory, updateMemory } = require('../game-logic/ai/aiPlayer');
const { updateStats } = require('../controllers/gameController');

// In-memory: roomCode → { state, sessionId, startedAt, aiPlayers, memory }
const rooms = new Map();

function initSocket(io) {
  // ── Auth ──────────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('AUTH_MISSING'));
      const decoded = verifyAccess(token);
      const { rows } = await db.query('SELECT id,username FROM users WHERE id=$1', [decoded.sub]);
      if (!rows.length) return next(new Error('AUTH_INVALID'));
      socket.user = rows[0];
      next();
    } catch { next(new Error('AUTH_INVALID')); }
  });

  io.on('connection', socket => {
    logger.info(`Socket connected: ${socket.user.username}`);

    // ── JOIN ──────────────────────────────────────────────
    socket.on('room:join', async ({ roomCode }) => {
      try {
        const { rows: [room] } = await db.query(
          `SELECT gr.*,t.slug AS theme_slug,t.name AS theme_name,u.username AS host_username
           FROM game_rooms gr JOIN themes t ON t.id=gr.theme_id JOIN users u ON u.id=gr.host_id
           WHERE gr.room_code=$1 AND gr.status IN('waiting','active')`, [roomCode]
        );
        if (!room) return socket.emit('game:error', { message: 'Room not found' });

        socket.join(roomCode);
        const { rows: players } = await db.query(
          `SELECT rp.*,u.username FROM room_players rp JOIN users u ON u.id=rp.user_id
           WHERE rp.room_id=$1 ORDER BY rp.seat_index`, [room.id]
        );
        socket.emit('room:state', { room, players });
        socket.to(roomCode).emit('room:player_joined', { username: socket.user.username });

        // Re-sync active game
        const live = rooms.get(roomCode);
        if (live) {
          socket.emit('game:state', serialiseForPlayer(live.state, socket.user.id));
        }
      } catch (err) { logger.error('room:join', err); }
    });

    // ── READY ─────────────────────────────────────────────
    socket.on('room:ready', async ({ roomCode }) => {
      try {
        const { rows: [room] } = await db.query(
          "SELECT * FROM game_rooms WHERE room_code=$1 AND status='waiting'", [roomCode]
        );
        if (!room) return;

        await db.query(
          `UPDATE room_players SET is_ready=true
           WHERE room_id=$1 AND user_id=$2`, [room.id, socket.user.id]
        );

        const { rows: players } = await db.query(
          'SELECT * FROM room_players WHERE room_id=$1', [room.id]
        );
        io.to(roomCode).emit('room:state', {
          room,
          players: await enrichPlayers(room.id),
        });

        const humanCount = players.filter(p => !p.is_ai).length;
        const allReady   = players.filter(p => !p.is_ai).every(p => p.is_ready);
        const canStart   = room.is_vs_ai
          ? true
          : (humanCount >= room.max_players && allReady);

        if (canStart) await startGame(io, roomCode, room);
      } catch (err) { logger.error('room:ready', err); }
    });

    // ── HUKM declaration ─────────────────────────────────
    socket.on('game:hukm', async ({ roomCode, suit }) => {
      try {
        const live = rooms.get(roomCode);
        if (!live) return socket.emit('game:error', { message: 'Game not active' });

        const { newState, error } = declareHukm(live.state, socket.user.id, suit);
        if (error) return socket.emit('game:error', { message: error });

        rooms.set(roomCode, { ...live, state: newState });
        io.to(roomCode).emit('game:hukm_declared', {
          suit, declaredBy: socket.user.username,
        });
        broadcastState(io, roomCode, newState);
      } catch (err) { logger.error('game:hukm', err); }
    });

    // ── SKIP HUKM ────────────────────────────────────────
    socket.on('game:skip_hukm', async ({ roomCode }) => {
      try {
        const live = rooms.get(roomCode);
        if (!live) return;
        const { newState, error } = skipHukm(live.state, socket.user.id);
        if (error) return socket.emit('game:error', { message: error });
        rooms.set(roomCode, { ...live, state: newState });
        io.to(roomCode).emit('game:hukm_declared', { suit: null, declaredBy: socket.user.username });
        broadcastState(io, roomCode, newState);

        // If AI goes first after hukm skip
        const { rows: [roomRow] } = await db.query('SELECT * FROM game_rooms WHERE room_code=$1', [roomCode]);
        if (roomRow.is_vs_ai) setTimeout(() => triggerAiTurns(io, roomCode, roomRow), 600);
      } catch (err) { logger.error('game:skip_hukm', err); }
    });

    // ── PLAY CARD ────────────────────────────────────────
    socket.on('game:play', async ({ roomCode, cardId }) => {
      try {
        const live = rooms.get(roomCode);
        if (!live) return socket.emit('game:error', { message: 'Game not active' });

        const { rows: [roomRow] } = await db.query(
          'SELECT * FROM game_rooms WHERE room_code=$1', [roomCode]
        );

        const result = playCard(live.state, socket.user.id, cardId);
        if (result.error) return socket.emit('game:error', { message: result.error });

        const { newState, trickComplete, trickWinner, roundComplete, gameOver, roundWinner, gameWinner } = result;
        rooms.set(roomCode, { ...live, state: newState });

        await persistTrick(live, newState, trickComplete);

        if (gameOver) {
          await endGame(io, roomCode, newState, live.sessionId, live.startedAt, roomRow);
          return;
        }

        if (roundComplete) {
          io.to(roomCode).emit('game:round_end', {
            roundWinner,
            scores: newState.tricksWon,
            sessionScores: newState.sessionScores,
          });
          broadcastState(io, roomCode, newState);
          return;
        }

        if (trickComplete) {
          io.to(roomCode).emit('game:trick_end', {
            trickWinner,
            trick:   live.state.currentTrick,   // the completed trick
            tricksWon: newState.tricksWon,
          });
          broadcastState(io, roomCode, newState);

          if (roomRow.is_vs_ai) {
            setTimeout(() => triggerAiTurns(io, roomCode, roomRow), 900);
          }
          return;
        }

        broadcastState(io, roomCode, newState);

        // If next player is AI, trigger
        if (roomRow.is_vs_ai) {
          const nextPid = getNextToPlayFromState(newState);
          if (nextPid && live.aiPlayers?.includes(nextPid)) {
            setTimeout(() => triggerAiTurns(io, roomCode, roomRow), 700);
          }
        }
      } catch (err) { logger.error('game:play', err); socket.emit('game:error', { message: 'Server error' }); }
    });

    // ── NEXT ROUND ───────────────────────────────────────
    socket.on('game:next_round', async ({ roomCode }) => {
      try {
        const live = rooms.get(roomCode);
        if (!live) return;
        const { rows: [room] } = await db.query('SELECT * FROM game_rooms WHERE room_code=$1', [roomCode]);
        if (room.host_id !== socket.user.id) return socket.emit('game:error', { message: 'Only host can start next round' });

        const { newState, error } = startNextRound(live.state);
        if (error) return socket.emit('game:error', { message: error });

        rooms.set(roomCode, { ...live, state: newState });
        broadcastState(io, roomCode, newState);
        io.to(roomCode).emit('game:round_started', { round: newState.currentRound });

        // AI hukm
        if (room.is_vs_ai && newState.phase === 'hukm') {
          const aiId = live.aiPlayers?.[0];
          if (aiId && newState.currentLeader === aiId) {
            setTimeout(() => {
              const l = rooms.get(roomCode);
              if (!l) return;
              const suit = chooseHukm(l.state, aiId);
              const { newState: ns } = suit ? declareHukm(l.state, aiId, suit) : skipHukm(l.state, aiId);
              rooms.set(roomCode, { ...l, state: ns });
              io.to(roomCode).emit('game:hukm_declared', { suit, declaredBy: 'AI' });
              broadcastState(io, roomCode, ns);
            }, 1200);
          }
        }
      } catch (err) { logger.error('game:next_round', err); }
    });

    // ── CHAT ─────────────────────────────────────────────
    socket.on('room:chat', ({ roomCode, message }) => {
      if (!message?.trim() || message.length > 200) return;
      io.to(roomCode).emit('room:message', {
        userId: socket.user.id, username: socket.user.username,
        message: message.trim(), ts: new Date().toISOString(),
      });
    });

    // ── LEAVE ─────────────────────────────────────────────
    socket.on('room:leave', ({ roomCode }) => handleLeave(io, socket, roomCode));
    socket.on('disconnect', () => logger.info(`Disconnected: ${socket.user.username}`));
  });
}

// ── Helpers ──────────────────────────────────────────────────

async function startGame(io, roomCode, room) {
  const { rows: dbPlayers } = await db.query(
    'SELECT rp.*,u.username FROM room_players rp JOIN users u ON u.id=rp.user_id WHERE rp.room_id=$1 ORDER BY rp.seat_index',
    [room.id]
  );

  let playerIds = dbPlayers.map(p => p.user_id);
  let aiPlayers = [];

  // Add AI players if vs-AI mode and not enough humans
  if (room.is_vs_ai) {
    const aiCount = room.max_players - playerIds.length;
    for (let i = 0; i < aiCount; i++) {
      const aiId = `AI_${i + 1}`;
      playerIds.push(aiId);
      aiPlayers.push(aiId);
    }
  }

  const state   = dealRound(createGameState(room.theme_slug, playerIds, room.num_rounds, room.hukm_allowed));
  const memory  = createMemory(room.theme_slug, playerIds);
  const { rows: [session] } = await db.query(
    'INSERT INTO game_sessions(room_id,theme_id)VALUES($1,$2)RETURNING id',
    [room.id, room.theme_id]
  );

  await db.query("UPDATE game_rooms SET status='active',started_at=NOW() WHERE room_code=$1", [roomCode]);

  rooms.set(roomCode, { state, sessionId: session.id, startedAt: Date.now(), aiPlayers, memory });
  logger.info(`Game started in ${roomCode}`);

  // Send personalised state to each socket in room
  const socketsInRoom = await io.in(roomCode).fetchSockets();
  for (const s of socketsInRoom) {
    s.emit('room:start', serialiseForPlayer(state, s.user?.id));
  }

  // AI goes first if needed
  if (room.is_vs_ai) {
    const nextPid = getNextToPlayFromState(state);
    if (aiPlayers.includes(nextPid) || state.phase === 'hukm' && aiPlayers.includes(state.currentLeader)) {
      setTimeout(() => triggerAiTurns(io, roomCode, room), 1000);
    }
  }
}

async function triggerAiTurns(io, roomCode, room) {
  const live = rooms.get(roomCode);
  if (!live || live.state.phase === 'game_over' || live.state.phase === 'round_end') return;

  const { state, aiPlayers, memory } = live;

  // Hukm phase — AI leader declares
  if (state.phase === 'hukm' && aiPlayers.includes(state.currentLeader)) {
    const suit = chooseHukm(state, state.currentLeader);
    const { newState } = suit
      ? declareHukm(state, state.currentLeader, suit)
      : skipHukm(state, state.currentLeader);
    rooms.set(roomCode, { ...live, state: newState });
    io.to(roomCode).emit('game:hukm_declared', { suit: suit || null, declaredBy: 'AI' });
    broadcastState(io, roomCode, newState);
    setTimeout(() => triggerAiTurns(io, roomCode, room), 800);
    return;
  }

  if (state.phase !== 'playing') return;

  // Find next AI player
  const nextPid = getNextToPlayFromState(state);
  if (!nextPid || !aiPlayers.includes(nextPid)) return;

  const { move } = { move: getAiMove(state, nextPid, room.ai_difficulty, memory) };
  if (!move) return; // move is a cardId string

  // getAiMove returns a cardId
  const cardId = typeof move === 'string' ? move : move;

  const result = playCard(state, nextPid, cardId);
  if (result.error) return;

  const { newState, trickComplete, trickWinner, roundComplete, gameOver, roundWinner, gameWinner } = result;

  if (trickComplete && memory) updateMemory(memory, state.currentTrick.concat({ playerId: nextPid, card: state.hands[nextPid].find(c=>c.id===cardId) }));
  rooms.set(roomCode, { ...live, state: newState, memory });

  if (gameOver) {
    await endGame(io, roomCode, newState, live.sessionId, live.startedAt, room);
    return;
  }
  if (roundComplete) {
    io.to(roomCode).emit('game:round_end', { roundWinner, scores: newState.tricksWon, sessionScores: newState.sessionScores });
    broadcastState(io, roomCode, newState);
    return;
  }
  if (trickComplete) {
    io.to(roomCode).emit('game:trick_end', { trickWinner, trick: state.currentTrick, tricksWon: newState.tricksWon });
    broadcastState(io, roomCode, newState);
    const next = getNextToPlayFromState(newState);
    if (next && aiPlayers.includes(next)) setTimeout(() => triggerAiTurns(io, roomCode, room), 900);
    return;
  }

  broadcastState(io, roomCode, newState);
  // Chain: if next is also AI
  const next2 = getNextToPlayFromState(newState);
  if (next2 && aiPlayers.includes(next2)) setTimeout(() => triggerAiTurns(io, roomCode, room), 700);
}

async function endGame(io, roomCode, state, sessionId, startedAt, room) {
  const duration    = Math.round((Date.now() - startedAt) / 1000);
  const winnerId    = state.gameWinner && !state.gameWinner.startsWith('AI_') ? state.gameWinner : null;
  const finalScores = state.sessionScores;

  await db.query(
    `UPDATE game_sessions SET winner_id=$1,total_rounds=$2,duration_secs=$3,final_scores=$4,ended_at=NOW() WHERE id=$5`,
    [winnerId, state.currentRound, duration, JSON.stringify(finalScores), sessionId]
  );
  await db.query("UPDATE game_rooms SET status='finished',finished_at=NOW() WHERE room_code=$1", [roomCode]);

  io.to(roomCode).emit('game:over', {
    winner: state.gameWinner,
    winnerId,
    finalScores,
    sessionScores: state.sessionScores,
  });

  if (!room.is_vs_ai) await updateStats(sessionId).catch(() => {});
  rooms.delete(roomCode);
}

async function persistTrick(live, newState, trickComplete) {
  if (!trickComplete || !live.sessionId) return;
  // Persist round and trick data asynchronously — fire and forget
  db.query(
    `INSERT INTO tricks(round_id,trick_number,led_suit,winner_id,cards_played)
     VALUES((SELECT id FROM rounds WHERE session_id=$1 ORDER BY round_number DESC LIMIT 1),$2,$3,$4,$5)
     ON CONFLICT DO NOTHING`,
    [live.sessionId, newState.trickNumber - 1, live.state.ledSuit, null, JSON.stringify(live.state.currentTrick)]
  ).catch(() => {});
}

function broadcastState(io, roomCode, state) {
  const sockets = io.sockets.adapter.rooms.get(roomCode);
  if (!sockets) return;
  sockets.forEach(sid => {
    const s = io.sockets.sockets.get(sid);
    if (s?.user) s.emit('game:state', serialiseForPlayer(state, s.user.id));
  });
}

function getNextToPlayFromState(state) {
  const { currentTrick, playerIds, currentLeader } = state;
  const played = new Set(currentTrick.map(p => p.playerId));
  const idx    = playerIds.indexOf(currentLeader);
  const order  = [...playerIds.slice(idx), ...playerIds.slice(0, idx)];
  return order.find(pid => !played.has(pid)) || null;
}

async function handleLeave(io, socket, roomCode) {
  socket.leave(roomCode);
  io.to(roomCode).emit('room:abandoned', { message: `${socket.user.username} left.` });
  const live = rooms.get(roomCode);
  if (live) {
    await db.query("UPDATE game_rooms SET status='abandoned',finished_at=NOW() WHERE room_code=$1", [roomCode]);
    rooms.delete(roomCode);
  }
}

async function enrichPlayers(roomId) {
  const { rows } = await db.query(
    `SELECT rp.seat_index,rp.is_ready,u.id,u.username FROM room_players rp
     JOIN users u ON u.id=rp.user_id WHERE rp.room_id=$1 ORDER BY rp.seat_index`, [roomId]
  );
  return rows;
}

module.exports = { initSocket };
