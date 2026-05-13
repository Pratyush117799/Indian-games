// backend/src/controllers/leaderboardController.js
const GameSession = require("../models/GameSession");

// GET /api/leaderboard/:festival
async function getFestivalLeaderboard(req, res, next) {
  try {
    const { festival } = req.params;
    const { mode = "festival", limit = 50 } = req.query;

    const top = await GameSession.aggregate([
      { $match: { festival, mode } },
      { $sort:  { "score.total": -1 } },
      {
        $group: {
          _id:       "$userId",
          bestScore: { $max: "$score.total" },
          sessionId: { $first: "$_id" },
          accuracy:  { $first: "$score.accuracy" },
          timeTaken: { $first: "$timeTaken" },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort:  { bestScore: -1 } },
      { $limit: Number(limit) },
      {
        $lookup: {
          from:         "users",
          localField:   "_id",
          foreignField: "_id",
          as:           "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId:    "$_id",
          username:  "$user.username",
          avatar:    "$user.avatar",
          level:     "$user.level",
          bestScore: 1,
          accuracy:  1,
          timeTaken: 1,
          createdAt: 1,
        },
      },
    ]);

    const ranked = top.map((entry, i) => ({ ...entry, rank: i + 1 }));
    res.json(ranked);
  } catch (err) { next(err); }
}

// GET /api/leaderboard/global
async function getGlobalLeaderboard(req, res, next) {
  try {
    const { limit = 100 } = req.query;

    const top = await GameSession.aggregate([
      { $sort: { "score.total": -1 } },
      {
        $group: {
          _id:       "$userId",
          bestScore: { $max: "$score.total" },
          festival:  { $first: "$festival" },
          mode:      { $first: "$mode" },
        },
      },
      { $sort:  { bestScore: -1 } },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: "users", localField: "_id", foreignField: "_id", as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId:   "$_id",
          username: "$user.username",
          avatar:   "$user.avatar",
          level:    "$user.level",
          bestScore: 1,
          festival:  1,
          mode:      1,
        },
      },
    ]);

    res.json(top.map((e, i) => ({ ...e, rank: i + 1 })));
  } catch (err) { next(err); }
}

module.exports = { getFestivalLeaderboard, getGlobalLeaderboard };
