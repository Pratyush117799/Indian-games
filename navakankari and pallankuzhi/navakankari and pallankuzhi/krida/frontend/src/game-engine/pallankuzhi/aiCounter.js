/**
 * aiCounter.js — Pallankuzhi AI
 * Strategy: greedy look-ahead with capture priority.
 * Simulates each legal move and scores by seeds captured + future threat.
 */

import { applyAction, getLegalMoves, PLAYER_ROWS, sowOrder } from './gameState.js'

/**
 * Score a move by simulating it and evaluating the result.
 */
const scoreMoveResult = (state, cupIndex) => {
  const { newState } = applyAction(state, cupIndex)
  let score = 0

  // Direct captures earned
  score += (newState.score[2] - state.score[2]) * 10

  // Cups with 3 seeds on AI row = potential capture setups
  PLAYER_ROWS[2].forEach(i => {
    if (newState.cups[i] === 3) score += 3
    if (newState.cups[i] === 2) score += 1
  })

  // Deny opponent: penalise cups that give opponent 4-cup captures
  PLAYER_ROWS[1].forEach(i => {
    if (newState.cups[i] === 4) score -= 6
    if (newState.cups[i] === 3) score -= 2
  })

  // Seed count advantage
  const aiSeeds = PLAYER_ROWS[2].reduce((s, i) => s + newState.cups[i], 0)
  const huSeeds = PLAYER_ROWS[1].reduce((s, i) => s + newState.cups[i], 0)
  score += (aiSeeds - huSeeds) * 0.2

  return score
}

/**
 * Get AI's best cup to sow from.
 * difficulty: 'easy' | 'medium' | 'hard'
 */
export const getAIMove = (state, difficulty = 'medium') => {
  const moves = getLegalMoves(state)
  if (!moves.length) return null

  // Easy: random
  if (difficulty === 'easy') return moves[Math.floor(Math.random() * moves.length)]

  // Score all moves
  const scored = moves.map(cup => ({ cup, score: scoreMoveResult(state, cup) }))
  scored.sort((a, b) => b.score - a.score)

  // Medium: top move with 20% noise
  if (difficulty === 'medium' && Math.random() < 0.2)
    return scored[Math.min(1, scored.length - 1)].cup

  return scored[0].cup
}
