// backend/src/socket/chatHandler.js
const EMOJI_ONLY = /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF} ]+$/u;
const ALLOWED    = ["👏","🎨","🔥","❤️","😍","🥳","👀","💪","🌸","✨","😂","🙌"];

module.exports = function chatHandler(io, socket) {
  socket.on("chat:message", ({ roomCode, message } = {}) => {
    if (!roomCode || !message) return;
    // Allow only short text or recognised emojis for safety
    const clean = String(message).slice(0, 100).trim();
    if (!clean) return;

    io.to(roomCode).emit("chat:message", {
      userId:    socket.user.id,
      username:  socket.user.username,
      message:   clean,
      timestamp: Date.now(),
    });
  });

  // Quick-react (emoji only)
  socket.on("chat:react", ({ roomCode, emoji } = {}) => {
    if (!roomCode || !ALLOWED.includes(emoji)) return;
    io.to(roomCode).emit("chat:react", {
      userId:  socket.user.id,
      username: socket.user.username,
      emoji,
    });
  });
};
