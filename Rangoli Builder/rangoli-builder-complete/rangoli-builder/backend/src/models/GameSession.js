// backend/src/models/GameSession.js
const mongoose = require("mongoose");

const gameSessionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mode:      { type: String, enum: ["free","puzzle","symmetry","festival","vs"], required: true },
  festival:  { type: String, required: true },
  difficulty:{ type: String, default: "easy" },
  patternId: { type: mongoose.Schema.Types.ObjectId, ref: "Pattern", default: null },
  roomId:    { type: String, default: null },        // null = solo

  score: {
    total:           { type: Number, default: 0 },
    accuracy:        { type: Number, default: 0 },   // 0–100
    speedBonus:      { type: Number, default: 0 },
    streakBonus:     { type: Number, default: 0 },
    completionBonus: { type: Number, default: 0 },
  },

  timeTaken:    { type: Number, default: 0 },         // seconds
  tilesPlaced:  { type: Number, default: 0 },
  bestStreak:   { type: Number, default: 0 },
  completed:    { type: Boolean, default: false },
  xpEarned:     { type: Number, default: 0 },

  // Snapshot of tile data for replay (optional, capped size)
  tileSnapshot: { type: mongoose.Schema.Types.Mixed, default: null },
}, { timestamps: true });

// Indexes for leaderboard queries
gameSessionSchema.index({ userId: 1, createdAt: -1 });
gameSessionSchema.index({ festival: 1, "score.total": -1 });
gameSessionSchema.index({ mode: 1, "score.total": -1 });

module.exports = mongoose.model("GameSession", gameSessionSchema);
