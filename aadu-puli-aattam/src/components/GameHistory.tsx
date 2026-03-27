import React from "react";
import type { Move } from "../types/types";
import { POINTS } from "../utils/boardConfig";

interface GameHistoryProps {
  moves: Move[];
  maxHeight?: string;
}

function pointLabel(id: number): string {
  const p = POINTS.find((x) => x.id === id);
  return p ? `P${id}` : `?`;
}

export const GameHistory: React.FC<GameHistoryProps> = ({
  moves,
  maxHeight = "200px",
}) => {
  return (
    <div
      className="rounded-xl border-2 border-amber-200 bg-amber-50/80 p-3 overflow-auto"
      style={{ maxHeight }}
    >
      <div className="text-xs font-semibold text-amber-900 mb-2">Move history</div>
      <ul className="space-y-1 text-[11px] text-amber-800">
        {moves.length === 0 && (
          <li className="italic">No moves yet.</li>
        )}
        {moves.map((m, i) => (
          <li key={i}>
            {m.from !== null && m.from !== undefined
              ? `${m.pieceId}: ${pointLabel(m.from)} → ${pointLabel(m.to)}`
              : `Goat placed at ${pointLabel(m.to)}`}
            {m.captured !== undefined && (
              <span className="text-red-700 ml-1">(capture)</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
