// backend/src/socket/lobbyHandler.js
const Room = require("../models/Room");

// Generate a random 6-char uppercase room code
function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

module.exports = function lobbyHandler(io, socket) {
  const user = socket.user;

  // ── room:create ──────────────────────────────────────────────────────────
  socket.on("room:create", async ({ mode = "headtohead", festival = "diwali",
                                    difficulty = "easy", timeLimit = 600,
                                    maxPlayers = 4 } = {}) => {
    try {
      if (user.isGuest) return socket.emit("room:error", { message: "Login required to create rooms" });

      let roomCode, exists = true;
      while (exists) { roomCode = genCode(); exists = await Room.findOne({ roomCode }); }

      const room = await Room.create({
        roomCode,
        hostId:   user.id,
        mode, festival, difficulty, timeLimit,
        maxPlayers: Math.min(maxPlayers, 4),
        players: [{
          userId:   user.id,
          username: user.username,
          avatar:   user.avatar || "",
          socketId: socket.id,
          ready:    false,
        }],
        status: "waiting",
      });

      socket.join(roomCode);
      socket.emit("room:created", { roomCode, room: room.toObject() });
      console.log(`🎮 Room created: ${roomCode} by ${user.username}`);
    } catch (err) {
      console.error("room:create error:", err);
      socket.emit("room:error", { message: "Could not create room" });
    }
  });

  // ── room:join ────────────────────────────────────────────────────────────
  socket.on("room:join", async ({ roomCode } = {}) => {
    try {
      const room = await Room.findOne({ roomCode: roomCode?.toUpperCase() });
      if (!room)                          return socket.emit("room:error", { message: "Room not found" });
      if (room.status !== "waiting")      return socket.emit("room:error", { message: "Game already started" });
      if (room.players.length >= room.maxPlayers)
                                          return socket.emit("room:error", { message: "Room is full" });

      // Prevent duplicate joins
      const alreadyIn = room.players.some(p => p.userId?.toString() === user.id);
      if (!alreadyIn) {
        room.players.push({
          userId:   user.id,
          username: user.username,
          avatar:   user.avatar || "",
          socketId: socket.id,
          ready:    false,
        });
        await room.save();
      }

      socket.join(roomCode);
      io.to(roomCode).emit("room:updated", room.toObject());
      console.log(`👤 ${user.username} joined room ${roomCode}`);
    } catch (err) {
      console.error("room:join error:", err);
      socket.emit("room:error", { message: "Could not join room" });
    }
  });

  // ── room:leave ───────────────────────────────────────────────────────────
  socket.on("room:leave", async ({ roomCode } = {}) => {
    try {
      const room = await Room.findOne({ roomCode });
      if (!room) return;

      room.players = room.players.filter(p => p.userId?.toString() !== user.id);

      if (room.players.length === 0) {
        await room.deleteOne();
      } else {
        // Transfer host if needed
        if (room.hostId?.toString() === user.id) {
          room.hostId = room.players[0].userId;
        }
        await room.save();
        io.to(roomCode).emit("room:updated", room.toObject());
      }

      socket.leave(roomCode);
      socket.emit("room:left", { roomCode });
    } catch (err) {
      console.error("room:leave error:", err);
    }
  });

  // ── room:ready ───────────────────────────────────────────────────────────
  socket.on("room:ready", async ({ roomCode } = {}) => {
    try {
      const room = await Room.findOne({ roomCode });
      if (!room) return;

      const player = room.players.find(p => p.userId?.toString() === user.id);
      if (player) { player.ready = !player.ready; }
      await room.save();

      io.to(roomCode).emit("room:updated", room.toObject());

      // Auto-start if all players ready (min 2)
      const allReady = room.players.length >= 2 &&
                       room.players.every(p => p.ready);
      if (allReady && room.status === "waiting") {
        // 3-second countdown
        io.to(roomCode).emit("room:starting", { countdown: 3 });
        let count = 3;
        const interval = setInterval(async () => {
          count--;
          if (count > 0) {
            io.to(roomCode).emit("room:starting", { countdown: count });
          } else {
            clearInterval(interval);
            room.status    = "active";
            room.startedAt = new Date();
            await room.save();
            io.to(roomCode).emit("game:start", {
              room: room.toObject(),
              startedAt: room.startedAt,
            });
          }
        }, 1000);
      }
    } catch (err) {
      console.error("room:ready error:", err);
    }
  });

  // ── room:browse  (lobby listing) ─────────────────────────────────────────
  socket.on("room:browse", async () => {
    try {
      const rooms = await Room.find({ status: "waiting" })
        .select("roomCode mode festival difficulty players maxPlayers hostId")
        .limit(20)
        .sort({ createdAt: -1 });
      socket.emit("room:list", rooms);
    } catch (err) {
      socket.emit("room:list", []);
    }
  });

  // ── Handle unexpected disconnect: remove from rooms ──────────────────────
  socket.on("disconnect", async () => {
    try {
      const rooms = await Room.find({
        "players.socketId": socket.id,
        status: { $in: ["waiting", "starting"] },
      });
      for (const room of rooms) {
        room.players = room.players.filter(p => p.socketId !== socket.id);
        if (room.players.length === 0) {
          await room.deleteOne();
        } else {
          if (room.hostId?.toString() === user.id) room.hostId = room.players[0].userId;
          await room.save();
          io.to(room.roomCode).emit("room:updated", room.toObject());
        }
      }
    } catch { /* silent */ }
  });
};
