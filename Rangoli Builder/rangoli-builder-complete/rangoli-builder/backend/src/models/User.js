// backend/src/models/User.js
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const badgeSchema = new mongoose.Schema({
  badgeId:   { type: String, required: true },
  festival:  { type: String, default: "" },
  earnedAt:  { type: Date,   default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 24 },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  avatar:       { type: String, default: "" },

  xp:           { type: Number, default: 0, min: 0 },
  level:        { type: Number, default: 1, min: 1 },

  badges:       [badgeSchema],

  stats: {
    totalGames:    { type: Number, default: 0 },
    wins:          { type: Number, default: 0 },
    bestAccuracy:  { type: Number, default: 0 },   // 0–100
    fastestTime:   { type: Number, default: null }, // seconds
    favoriteMode:  { type: String, default: "free" },
    festivalPlays: { type: Map, of: Number, default: {} },
  },

  savedDesigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pattern" }],

  refreshToken: { type: String, default: null },
}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Recalculate level from XP
userSchema.methods.recalcLevel = function () {
  const thresholds = [0, 200, 500, 1000, 2000, 4000, 8000, 15000];
  this.level = thresholds.filter(t => this.xp >= t).length;
};

// Public profile (no sensitive fields)
userSchema.methods.toPublic = function () {
  return {
    id:       this._id,
    username: this.username,
    avatar:   this.avatar,
    xp:       this.xp,
    level:    this.level,
    badges:   this.badges,
    stats:    this.stats,
  };
};

module.exports = mongoose.model("User", userSchema);
