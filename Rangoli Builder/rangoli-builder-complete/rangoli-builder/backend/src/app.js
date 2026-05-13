// backend/src/app.js
const express    = require("express");
const http       = require("http");
const cors       = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB        = require("./config/db");
const authRoutes       = require("./routes/auth");
const patternRoutes    = require("./routes/patterns");
const festivalRoutes   = require("./routes/festivals");
const gameRoutes       = require("./routes/game");
const leaderboardRoutes= require("./routes/leaderboard");
const errorHandler     = require("./middleware/errorHandler");
const initSocket       = require("./socket/index");
const { startChallengeScheduler } = require("./services/challengeService");

const app    = express();
const server = http.createServer(app);

// ── Socket.IO ──────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin:      process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods:     ["GET", "POST"],
    credentials: true,
  },
});
initSocket(io);

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "2mb" }));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/patterns",    patternRoutes);
app.use("/api/festivals",   festivalRoutes);
app.use("/api/game",        gameRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/api/health", (_, res) =>
  res.json({ status: "ok", timestamp: new Date() })
);

// ── Error handler ──────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🎨  Rangoli Builder API running on port ${PORT}`);

    // Start daily challenge cron (runs at midnight IST, also seeds today's challenge now)
    startChallengeScheduler();
  });
});

module.exports = { app, io };
