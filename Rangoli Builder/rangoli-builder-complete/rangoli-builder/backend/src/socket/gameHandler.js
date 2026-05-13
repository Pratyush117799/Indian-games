// backend/src/socket/gameHandler.js
const Room        = require("../models/Room");
const GameSession = require("../models/GameSession");

// Track active server-side timers: roomCode → intervalId
const roomTimers = new Map();

module.exports = function gameHandler(io, socket) {
  const user = socket.user;

  // ── tile:place ────────────────────────────────────────────────────────────
  // Client places a tile; server validates and broadcasts to room
  socket.on("tile:place", async ({ roomCode, tile } = {}) => {
    if (!roomCode || !tile) return;

    // Basic validation
    if (typeof tile.ring !== "number" || tile.ring < 0 || tile.ring > 6) return;
    if (typeof tile.segment !== "number" || tile.segment < 0)            return;
    if (!tile.shapeId || !tile.color)                                     return;

    // Broadcast to everyone else in the room (not back to sender)
    socket.to(roomCode).emit("tile:placed", {
      userId:   user.id,
      username: user.username,
      tile: {
        ...tile,
        id: `${user.id}-${Date.now()}`,
        placedAt: Date.now(),
      },
    });

    // Update player tile count in room doc (throttled — every 5 tiles)
    try {
      await Room.updateOne(
        { roomCode, "players.userId": user.id },
        { $inc: { "players.$.tilesPlaced": 1 } }
      );
    } catch { /* non-critical */ }
  });

  // ── tile:undo ─────────────────────────────────────────────────────────────
  socket.on("tile:undo", ({ roomCode, tileId } = {}) => {
    if (!roomCode || !tileId) return;
    socket.to(roomCode).emit("tile:undone", { userId: user.id, tileId });
  });

  // ── game:start_timer ─────────────────────────────────────────────────────
  // Host signals that the game timer should start (server is authoritative)
  socket.on("game:start_timer", async ({ roomCode } = {}) => {
    try {
      const room = await Room.findOne({ roomCode });
      if (!room || room.status !== "active") return;
      if (room.hostId?.toString() !== user.id) return; // only host

      // Clear any existing timer
      if (roomTimers.has(roomCode)) clearInterval(roomTimers.get(roomCode));

      let timeLeft = room.timeLimit;
      const interval = setInterval(async () => {
        timeLeft--;
        io.to(roomCode).emit("game:tick", { timeLeft });

        if (timeLeft <= 0) {
          clearInterval(interval);
          roomTimers.delete(roomCode);
          await endGame(io, roomCode, "timeout");
        }
      }, 1000);

      roomTimers.set(roomCode, interval);
    } catch (err) {
      console.error("game:start_timer error:", err);
    }
  });

  // ── game:finish ───────────────────────────────────────────────────────────
  // A player signals they've finished placing tiles
  socket.on("game:finish", async ({ roomCode, accuracy, tilesPlaced, score } = {}) => {
    try {
      const room = await Room.findOne({ roomCode });
      if (!room || room.status !== "active") return;

      const player = room.players.find(p => p.userId?.toString() === user.id);
      if (!player || player.finishedAt) return; // already finished

      const finishedCount = room.players.filter(p => p.finishedAt).length;
      player.finishedAt = new Date();
      player.rank       = finishedCount + 1;
      player.score      = score || 0;
      player.accuracy   = accuracy || 0;
      await room.save();

      // Notify everyone this player finished
      io.to(roomCode).emit("game:player_finished", {
        userId:   user.id,
        username: user.username,
        rank:     player.rank,
        score:    player.score,
        accuracy: player.accuracy,
      });

      // Head-to-head: end when first player finishes
      if (room.mode === "headtohead" && player.rank === 1) {
        // Give others a 30-second grace window
        io.to(roomCode).emit("game:grace_period", { seconds: 30 });
        setTimeout(() => endGame(io, roomCode, "winner"), 30000);
      }

      // All players finished → end immediately
      const allDone = room.players.every(p => p.finishedAt);
      if (allDone) {
        if (roomTimers.has(roomCode)) {
          clearInterval(roomTimers.get(roomCode));
          roomTimers.delete(roomCode);
        }
        await endGame(io, roomCode, "all_finished");
      }
    } catch (err) {
      console.error("game:finish error:", err);
    }
  });

  // ── game:score_update ─────────────────────────────────────────────────────
  // Client pushes live score (score-attack mode) — broadcast to room
  socket.on("game:score_update", ({ roomCode, score } = {}) => {
    if (!roomCode) return;
    socket.to(roomCode).emit("game:score_update", { userId: user.id, score });
  });
};

// ── Shared end-game logic ─────────────────────────────────────────────────────
async function endGame(io, roomCode, reason) {
  try {
    const room = await Room.findOne({ roomCode });
    if (!room || room.status === "finished") return;

    room.status  = "finished";
    room.endedAt = new Date();
    await room.save();

    // Build results array sorted by rank/score
    const results = room.players
      .map(p => ({
        userId:   p.userId,
        username: p.username,
        avatar:   p.avatar,
        score:    p.score,
        accuracy: p.accuracy,
        rank:     p.rank || 99,
        finishedAt: p.finishedAt,
      }))
      .sort((a, b) => a.rank - b.rank || b.score - a.score);

    // Assign final ranks
    results.forEach((r, i) => { r.rank = i + 1; });

    io.to(roomCode).emit("game:ended", { results, reason });
    console.log(`🏁 Room ${roomCode} ended (${reason})`);
  } catch (err) {
    console.error("endGame error:", err);
  }
}
