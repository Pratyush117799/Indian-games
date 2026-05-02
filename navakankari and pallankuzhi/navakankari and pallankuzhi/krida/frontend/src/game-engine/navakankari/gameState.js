/**
 * gameState.js
 * Pure functions for Navakankari game state.
 * No side effects — all functions return new state objects.
 *
 * Board values: 0 = empty | 1 = human | 2 = AI
 */

import { ADJ, MILLS } from './boardGeometry.js'

// ─── State factory ────────────────────────────────────────────────────────────

export const createInitialState = () => ({
  board:     Array(24).fill(0),
  toPlace:   [0, 9, 9],   // index 0 unused; [1]=human reserve, [2]=AI reserve
  phase:     1,            // 1=placement, 2=movement+flying
  turn:      1,            // 1=human, 2=AI
  removing:  false,        // current player must remove an opponent piece
  winner:    null,         // null | 1 | 2
  lastMills: [],           // node indices that formed a mill on last move
  moveCount: 0,
})

// ─── Query helpers ────────────────────────────────────────────────────────────

export const countOnBoard = (board, player) =>
  board.reduce((c, v) => c + (v === player ? 1 : 0), 0)

export const totalPieces = (state, player) =>
  countOnBoard(state.board, player) + state.toPlace[player]

export const isFlying = (board, toPlace, player) =>
  toPlace[player] === 0 && countOnBoard(board, player) === 3

export const millNodeSet = (board, player) => {
  const set = new Set()
  MILLS.forEach(mill => {
    if (mill.every(n => board[n] === player)) mill.forEach(n => set.add(n))
  })
  return set
}

export const formsMill = (board, node, player) =>
  MILLS.some(m => m.includes(node) && m.every(n => board[n] === player))

export const getFormedMills = (board, node, player) =>
  MILLS.filter(m => m.includes(node) && m.every(n => board[n] === player))

/**
 * Returns nodes of `opponent` that can legally be removed.
 * Pieces inside mills are protected UNLESS all opponent pieces are in mills.
 */
export const removableNodes = (board, opponent) => {
  const all  = board.reduce((a, v, i) => v === opponent ? [...a, i] : a, [])
  const inM  = millNodeSet(board, opponent)
  const free = all.filter(i => !inM.has(i))
  return free.length > 0 ? free : all
}

export const isBlocked = (board, toPlace, player) => {
  if (toPlace[player] > 0)              return false // still placing
  if (isFlying(board, toPlace, player)) return false // can fly anywhere
  return !board.some((v, i) => v === player && ADJ[i].some(j => board[j] === 0))
}

export const checkWinner = (state) => {
  for (const p of [1, 2]) {
    const opp = 3 - p
    if (state.toPlace[opp] === 0 && countOnBoard(state.board, opp) < 3) return p
    if (state.phase === 2 && isBlocked(state.board, state.toPlace, opp))  return p
  }
  return null
}

// ─── Action applicator ────────────────────────────────────────────────────────

/**
 * Apply an action and return the new immutable state.
 * action: { type: 'place'|'move'|'remove', to?, from?, node? }
 */
export const applyAction = (state, action) => {
  const ns = {
    ...state,
    board:     [...state.board],
    toPlace:   [...state.toPlace],
    lastMills: [],
    moveCount: state.moveCount + 1,
  }
  const { type, from, to, node } = action
  const p = ns.turn

  if (type === 'place') {
    ns.board[to] = p
    ns.toPlace[p]--
    const formed = getFormedMills(ns.board, to, p)
    if (formed.length) {
      ns.removing  = true
      ns.lastMills = [...new Set(formed.flat())]
    } else {
      if (ns.toPlace[1] === 0 && ns.toPlace[2] === 0) ns.phase = 2
      ns.turn = 3 - p
    }
  }

  else if (type === 'move') {
    ns.board[from] = 0
    ns.board[to]   = p
    const formed = getFormedMills(ns.board, to, p)
    if (formed.length) {
      ns.removing  = true
      ns.lastMills = [...new Set(formed.flat())]
    } else {
      ns.turn = 3 - p
    }
  }

  else if (type === 'remove') {
    ns.board[node] = 0
    ns.removing    = false
    ns.lastMills   = []
    if (ns.phase === 1 && ns.toPlace[1] === 0 && ns.toPlace[2] === 0) ns.phase = 2
    ns.turn = 3 - p
  }

  ns.winner = checkWinner(ns)
  return ns
}

// ─── Legal move generator ─────────────────────────────────────────────────────

export const generateMoves = (state) => {
  const moves = []
  const { board, toPlace, phase, turn, removing } = state
  const p = turn

  if (removing) {
    removableNodes(board, 3 - p).forEach(node => moves.push({ type: 'remove', node }))
    return moves
  }

  if (phase === 1 && toPlace[p] > 0) {
    for (let i = 0; i < 24; i++)
      if (board[i] === 0) moves.push({ type: 'place', to: i })
    return moves
  }

  const canFly = isFlying(board, toPlace, p)
  const empty  = board.reduce((a, v, i) => v === 0 ? [...a, i] : a, [])

  for (let i = 0; i < 24; i++) {
    if (board[i] !== p) continue
    const dests = canFly ? empty : ADJ[i].filter(j => board[j] === 0)
    dests.forEach(j => moves.push({ type: 'move', from: i, to: j }))
  }
  return moves
}
