// backend/src/controllers/gameController.js
const GameSession = require("../models/GameSession");
const User        = require("../models/User");
const Pattern     = require("../models/Pattern");

// Server-side score recalculation (anti-cheat)
function recalcScore({ tiles, timeLeft, totalTime, mode }) {
  const accuracy      = Math.min(100, Math.round((tiles?.length || 0) * 1.8));
  const speedBonus    = totalTime > 0 ? Math.round((timeLeft / totalTime) * 2500) : 0;
  const completionBon = accuracy >= 90 ? 1000 : 0;
  const total         = Math.min(10000, Math.round(accuracy * 50 + speedBonus + completionBon));
  return { total, accuracy, speedBonus, streakBonus: 0, completionBonus: completionBon };
}

// POST /api/game/submit
async function submitSession(req, res, next) {
  try {
    const {
      mode, festival, difficulty, patternId,
      tiles, timeLeft, totalTime, bestStreak,
      tilesPlaced, completed, roomId,
    } = req.body;

    // Recalculate server-side — never trust client score
    const score = recalcScore({ tiles, timeLeft, totalTime, mode });

    // XP formula
    const modeMultiplier = { festival: 1.5, puzzle: 1.3, symmetry: 1.2, free: 0.5, vs: 2.0 };
    const xpEarned = Math.round((score.total / 100) * (modeMultiplier[mode] || 1));

    const session = await GameSession.create({
      userId:     req.user._id,
      mode, festival, difficulty,
      patternId:  patternId || null,
      roomId:     roomId || null,
      score,
      timeTaken:  totalTime - (timeLeft || 0),
      tilesPlaced: tilesPlaced || tiles?.length || 0,
      bestStreak:  bestStreak || 0,
      completed:   completed || false,
      xpEarned,
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    user.xp    += xpEarned;
    user.stats.totalGames += 1;
    if (score.accuracy > user.stats.bestAccuracy) user.stats.bestAccuracy = score.accuracy;
    user.recalcLevel();
    await user.save();

    // Update pattern completion stats
    if (patternId) {
      await Pattern.findByIdAndUpdate(patternId, {
        $inc:  { completions: 1 },
        $set:  { avgAccuracy: score.accuracy },
      });
    }

    res.status(201).json({
      session,
      xpEarned,
      newXP:   user.xp,
      newLevel: user.level,
    });
  } catch (err) { next(err); }
}

// GET /api/game/sessions  — user's history
async function getSessions(req, res, next) {
  try {
    const { page = 1, limit = 20, festival, mode } = req.query;
    const query = { userId: req.user._id };
    if (festival) query.festival = festival;
    if (mode)     query.mode     = mode;

    const sessions = await GameSession.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(sessions);
  } catch (err) { next(err); }
}

module.exports = { submitSession, getSessions };
