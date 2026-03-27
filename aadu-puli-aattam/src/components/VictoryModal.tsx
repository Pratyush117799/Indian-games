import React from "react";
import type { GameState } from "../types/types";

interface VictoryModalProps {
  winner: NonNullable<GameState["winner"]>;
  onClose: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ winner, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-amber-900/60 p-4"
      role="dialog"
      aria-modal
      aria-labelledby="victory-title"
    >
      <div className="bg-amber-50 rounded-2xl border-4 border-amber-800 shadow-2xl p-8 max-w-md w-full text-center">
        <h2 id="victory-title" className="text-2xl font-bold text-amber-900 mb-2">
          {winner === "tiger" ? "Tigers win!" : "Goats win!"}
        </h2>
        <p className="text-amber-800 mb-4">
          {winner === "tiger"
            ? "Tigers captured 5 or more goats."
            : "All tigers are trapped. Goats have won!"}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-xl bg-amber-600 text-amber-50 font-semibold hover:bg-amber-700"
        >
          New game
        </button>
      </div>
    </div>
  );
};
