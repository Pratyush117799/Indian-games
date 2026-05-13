// backend/src/models/Challenge.js
const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  date:       { type: Date,   required: true, unique: true },
  festival:   { type: String, required: true },
  patternId:  { type: mongoose.Schema.Types.ObjectId, ref: "Pattern", required: true },
  difficulty: { type: String, default: "medium" },
  timeLimit:  { type: Number, default: 600 },   // seconds
  bonusXP:    { type: Number, default: 150 },
  participants:{ type: Number, default: 0 },

  completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

challengeSchema.index({ date: -1 });

module.exports = mongoose.model("Challenge", challengeSchema);
