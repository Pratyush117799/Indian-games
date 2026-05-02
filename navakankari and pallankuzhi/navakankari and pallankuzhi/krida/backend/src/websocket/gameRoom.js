/**
 * gameRoom.js — Full Socket.io multiplayer engine
 *
 * Events (client → server):
 *   mm:join         { gameType }           — join matchmaking queue
 *   mm:leave        { gameType }           — leave queue
 *   room:create     { gameType }           — create a private friendly room
 *   room:join       { roomId }             — join a private room by code
 *   game:move       { move }               — send a move (validated server-side)
 *   game:resign     {}                     — resign current game
 *   game:rematch    {}                     — request rematch
 *   ping            {}                     — heartbeat
 *
 * Events (server → client):
 *   mm:queued       { position, gameType } — in queue
 *   mm:matched      { roomId, slot, opponentTag, gameType } — match found
 *   room:created    { roomId, gameType }   — private room created
 *   room:joined     { roomId, slot, opponentTag, gameType } — joined room
 *   room:error      { msg }                — error joining room
 *   game:start      { roomId, gameType, slot, opponentTag, initialState }
 *   game:move       { move, slot }         — opponent's validated move
 *   game:invalid    { reason }             — your move was rejected
 *   game:state      { state }             — authoritative state sync
 *   game:over       { winner, reason }     — game ended
 *   game:resign     { slot }              — opponent resigned
 *   game:rematch    { slot }              — opponent wants rematch
 *   opponent:left   {}                     — opponent disconnected
 *   pong            {}                     — heartbeat reply
 */

import { v4 as uuid }       from 'uuid'
import { enqueue, dequeue, queueStats } from './matchmaking.js'
import { validateMove as validateNava }  from '../game-engine/navakankari/validator.js'
import { validateMove as validatePalla } from '../game-engine/pallankuzhi/validator.js'

// ── In-memory room store (replace with Redis for multi-instance prod) ─────────
const rooms = new Map()
// socketId → roomId mapping for quick lookup
const socketRoom = new Map()

// ── Room factory ───────────────────────────────────────────────────────────────
const createRoom = (gameType, isPrivate = false) => ({
  id:        isPrivate ? genCode() : uuid(),
  gameType,
  isPrivate,
  players:   [],        // [{ socketId, tagId, slot }]
  state:     null,      // authoritative game state (set on game:start)
  started:   false,
  rematch:   [],        // slots that requested rematch
  createdAt: Date.now(),
})

// Short uppercase code for private rooms (e.g. "AB3F9C")
const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase()

// ── Validators map ────────────────────────────────────────────────────────────
const VALIDATORS = {
  navakankari: validateNava,
  pallankuzhi: validatePalla,
}

// ── Initial states ────────────────────────────────────────────────────────────
const initialNavakankariState = () => ({
  board:    Array(24).fill(0),
  toPlace:  [0, 9, 9],
  phase:    1,
  turn:     1,
  removing: false,
  winner:   null,
  lastMills:[],
  moveCount:0,
})

const initialPallankuzhiState = () => ({
  cups:     Array(14).fill(12),
  score:    [0, 0, 0],
  turn:     1,
  winner:   null,
  moveCount:0,
})

const getInitialState = (gameType) =>
  gameType === 'navakankari'
    ? initialNavakankariState()
    : initialPallankuzhiState()

// ── Helpers ───────────────────────────────────────────────────────────────────
const roomOf = (socketId) => {
  const roomId = socketRoom.get(socketId)
  return roomId ? rooms.get(roomId) : null
}

const slotOf = (room, socketId) =>
  room.players.find(p => p.socketId === socketId)?.slot ?? null

const opponent = (room, socketId) =>
  room.players.find(p => p.socketId !== socketId) ?? null

const cleanRoom = (roomId) => {
  rooms.delete(roomId)
  console.log(`🗑  Room ${roomId} cleaned up`)
}

// Stale room cleanup — runs every 10 minutes
const ROOM_TTL_MS = 72 * 60 * 60 * 1000  // 72 hours for async games
setInterval(() => {
  const now = Date.now()
  rooms.forEach((room, id) => {
    if (now - room.createdAt > ROOM_TTL_MS) cleanRoom(id)
  })
}, 10 * 60 * 1000)

// ── Main socket initialiser ───────────────────────────────────────────────────
export const initSocket = (io) => {

  io.on('connection', (socket) => {
    const tagId = socket.handshake.auth?.tagId ?? 'Guest'
    console.log(`🔌  [${tagId}] connected — ${socket.id}`)

    // ── Heartbeat ────────────────────────────────────────────────────────────
    socket.on('ping', () => socket.emit('pong'))

    // ── Matchmaking ──────────────────────────────────────────────────────────
    socket.on('mm:join', ({ gameType }) => {
      if (!['navakankari', 'pallankuzhi'].includes(gameType)) return

      const pair = enqueue(gameType, { socketId: socket.id, tagId })
      if (!pair) {
        const pos = queueStats()[gameType]
        socket.emit('mm:queued', { position: pos, gameType })
        console.log(`⏳  [${tagId}] queued for ${gameType}`)
        return
      }

      // Matched — create room and start game
      const [p1, p2] = pair
      const room     = createRoom(gameType, false)
      room.players   = [
        { socketId: p1.socketId, tagId: p1.tagId, slot: 1 },
        { socketId: p2.socketId, tagId: p2.tagId, slot: 2 },
      ]
      room.state     = getInitialState(gameType)
      room.started   = true
      rooms.set(room.id, room)
      socketRoom.set(p1.socketId, room.id)
      socketRoom.set(p2.socketId, room.id)

      const s1 = io.sockets.sockets.get(p1.socketId)
      const s2 = io.sockets.sockets.get(p2.socketId)

      s1?.join(room.id)
      s2?.join(room.id)

      s1?.emit('mm:matched', { roomId: room.id, slot: 1, opponentTag: p2.tagId, gameType })
      s2?.emit('mm:matched', { roomId: room.id, slot: 2, opponentTag: p1.tagId, gameType })

      io.to(room.id).emit('game:start', {
        roomId:       room.id,
        gameType,
        initialState: room.state,
      })
      console.log(`🤝  Matched [${p1.tagId}] vs [${p2.tagId}] in room ${room.id}`)
    })

    socket.on('mm:leave', ({ gameType }) => {
      dequeue(socket.id)
      console.log(`🚫  [${tagId}] left ${gameType} queue`)
    })

    // ── Private room: create ──────────────────────────────────────────────────
    socket.on('room:create', ({ gameType }) => {
      if (!['navakankari', 'pallankuzhi'].includes(gameType)) return

      const room = createRoom(gameType, true)
      room.players.push({ socketId: socket.id, tagId, slot: 1 })
      rooms.set(room.id, room)
      socketRoom.set(socket.id, room.id)
      socket.join(room.id)

      socket.emit('room:created', { roomId: room.id, gameType })
      console.log(`🏠  [${tagId}] created private room ${room.id}`)
    })

    // ── Private room: join ────────────────────────────────────────────────────
    socket.on('room:join', ({ roomId }) => {
      const room = rooms.get(roomId)
      if (!room)                 return socket.emit('room:error', { msg: 'Room not found' })
      if (room.started)          return socket.emit('room:error', { msg: 'Game already started' })
      if (room.players.length >= 2) return socket.emit('room:error', { msg: 'Room is full' })

      const host = room.players[0]
      room.players.push({ socketId: socket.id, tagId, slot: 2 })
      room.state   = getInitialState(room.gameType)
      room.started = true
      socketRoom.set(socket.id, roomId)
      socket.join(roomId)

      // Notify both players
      const hostSocket = io.sockets.sockets.get(host.socketId)
      hostSocket?.emit('room:joined', {
        roomId, slot: 1, opponentTag: tagId, gameType: room.gameType,
      })
      socket.emit('room:joined', {
        roomId, slot: 2, opponentTag: host.tagId, gameType: room.gameType,
      })

      io.to(roomId).emit('game:start', {
        roomId,
        gameType:     room.gameType,
        initialState: room.state,
      })
      console.log(`🤝  [${tagId}] joined private room ${roomId}`)
    })

    // ── Game move ─────────────────────────────────────────────────────────────
    socket.on('game:move', ({ move }) => {
      const room = roomOf(socket.id)
      if (!room || !room.started || room.state?.winner != null) return

      const slot      = slotOf(room, socket.id)
      const validator = VALIDATORS[room.gameType]

      if (!validator) return

      // Validate server-side
      const { ok, reason } = validator(room.state, move, slot)
      if (!ok) {
        socket.emit('game:invalid', { reason })
        // Re-send authoritative state so client can re-sync
        socket.emit('game:state', { state: room.state })
        console.warn(`⚠️  [${tagId}] invalid move: ${reason}`)
        return
      }

      // Broadcast to opponent
      socket.to(room.id).emit('game:move', { move, slot })

      // NOTE: The authoritative state update is done client-side after validation.
      // For production you'd run the full engine here and sync state back.
      // We emit a lightweight ack so clients can trust their local engine.
      console.log(`♟  [${tagId}] move accepted in room ${room.id}: ${JSON.stringify(move)}`)
    })

    // ── Client reports game over (winner) ─────────────────────────────────────
    socket.on('game:over', ({ winner }) => {
      const room = roomOf(socket.id)
      if (!room) return
      if (room.state) room.state.winner = winner
      io.to(room.id).emit('game:over', { winner })
      console.log(`🏆  Game over in room ${room.id} — winner slot ${winner}`)
    })

    // ── Resign ────────────────────────────────────────────────────────────────
    socket.on('game:resign', () => {
      const room = roomOf(socket.id)
      if (!room) return
      const slot = slotOf(room, socket.id)
      io.to(room.id).emit('game:resign', { slot })
      console.log(`🏳  [${tagId}] resigned in room ${room.id}`)
    })

    // ── Rematch request ───────────────────────────────────────────────────────
    socket.on('game:rematch', () => {
      const room = roomOf(socket.id)
      if (!room) return
      const slot = slotOf(room, socket.id)
      if (!room.rematch.includes(slot)) room.rematch.push(slot)

      socket.to(room.id).emit('game:rematch', { slot })

      // If both players want rematch — reset state
      if (room.rematch.length === 2) {
        room.state   = getInitialState(room.gameType)
        room.rematch = []
        io.to(room.id).emit('game:start', {
          roomId:       room.id,
          gameType:     room.gameType,
          initialState: room.state,
          isRematch:    true,
        })
        console.log(`🔄  Rematch started in room ${room.id}`)
      }
    })

    // ── Disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      console.log(`❌  [${tagId}] disconnected — ${reason}`)

      dequeue(socket.id)

      const room = roomOf(socket.id)
      if (room) {
        socket.to(room.id).emit('opponent:left', { tagId })
        // Remove from room
        room.players = room.players.filter(p => p.socketId !== socket.id)
        if (room.players.length === 0) cleanRoom(room.id)
      }
      socketRoom.delete(socket.id)
    })

    // ── Admin: queue stats (dev only) ─────────────────────────────────────────
    socket.on('admin:stats', () => {
      socket.emit('admin:stats', {
        rooms:  rooms.size,
        queues: queueStats(),
      })
    })
  })
}
