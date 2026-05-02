import React from "react";
import { GameMode, InventoryKey } from "../types/types";
import { TileInventory } from "./TileInventory";
import { VocabularyPanel } from "./VocabularyPanel";

interface ControlPanelProps {
  game: {
    mode: GameMode;
    moveCount: number;
    inventory: { [key: string]: number };
    selectedInventoryKey: InventoryKey | null;
    solutionExists: boolean;
    message: string | null;
    totalGames: number;
    totalVictories: number;
    tutorialEnabled: boolean;
    sanskritLearningEnabled: boolean;
    verifySolution: () => void;
    lockFormation: () => void;
    restart: () => void;
    selectInventoryKey: (key: InventoryKey) => void;
    toggleTutorialEnabled: () => void;
    toggleSanskritLearning: () => void;
  };
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ game }) => {
  const {
    mode,
    moveCount,
    inventory,
    selectedInventoryKey,
    solutionExists,
    message,
    totalGames,
    totalVictories,
    tutorialEnabled,
    sanskritLearningEnabled
  } = game;

  const isBuilding = mode === "building";
  const isSolving = mode === "solving";
  const isEnd = mode === "victory" || mode === "defeat";

  return (
    <aside className="space-y-4">
      <div className="border border-amber-200 rounded-xl bg-amber-50/80 px-3 py-2 text-xs shadow-sm space-y-1">
        <div className="font-semibold text-amber-900 text-[11px] uppercase tracking-wide">
          Settings
        </div>
        <label className="flex items-center gap-2 text-[11px] text-amber-900">
          <input
            type="checkbox"
            checked={tutorialEnabled}
            onChange={game.toggleTutorialEnabled}
            className="accent-amber-700"
          />
          <span>Guided tutorial</span>
        </label>
        <label className="flex items-center gap-2 text-[11px] text-amber-900">
          <input
            type="checkbox"
            checked={sanskritLearningEnabled}
            onChange={game.toggleSanskritLearning}
            className="accent-amber-700"
          />
          <span>Sanskrit learning aids</span>
        </label>
      </div>

      {isBuilding && (
        <TileInventory
          inventory={inventory}
          selectedKey={selectedInventoryKey}
          onSelect={game.selectInventoryKey}
        />
      )}

      <div className="space-y-2">
        {isBuilding && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={game.verifySolution}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500 text-white shadow hover:bg-emerald-600 transition-colors"
            >
              Verify Solution
            </button>
            <button
              type="button"
              disabled={!solutionExists}
              onClick={game.lockFormation}
              className={`flex-1 px-3 py-2 text-xs font-semibold rounded-lg shadow transition-colors ${
                solutionExists
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Lock Formation
            </button>
          </div>
        )}

        {(isSolving || isEnd) && (
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-semibold text-amber-900">Moves:</span>{" "}
              <span>{moveCount}</span>
            </div>
            <button
              type="button"
              onClick={game.restart}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 text-white shadow hover:bg-amber-700"
            >
              Restart
            </button>
          </div>
        )}
      </div>

      {sanskritLearningEnabled && <VocabularyPanel />}

      <div className="min-h-[60px] text-xs border border-amber-200 rounded-lg bg-amber-50 px-3 py-2 shadow-inner">
        <div className="flex items-center justify-between mb-1">
          <div className="font-semibold text-amber-900">Status</div>
          <div className="text-[10px] text-amber-700">
            Games: {totalGames} · Victories: {totalVictories}
          </div>
        </div>
        <p
          className={`${
            message?.startsWith("Solution verified")
              ? "text-emerald-700"
              : message?.startsWith("No valid path")
              ? "text-red-700"
              : message?.startsWith("Victory")
              ? "text-yellow-700"
              : "text-gray-800"
          }`}
        >
          {message ||
            (isBuilding
              ? "Place tiles to form a path from entry to center to exit. Click tiles to rotate, right-click to remove."
              : isSolving
              ? "Guide the warrior from entry through the center to the exit."
              : "Build or solve the Chakravyuh.")}
        </p>
        {mode === "victory" && (
          <div className="mt-2 space-y-1 text-[11px] text-amber-900">
            <div className="italic">
              “धर्मो रक्षति रक्षितः” — Dharma protects those who protect it.
            </div>
            <div>
              Fun fact: The Chakravyuh was said to be nearly impossible to break once fully
              formed, requiring deep knowledge of its layered structure.
            </div>
            <div>
              You reached the exit in <span className="font-semibold">{moveCount}</span> moves.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

