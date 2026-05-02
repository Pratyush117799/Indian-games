/**
 * validator.js — Server-side Pallankuzhi move validator
 */

const PLAYER_ROWS = {
  1: [0,1,2,3,4,5,6],
  2: [7,8,9,10,11,12,13],
}

export const validateMove = (state, move, playerSlot) => {
  if (state.turn !== playerSlot)
    return { ok: false, reason: 'Not your turn' }
  if (typeof move?.cupIndex !== 'number')
    return { ok: false, reason: 'Invalid move format' }

  const row = PLAYER_ROWS[playerSlot]
  if (!row.includes(move.cupIndex))
    return { ok: false, reason: 'Not your cup' }
  if (state.cups[move.cupIndex] === 0)
    return { ok: false, reason: 'Empty cup' }

  return { ok: true }
}
