/**
 * index.js — Navakankari game engine public API
 * Re-exports everything a portal/component needs.
 */

export { NODE, ADJ, MILLS, EDGES }      from './boardGeometry.js'
export {
  createInitialState,
  countOnBoard, totalPieces, isFlying,
  millNodeSet, formsMill, getFormedMills,
  removableNodes, isBlocked, checkWinner,
  applyAction, generateMoves,
}                                        from './gameState.js'
export { getBestMove, evaluate }         from './minimax.js'
