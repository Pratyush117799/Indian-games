import React from "react";
import { GameMode } from "../types/types";

interface ModeSwitchProps {
  mode: GameMode;
  onChangeMode: (mode: GameMode) => void;
}

export const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode }) => {
  const labelMap: Record<GameMode, string> = {
    menu: "Menu",
    building: "Builder Mode",
    solving: "Solver Mode",
    victory: "Victory",
    defeat: "Defeat"
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 shadow-sm text-xs">
      <span className="font-semibold text-amber-900">Mode</span>
      <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
        {labelMap[mode]}
      </span>
    </div>
  );
};

