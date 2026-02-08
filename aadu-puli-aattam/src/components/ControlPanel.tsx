import React from "react";

interface ControlPanelProps {
  onNewGame: () => void;
  onShowRules?: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onNewGame,
  onShowRules,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onNewGame}
        className="px-4 py-2 rounded-lg bg-amber-700 text-amber-50 font-medium hover:bg-amber-800 shadow"
      >
        New game
      </button>
      {onShowRules && (
        <button
          type="button"
          onClick={onShowRules}
          className="px-4 py-2 rounded-lg border-2 border-amber-700 text-amber-900 font-medium hover:bg-amber-100"
        >
          Rules
        </button>
      )}
    </div>
  );
};
