// backend/src/models/Room.js
const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username:   String,
  avatar:     String,
  socketId:   String,
  score:      { type: Number, default: 0 },
  accuracy:   { type: Number, default: 0 },
  tilesPlaced:{ type: Number, default: 0 },
  ready:      { type: Boolean, default: false },
  finishedAt: { type: Date, default: null },
  rank:       { type: Number, default: null },
}, { _id: false });

const roomSchema = new mongoose.Schema({
  roomCode:   { type: String, required: true, unique: true, uppercase: true, length: 6 },
  hostId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  mode:       { type: String, enum: ["headtohead","scoreattack","coop"], default: "headtohead" },
  festival:   { type: String, required: true },
  difficulty: { type: String, default: "easy" },
  patternId:  { type: mongoose.Schema.Types.ObjectId, ref: "Pattern", default: null },
  timeLimit:  { type: Number, default: 600 },
  maxPlayers: { type: Number, default: 4, min: 2, max: 4 },

  players:    [playerSchema],

  status:     {
    type: String,
    enum: ["waiting","starting","active","finished"],
    default: "waiting",
  },

  startedAt:  { type: Date, default: null },
  endedAt:    { type: Date, default: null },
}, { timestamps: true });

roomSchema.index({ roomCode: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // auto-delete old rooms

module.exports = mongoose.model("Room", roomSchema);
