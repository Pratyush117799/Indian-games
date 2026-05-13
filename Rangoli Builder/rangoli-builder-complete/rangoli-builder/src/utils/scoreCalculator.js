// utils/scoreCalculator.js
import { SCORE_WEIGHTS } from "./constants";

/**
 * Calculate a game score given:
 *   accuracy     — 0–100 (% of tiles correctly placed)
 *   timeLeft     — seconds remaining when player finished
 *   totalTime    — total seconds allowed
 *   streak       — longest consecutive correct placement streak
 *   completed    — boolean: did player finish 100%?
 */
export function calculateScore({ accuracy, timeLeft, totalTime, streak, completed }) {
  const { MAX_SCORE, ACCURACY, SPEED, STREAK, COMPLETION } = SCORE_WEIGHTS;

  const accuracyScore    = (accuracy / 100) * MAX_SCORE * ACCURACY;
  const speedBonus       = totalTime > 0 ? (timeLeft / totalTime) * MAX_SCORE * SPEED : 0;
  const streakBonus      = Math.min(streak / 20, 1) * MAX_SCORE * STREAK;  // caps at streak=20
  const completionBonus  = completed ? MAX_SCORE * COMPLETION : 0;

  const total = Math.round(accuracyScore + speedBonus + streakBonus + completionBonus);
  return {
    total: Math.min(total, MAX_SCORE),
    breakdown: {
      accuracyScore:   Math.round(accuracyScore),
      speedBonus:      Math.round(speedBonus),
      streakBonus:     Math.round(streakBonus),
      completionBonus: Math.round(completionBonus),
    },
  };
}

/**
 * Calculate XP earned from a game session.
 */
export function calculateXP({ score, mode, festival }) {
  const base = Math.floor(score / 100);  // 1 XP per 100 points
  const modeBonus = { festival: 1.5, puzzle: 1.3, symmetry: 1.2, free: 0.5, vs: 2.0 };
  return Math.round(base * (modeBonus[mode] || 1));
}
