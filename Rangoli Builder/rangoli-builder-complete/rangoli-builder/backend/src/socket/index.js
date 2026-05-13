// backend/src/socket/index.js
const jwt          = require("jsonwebtoken");
const User         = require("../models/User");
const lobbyHandler = require("./lobbyHandler");
const gameHandler  = require("./gameHandler");
const chatHandler  = require("./chatHandler");

module.exports = function initSocket(io) {
  // ── Auth middleware for every socket connection ──────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token ||
                    socket.handshake.headers?.authorization?.slice(7);
      if (!token) {
        // Allow guest connections for spectating; mark as guest
        socket.user = { id: "guest_" + socket.id, username: "Guest", isGuest: true };
        return next();
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user    = await User.findById(payload.id).select("username avatar level xp");
      if (!user) return next(new Error("User not found"));
      socket.user = { id: user._id.toString(), username: user.username,
                      avatar: user.avatar, level: user.level, isGuest: false };
      next();
    } catch {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.username} (${socket.id})`);

    // Register handlers
    lobbyHandler(io, socket);
    gameHandler(io, socket);
    chatHandler(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.user.username} — ${reason}`);
    });
  });
};
