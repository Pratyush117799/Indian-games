import React from "react";
import { EDGES, POINTS } from "../utils/boardConfig";
import { Edge } from "./Edge";
import { Point } from "./Point";
import { Piece } from "./Piece";
import { getValidMovesForSelectedPiece, getGoatPlacementPoints } from "../utils/moveValidation";
import type { GameState } from "../types/types";

interface GameBoardProps {
  state: GameState;
  onSelectPiece: (pieceId: string | null) => void;
  onPlaceGoat: (pointId: number) => void;
  onMovePiece: (toPointId: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  state,
  onSelectPiece,
  onPlaceGoat,
  onMovePiece,
}) => {
  const validMoves = getValidMovesForSelectedPiece(state);
  const placementPoints = getGoatPlacementPoints(state);
  const isGoatPlacement =
    state.phase === "placement" &&
    state.currentPlayer === "goat" &&
    placementPoints.length > 0;

  const handlePointClick = (pointId: number) => {
    if (state.winner) return;
    if (state.selectedPieceId && validMoves.includes(pointId)) {
      onMovePiece(pointId);
      return;
    }
    if (isGoatPlacement && placementPoints.includes(pointId)) {
      onPlaceGoat(pointId);
      return;
    }
  };

  return (
    <div className="inline-block rounded-2xl border-4 border-amber-900 shadow-xl bg-amber-100 p-4">
      <svg
        viewBox="0 0 800 500"
        className="w-full max-w-[min(90vw,700px)] h-auto"
        style={{ maxHeight: "70vh" }}
      >
        <g color="#78350f">
          {EDGES.map((e, i) => (
            <Edge key={`${e.from}-${e.to}`} edge={e} />
          ))}
        </g>
        {POINTS.map((point) => (
          <Point
            key={point.id}
            point={point}
            isHighlighted={
              (isGoatPlacement && placementPoints.includes(point.id)) ||
              validMoves.includes(point.id)
            }
            onClick={() => handlePointClick(point.id)}
          />
        ))}
        {state.tigers.map((t) => (
          <Piece
            key={t.id}
            piece={t}
            isSelected={state.selectedPieceId === t.id}
            onClick={() => {
              if (state.currentPlayer === "tiger" && !state.winner)
                onSelectPiece(state.selectedPieceId === t.id ? null : t.id);
            }}
          />
        ))}
        {state.goats.map((g) => (
          <Piece
            key={g.id}
            piece={g}
            isSelected={
              state.phase === "movement" &&
              state.currentPlayer === "goat" &&
              state.selectedPieceId === g.id
            }
            onClick={() => {
              if (
                state.phase === "movement" &&
                state.currentPlayer === "goat" &&
                !g.captured &&
                !state.winner
              )
                onSelectPiece(state.selectedPieceId === g.id ? null : g.id);
            }}
          />
        ))}
      </svg>
    </div>
  );
};
