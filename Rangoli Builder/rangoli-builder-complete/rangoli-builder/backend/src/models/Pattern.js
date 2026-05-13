// backend/src/models/Pattern.js
const mongoose = require("mongoose");

const tileSchema = new mongoose.Schema({
  shapeId:       { type: String, required: true },
  ring:          { type: Number, required: true, min: 0, max: 6 },
  segment:       { type: Number, required: true, min: 0 },
  totalSegments: { type: Number, required: true },
  color:         { type: String, required: true },
  rotation:      { type: Number, default: 0 },
}, { _id: false });

const patternSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true, maxlength: 80 },
  authorId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  festival:      { type: String, required: true },
  difficulty:    { type: String, enum: ["easy","medium","hard","expert"], default: "easy" },
  symmetryAxes:  { type: Number, enum: [1,4,6,8,12], default: 8 },

  tiles:         { type: [tileSchema], required: true },

  thumbnailUrl:  { type: String, default: "" },
  isOfficial:    { type: Boolean, default: false }, // admin-curated puzzles
  isPublic:      { type: Boolean, default: true  },

  likes:         { type: Number, default: 0 },
  likedBy:       [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  completions:   { type: Number, default: 0 },
  avgAccuracy:   { type: Number, default: 0 },
  estimatedTime: { type: Number, default: 300 }, // seconds

  // Puzzle mode: these tiles are hidden and must be filled in
  hiddenTileIndices: [Number],

  tags:          [String],
  part:          { type: Number, default: 1 },   // for multi-part rangoli
  totalParts:    { type: Number, default: 1 },
  nextPartId:    { type: mongoose.Schema.Types.ObjectId, ref: "Pattern", default: null },
}, { timestamps: true });

// Indexes
patternSchema.index({ festival: 1, difficulty: 1 });
patternSchema.index({ isOfficial: 1, isPublic: 1 });
patternSchema.index({ authorId: 1, createdAt: -1 });
patternSchema.index({ likes: -1 });

module.exports = mongoose.model("Pattern", patternSchema);
