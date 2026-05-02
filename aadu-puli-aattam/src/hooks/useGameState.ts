import { useReducer, useCallback } from "react";
import type { GameState, Piece, Move } from "../types/types";
import { TIGER_START_POSITIONS } from "../utils/boardConfig";
import { TOTAL_GOATS, TOTAL_TIGERS } from "../constants/config";
import { isValidMove, getPieceAtPoint } from "../utils/moveValidation";
import { checkVictory } from "../utils/victoryCheck";

function createInitialState(): GameState {
  const tigers: Piece[] = [
    { id: "T1", type: "tiger", position: TIGER_START_POSITIONS[0], captured: false },
    { id: "T2", type: "tiger", position: TIGER_START_POSITIONS[1], captured: false },
    { id: "T3", type: "tiger", position: TIGER_START_POSITIONS[2], captured: false },
  ];
  const goats: Piece[] = Array.from({ length: TOTAL_GOATS }, (_, i) => ({
    id: `G${i + 1}`,
    type: "goat",
    position: null,
    captured: false,
  }));
  return {
    phase: "placement",
    currentPlayer: "goat",
    tigers,
    goats,
    goatsPlaced: 0,
    goatsCaptured: 0,
    moveHistory: [],
    winner: null,
    selectedPieceId: null,
  };
}

type Action =
  | { type: "SELECT_PIECE"; pieceId: string | null }
  | { type: "PLACE_GOAT"; pointId: number }
  | { type: "MOVE_PIECE"; toPointId: number }
  | { type: "UNDO" }
  | { type: "NEW_GAME" };

function gameReducer(state: GameState, action: Action): GameState {
  if (state.winner) return state;

  switch (action.type) {
    case "SELECT_PIECE": {
      return { ...state, selectedPieceId: action.pieceId };
    }

    case "PLACE_GOAT": {
      if (state.phase !== "placement" || state.currentPlayer !== "goat") return state;
      const goat = state.goats.find((g) => !g.captured && g.position === null);
      if (!goat) return state;
      if (getPieceAtPoint(action.pointId, state) !== null) return state;

      const newGoats = state.goats.map((g) =>
        g.id === goat.id ? { ...g, position: action.pointId } : g
      );
      const goatsPlaced = state.goatsPlaced + 1;
      const phase = goatsPlaced >= TOTAL_GOATS ? "movement" : state.phase;
      const move: Move = {
        pieceId: goat.id,
        from: null,
        to: action.pointId,
        turn: state.moveHistory.length + 1,
      };
      const next: GameState = {
        ...state,
        goats: newGoats,
        goatsPlaced,
        phase,
        currentPlayer: "tiger",
        moveHistory: [...state.moveHistory, move],
        selectedPieceId: null,
      };
      next.winner = checkVictory(next);
      return next;
    }

    case "MOVE_PIECE": {
      const toPointId = action.toPointId;
      if (!state.selectedPieceId) return state;

      const tiger = state.tigers.find((t) => t.id === state.selectedPieceId);
      const goat = state.goats.find((g) => g.id === state.selectedPieceId && !g.captured);
      const piece = tiger ?? goat ?? null;
      if (!piece) return state;

      const fromPoint = piece.position;
      const result = isValidMove(piece, fromPoint, toPointId, state);
      if (!result.valid) return state;

      if (piece.type === "tiger") {
        const newTigers = state.tigers.map((t) =>
          t.id === piece.id ? { ...t, position: toPointId } : t
        );
        let newGoats = state.goats;
        let goatsCaptured = state.goatsCaptured;
        if (result.capture !== undefined) {
          newGoats = state.goats.map((g) =>
            g.position === result.capture ? { ...g, captured: true } : g
          );
          goatsCaptured = state.goatsCaptured + 1;
        }
const move: Move = {
        pieceId: piece.id,
        from: fromPoint,
        to: toPointId,
        captured: result.capture,
        turn: state.moveHistory.length + 1,
      };
        const next: GameState = {
          ...state,
          tigers: newTigers,
          goats: newGoats,
          goatsCaptured,
          currentPlayer: "goat",
          moveHistory: [...state.moveHistory, move],
          selectedPieceId: null,
        };
        next.winner = checkVictory(next);
        return next;
      }

      if (piece.type === "goat" && state.phase === "movement" && fromPoint !== null) {
        const newGoats = state.goats.map((g) =>
          g.id === piece.id ? { ...g, position: toPointId } : g
        );
        const move: Move = {
          pieceId: piece.id,
          from: fromPoint,
          to: toPointId,
          turn: state.moveHistory.length + 1,
        };
        const next: GameState = {
          ...state,
          goats: newGoats,
          currentPlayer: "tiger",
          moveHistory: [...state.moveHistory, move],
          selectedPieceId: null,
        };
        next.winner = checkVictory(next);
        return next;
      }

      return state;
    }

    case "UNDO": {
      if (state.moveHistory.length === 0) return state;
      return createInitialState(); // Simplified: reset to start. Full undo would restore from history.
    }

    case "NEW_GAME": {
      return createInitialState();
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  const selectPiece = useCallback((pieceId: string | null) => {
    dispatch({ type: "SELECT_PIECE", pieceId });
  }, []);

  const placeGoat = useCallback((pointId: number) => {
    dispatch({ type: "PLACE_GOAT", pointId });
  }, []);

  const movePiece = useCallback((toPointId: number) => {
    dispatch({ type: "MOVE_PIECE", toPointId });
  }, []);

  const newGame = useCallback(() => {
    dispatch({ type: "NEW_GAME" });
  }, []);

  return { state, selectPiece, placeGoat, movePiece, newGame };
}
