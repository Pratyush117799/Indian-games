/**
 * boardGeometry.js
 * Shared cup-centre calculations for both Board.jsx and SeedAnimation.jsx.
 */

export const CUP_W = 62, CUP_H = 52, GAP_X = 8, GAP_Y = 14
export const PAD_X = 16, PAD_Y = 18
export const BOARD_W = 7 * CUP_W + 6 * GAP_X + 2 * PAD_X
export const BOARD_H = 2 * CUP_H + GAP_Y + 2 * PAD_Y

export const P1_ROW = [0,1,2,3,4,5,6]
export const P2_ROW = [7,8,9,10,11,12,13]

/**
 * Returns SVG { cx, cy } of a cup's visual centre.
 * cups[0..6]  = P1 row (bottom), 0=left
 * cups[7..13] = P2 row (top),    7=rightmost (above cup6), 13=leftmost (above cup0)
 */
export function cupCenter(cupIdx) {
  if (P1_ROW.includes(cupIdx)) {
    const col = cupIdx
    return {
      cx: PAD_X + col * (CUP_W + GAP_X) + CUP_W / 2,
      cy: PAD_Y + CUP_H + GAP_Y + CUP_H / 2,
    }
  }
  const col = 13 - cupIdx           // 7→col6 (right), 13→col0 (left)
  return {
    cx: PAD_X + col * (CUP_W + GAP_X) + CUP_W / 2,
    cy: PAD_Y + CUP_H / 2,
  }
}
