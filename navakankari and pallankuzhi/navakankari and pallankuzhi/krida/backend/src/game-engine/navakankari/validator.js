/**
 * validator.js — Server-side Navakankari move validator
 * Mirrors the frontend engine. Prevents cheated moves in PvP.
 */

const ADJ = [
  [1,7],[0,2,9],[1,3],[2,4,11],[3,5],[4,6,13],[5,7],[0,6,15],
  [9,15],[1,8,10,17],[9,11],[3,10,12,19],[11,13],[5,12,14,21],
  [13,15],[7,8,14,23],[17,23],[9,16,18],[17,19],[11,18,20],
  [19,21],[13,20,22],[21,23],[15,16,22],
]

const MILLS = [
  [0,1,2],[2,3,4],[4,5,6],[6,7,0],
  [8,9,10],[10,11,12],[12,13,14],[14,15,8],
  [16,17,18],[18,19,20],[20,21,22],[22,23,16],
  [1,9,17],[3,11,19],[5,13,21],[7,15,23],
]

const countOn  = (b, p) => b.reduce((c, v) => c + (v === p ? 1 : 0), 0)
const millSet  = (b, p) => {
  const s = new Set()
  MILLS.forEach(m => { if (m.every(n => b[n] === p)) m.forEach(n => s.add(n)) })
  return s
}
const removable = (b, opp) => {
  const all  = b.reduce((a, v, i) => v === opp ? [...a, i] : a, [])
  const inM  = millSet(b, opp)
  const free = all.filter(i => !inM.has(i))
  return free.length > 0 ? free : all
}
const flying = (b, tp, p) => tp[p] === 0 && countOn(b, p) === 3

export const validateMove = (state, move, playerSlot) => {
  const { board, toPlace, phase, turn, removing } = state
  const p   = playerSlot   // 1 or 2
  const opp = 3 - p

  if (turn !== p)     return { ok: false, reason: 'Not your turn' }
  if (!move?.type)    return { ok: false, reason: 'Invalid move format' }

  if (removing) {
    if (move.type !== 'remove')              return { ok: false, reason: 'Must remove a piece' }
    if (!removable(board, opp).includes(move.node))
                                             return { ok: false, reason: 'Cannot remove that piece' }
    return { ok: true }
  }

  if (phase === 1 && toPlace[p] > 0) {
    if (move.type !== 'place')               return { ok: false, reason: 'Must place a piece' }
    if (board[move.to] !== 0)               return { ok: false, reason: 'Node occupied' }
    if (move.to < 0 || move.to > 23)        return { ok: false, reason: 'Invalid node' }
    return { ok: true }
  }

  if (move.type !== 'move')                  return { ok: false, reason: 'Must move a piece' }
  if (board[move.from] !== p)                return { ok: false, reason: 'Not your piece' }
  if (board[move.to]   !== 0)                return { ok: false, reason: 'Destination occupied' }

  const canFly = flying(board, toPlace, p)
  if (!canFly && !ADJ[move.from].includes(move.to))
                                             return { ok: false, reason: 'Illegal slide' }
  return { ok: true }
}
