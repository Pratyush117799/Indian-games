import React from "react";
import type { GameState } from "../types/types";
import { GOATS_TO_CAPTURE, TOTAL_GOATS } from "../constants/config";

interface PlayerInfoProps {
  state: GameState;
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({ state }) => {
  const goatsRemaining = state.goats.filter((g) => !g.captured).length;
  const phaseLabel =
    state.phase === "placement"
      ? `Placement (${state.goatsPlaced}/${TOTAL_GOATS} goats placed)`
      : "Movement phase";

  return (
    <div className="rounded-xl border-2 border-amber-800 bg-amber-50/95 p-4 shadow-md">
      <div className="mb-3 text-sm font-semibold text-amber-900">
        {state.currentPlayer === "goat" ? "Goats' turn" : "Tigers' turn"}
      </div>
      <div className="text-xs text-amber-800 mb-2">{phaseLabel}</div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-amber-700">Goats captured:</span>
        <span className="font-bold text-amber-900">
          {state.goatsCaptured} / {GOATS_TO_CAPTURE}
        </span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-amber-200 overflow-hidden">
        <div
          className="h-full bg-amber-600 transition-all duration-300"
          style={{
            width: `${Math.min(100, (state.goatsCaptured / GOATS_TO_CAPTURE) * 100)}%`,
          }}
        />
      </div>
      <div className="mt-2 text-[11px] text-amber-700">
        Goats on board: {goatsRemaining}
      </div>
    </div>
  );
};
