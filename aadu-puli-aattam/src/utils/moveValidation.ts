import type { GameState, Piece } from "../types/types";
import { POINTS, getPointById, getMidPointBetween, areInLine } from "./boardConfig";
import { GOATS_TO_CAPTURE } from "../constants/config";

export function getPieceAtPoint(pointId: number, state: GameState): Piece | null {
  for (const t of state.tigers) {
    if (t.position === pointId) return t;
  }
  for (const g of state.goats) {
    if (!g.captured && g.position === pointId) return g;
  }
  return null;
}

export function isValidMove(
  piece: Piece,
  fromPoint: number | null,
  toPoint: number,
  state: GameState
): { valid: boolean; capture?: number } {
  const occupied = getPieceAtPoint(toPoint, state);
  if (occupied !== null) return { valid: false };

  if (piece.type === "tiger") {
    if (fromPoint === null) return { valid: false };
    const from = getPointById(fromPoint);
    const to = getPointById(toPoint);
    if (!from || !to) return { valid: false };

    const isAdjacent = from.connections.includes(toPoint);
    if (isAdjacent) return { valid: true };

    const mid = getMidPointBetween(fromPoint, toPoint);
    if (mid === null) return { valid: false };
    if (!areInLine(fromPoint, toPoint, mid)) return { valid: false };
    const goatAtMid = state.goats.find((g) => !g.captured && g.position === mid);
    if (!goatAtMid) return { valid: false };
    return { valid: true, capture: mid };
  }

  if (piece.type === "goat") {
    if (state.phase === "placement") {
      if (fromPoint !== null) return { valid: false };
      return { valid: true };
    }
    if (state.phase === "movement") {
      if (fromPoint === null) return { valid: false };
      const from = getPointById(fromPoint);
      if (!from || !from.connections.includes(toPoint)) return { valid: false };
      return { valid: true };
    }
  }

  return { valid: false };
}

export function getValidMoves(piece: Piece, state: GameState): number[] {
  const valid: number[] = [];

  if (piece.type === "goat" && state.phase === "placement" && piece.position === null) {
    for (const p of POINTS) {
      if (getPieceAtPoint(p.id, state) === null) valid.push(p.id);
    }
    return valid;
  }

  if (piece.position === null) return [];

  const point = getPointById(piece.position);
  if (!point) return [];

  for (const conn of point.connections) {
    const result = isValidMove(piece, piece.position, conn, state);
    if (result.valid) valid.push(conn);
  }

  if (piece.type === "tiger") {
    for (const adj of point.connections) {
      const adjPoint = getPointById(adj);
      if (!adjPoint) continue;
      for (const beyond of adjPoint.connections) {
        if (beyond === piece.position) continue;
        const result = isValidMove(piece, piece.position, beyond, state);
        if (result.valid && result.capture !== undefined) valid.push(beyond);
      }
    }
  }

  return [...new Set(valid)];
}

export function getValidMovesForSelectedPiece(state: GameState): number[] {
  if (!state.selectedPieceId) return [];
  const tiger = state.tigers.find((t) => t.id === state.selectedPieceId);
  if (tiger) return getValidMoves(tiger, state);
  const goat = state.goats.find((g) => g.id === state.selectedPieceId && !g.captured);
  if (goat) return getValidMoves(goat, state);
  return [];
}

export function getGoatPlacementPoints(state: GameState): number[] {
  if (state.phase !== "placement" || state.currentPlayer !== "goat") return [];
  const hasUnplaced = state.goats.some((g) => !g.captured && g.position === null);
  if (!hasUnplaced) return [];
  return POINTS.filter((p) => getPieceAtPoint(p.id, state) === null).map((p) => p.id);
}
