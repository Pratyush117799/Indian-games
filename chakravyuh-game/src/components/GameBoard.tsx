import React, { useEffect } from "react";
import { BOARD_SIZE } from "../constants/config";
import { Position } from "../types/types";
import { TileCell } from "./Tile";

interface GameBoardProps {
  game: {
    mode: string;
    board: any[][];
    warriorPosition: Position | null;
    placeOrRotateTile: (pos: Position) => void;
    removeTile: (pos: Position) => void;
    moveWarriorTo: (pos: Position) => void;
    warriorSelected: boolean;
    toggleWarriorSelected: () => void;
    validWarriorMoves: Position[];
    sanskritLearningEnabled: boolean;
  };
}

export const GameBoard: React.FC<GameBoardProps> = ({ game }) => {
  const { mode, board, warriorPosition, validWarriorMoves, sanskritLearningEnabled } = game;

  const isValidMoveTarget = (pos: Position) =>
    validWarriorMoves.some((p) => p.row === pos.row && p.col === pos.col);

  const handleTileClick = (pos: Position) => {
    if (mode === "building") {
      game.placeOrRotateTile(pos);
      return;
    }
    if (mode === "solving") {
      if (warriorPosition && pos.row === warriorPosition.row && pos.col === warriorPosition.col) {
        game.toggleWarriorSelected();
      } else if (game.warriorSelected) {
        game.moveWarriorTo(pos);
      }
    }
  };

  const handleRightClick = (pos: Position) => {
    if (mode === "building") {
      game.removeTile(pos);
    }
  };

  // Keyboard movement for warrior
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== "solving" || !warriorPosition) return;
      let target: Position | null = null;
      if (e.key === "ArrowUp") {
        target = { row: warriorPosition.row - 1, col: warriorPosition.col };
      } else if (e.key === "ArrowDown") {
        target = { row: warriorPosition.row + 1, col: warriorPosition.col };
      } else if (e.key === "ArrowLeft") {
        target = { row: warriorPosition.row, col: warriorPosition.col - 1 };
      } else if (e.key === "ArrowRight") {
        target = { row: warriorPosition.row, col: warriorPosition.col + 1 };
      }
      if (target) {
        game.moveWarriorTo(target);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game, mode, warriorPosition]);

  return (
    <div className="relative max-w-[600px]">
      <div className="pointer-events-none absolute -inset-3 rounded-[32px] border-4 border-amber-900/40 border-dashed" />
      <div className="pointer-events-none absolute -inset-1 rounded-[30px] border border-amber-500/50 shadow-inner" />
      <div className="relative bg-amber-100/95 rounded-2xl p-4 shadow-xl ornate-bg">
        <div className="mb-3 text-center text-xs text-amber-900 tracking-wide flex flex-col items-center gap-1">
          <div className="font-semibold text-sm">
            <span className="mr-1">चक्रव्यूह</span>
            <span className="text-[11px] text-amber-800">— Architect vs Warrior</span>
          </div>
          <div className="flex gap-3 text-[10px]">
            <span className="px-2 py-0.5 rounded-full bg-amber-200/80 border border-amber-400/60">
              मार्ग — Paths
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-900/70 text-amber-50 border border-red-950/70">
              दीवार — Walls
            </span>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/90 text-amber-50 border border-orange-700/80">
              रक्षक — Guards
            </span>
          </div>
        </div>
        <div
          className="grid gap-[2px]"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`
          }}
        >
          {board.map((row: any[], rIdx: number) =>
            row.map((tile, cIdx: number) => {
              const pos = { row: rIdx, col: cIdx };
              const isWarriorHere =
                warriorPosition &&
                warriorPosition.row === rIdx &&
                warriorPosition.col === cIdx;
              return (
                <TileCell
                  key={tile.id}
                  tile={tile}
                  mode={mode as any}
                  isWarriorHere={!!isWarriorHere}
                  isValidMoveTarget={isValidMoveTarget(pos)}
                  sanskritEnabled={sanskritLearningEnabled}
                  onClick={handleTileClick}
                  onRightClick={handleRightClick}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

