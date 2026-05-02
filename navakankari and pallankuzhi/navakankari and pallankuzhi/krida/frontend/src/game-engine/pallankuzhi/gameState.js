/**
 * gameState.js — Pallankuzhi (Mancala) game engine
 *
 * Board: 2 rows × 7 cups = 14 cups
 * cups[0..6]  = player 1's row (bottom, human)
 * cups[7..13] = player 2's row (top, AI)
 *
 * Standard setup: 12 seeds per cup = 168 seeds total (some variants use 146)
 * Capture rule: land on empty cup preceded (in sow direction) by a cup with seeds.
 */

export const CUPS_PER_ROW = 7
export const SEEDS_PER_CUP = 12
export const TOTAL_CUPS = 14

// Row ownership: which cups belong to which player
export const PLAYER_ROWS = {
  1: [0, 1, 2, 3, 4, 5, 6],   // human  — bottom row
  2: [7, 8, 9, 10, 11, 12, 13], // AI    — top row
}

// Clockwise sow order for each player
// P1 sows right along their row, then right-to-left along P2's row
// P2 sows right-to-left along their row, then left-to-right along P1's row
const SOW_ORDER_P1 = [0,1,2,3,4,5,6, 13,12,11,10,9,8,7]
const SOW_ORDER_P2 = [13,12,11,10,9,8,7, 0,1,2,3,4,5,6]

export const createInitialState = () => ({
  cups:    Array(TOTAL_CUPS).fill(SEEDS_PER_CUP),
  score:   [0, 0, 0],   // index 0 unused; [1]=human, [2]=AI
  turn:    1,
  winner:  null,
  lastSow: null,         // { from, path, captures } for animation
  moveCount: 0,
})

export const sowOrder = (player) =>
  player === 1 ? SOW_ORDER_P1 : SOW_ORDER_P2

/**
 * Compute next cup index in sow order after `current` for `player`.
 */
export const nextCup = (current, player) => {
  const order = sowOrder(player)
  const idx = order.indexOf(current)
  return order[(idx + 1) % order.length]
}

/**
 * Previous cup in sow order (for capture check).
 */
export const prevCup = (current, player) => {
  const order = sowOrder(player)
  const idx = order.indexOf(current)
  return order[(idx - 1 + order.length) % order.length]
}

/**
 * Apply a sow action.
 * Returns { newState, animation: { path, captures } }
 */
export const applyAction = (state, cupIndex) => {
  if (state.cups[cupIndex] === 0) return { newState: state, animation: null }

  const ns = {
    ...state,
    cups:  [...state.cups],
    score: [...state.score],
    moveCount: state.moveCount + 1,
  }

  const p     = ns.turn
  const order = sowOrder(p)
  const startIdx = order.indexOf(cupIndex)

  let seeds    = ns.cups[cupIndex]
  ns.cups[cupIndex] = 0

  // Distribute seeds one by one
  const path     = []
  const captures = []
  let pos        = startIdx

  while (seeds > 0) {
    pos = (pos + 1) % order.length
    const cup = order[pos]
    ns.cups[cup]++
    seeds--
    path.push(cup)
  }

  // Last cup
  const lastCup = order[pos]

  // Capture rule: if last cup is empty after drop (was 0 before → now 1),
  // AND the preceding cup in sow direction has seeds → capture both
  // Actually standard Pallankuzhi: land on a cup that BECOMES 2 or 4 seeds.
  // We use the Tamil Nadu rule: capture if landing cup has exactly 4 seeds.
  let captureDone = false
  let checkCup = lastCup

  while (ns.cups[checkCup] === 4) {
    captures.push(checkCup)
    ns.score[p] += 4
    ns.cups[checkCup] = 0
    // Check preceding cup in sow order
    const orderIdx = order.indexOf(checkCup)
    if (orderIdx <= 0) break
    checkCup = order[orderIdx - 1]
    captureDone = true
  }

  // Check if opponent has any seeds left
  const oppRow = PLAYER_ROWS[3 - p]
  const oppHasSeeds = oppRow.some(i => ns.cups[i] > 0)
  const myRow = PLAYER_ROWS[p]
  const myHasSeeds = myRow.some(i => ns.cups[i] > 0)

  if (!oppHasSeeds) {
    // Scoop remaining seeds on own side to own score
    myRow.forEach(i => { ns.score[p] += ns.cups[i]; ns.cups[i] = 0 })
    ns.winner = ns.score[1] > ns.score[2] ? 1 : ns.score[2] > ns.score[1] ? 2 : -1 // -1 = draw
  } else {
    ns.turn = 3 - p
  }

  ns.lastSow = { from: cupIndex, path, captures }
  return { newState: ns, animation: { path, captures } }
}

export const getLegalMoves = (state) =>
  PLAYER_ROWS[state.turn].filter(i => state.cups[i] > 0)
