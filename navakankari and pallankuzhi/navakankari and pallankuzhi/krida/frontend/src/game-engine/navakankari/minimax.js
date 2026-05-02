/**
 * minimax.js
 * Alpha-beta minimax AI for Navakankari.
 * Player 2 = AI (maximizing), Player 1 = Human (minimizing).
 */

import { MILLS, ADJ } from './boardGeometry.js'
import {
  countOnBoard, isFlying, millNodeSet,
  generateMoves, applyAction
} from './gameState.js'

// ─── Evaluation heuristic ─────────────────────────────────────────────────────

const WEIGHTS = {
  WIN:          100_000,
  MILL:         50,
  BLOCKED_OPP:  20,
  TWO_IN_MILL:  8,
  ONE_IN_MILL:  2,
  PIECE:        10,
  MOBILITY:     2,
  CENTER:       3,
}

// High-connectivity nodes: midpoints that touch 3 lines each
const HIGH_VALUE_NODES = new Set([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23])

export const evaluate = (state) => {
  if (state.winner === 2) return  WEIGHTS.WIN
  if (state.winner === 1) return -WEIGHTS.WIN

  const { board, toPlace, phase } = state
  let score = 0

  // Piece advantage
  score += (countOnBoard(board, 2) - countOnBoard(board, 1)) * WEIGHTS.PIECE

  // Mill analysis
  MILLS.forEach(mill => {
    const ai  = mill.filter(n => board[n] === 2).length
    const hu  = mill.filter(n => board[n] === 1).length
    const em  = mill.filter(n => board[n] === 0).length

    if (hu === 0) {
      if (ai === 3)           score += WEIGHTS.MILL
      else if (ai === 2 && em === 1) score += WEIGHTS.TWO_IN_MILL
      else if (ai === 1 && em === 2) score += WEIGHTS.ONE_IN_MILL
    }
    if (ai === 0) {
      if (hu === 3)           score -= WEIGHTS.MILL
      else if (hu === 2 && em === 1) score -= WEIGHTS.TWO_IN_MILL
      else if (hu === 1 && em === 2) score -= WEIGHTS.ONE_IN_MILL
    }
  })

  // Mobility in phase 2
  if (phase === 2) {
    const mob = (p) => isFlying(board, toPlace, p)
      ? 24
      : board.reduce((c, v, i) => v === p
          ? c + ADJ[i].filter(j => board[j] === 0).length
          : c, 0)
    score += (mob(2) - mob(1)) * WEIGHTS.MOBILITY
  }

  // High-value node occupation
  for (let i = 0; i < 24; i++) {
    if (HIGH_VALUE_NODES.has(i)) {
      if (board[i] === 2) score += WEIGHTS.CENTER
      if (board[i] === 1) score -= WEIGHTS.CENTER
    }
  }

  return score
}

// ─── Minimax with alpha-beta ──────────────────────────────────────────────────

const TT = new Map() // Transposition table

const stateKey = (s) =>
  s.board.join('') + s.turn + (s.removing ? 'R' : '') + s.phase +
  s.toPlace[1] + s.toPlace[2]

const minimax = (state, depth, alpha, beta, maximizing) => {
  if (state.winner !== null || depth === 0) return { score: evaluate(state), move: null }

  const key = stateKey(state)
  if (TT.has(key)) return TT.get(key)

  const moves = generateMoves(state)
  if (!moves.length) return { score: evaluate(state), move: null }

  let bestMove = moves[0]
  let bestScore = maximizing ? -Infinity : Infinity

  for (const move of moves) {
    const next = applyAction(state, move)
    const { score } = minimax(next, depth - 1, alpha, beta, next.turn === 2)

    if (maximizing) {
      if (score > bestScore) { bestScore = score; bestMove = move }
      alpha = Math.max(alpha, score)
    } else {
      if (score < bestScore) { bestScore = score; bestMove = move }
      beta = Math.min(beta, score)
    }
    if (beta <= alpha) break
  }

  const result = { score: bestScore, move: bestMove }
  TT.set(key, result)
  return result
}

// ─── Public API ───────────────────────────────────────────────────────────────

const DEPTH = { easy: 1, medium: 3, hard: 6 }

/**
 * Returns the best move for the AI given current state and difficulty.
 * Also clears the transposition table before each root search.
 */
export const getBestMove = (state, difficulty = 'medium') => {
  TT.clear()

  // Easy: 40% random to feel human-like
  if (difficulty === 'easy' && Math.random() < 0.40) {
    const moves = generateMoves(state)
    return moves[Math.floor(Math.random() * moves.length)] ?? null
  }

  const depth = DEPTH[difficulty] ?? 3
  const { move } = minimax(state, depth, -Infinity, Infinity, true)
  return move
}
