import React from "react";

export const WarriorPiece: React.FC = () => {
  return (
    <div className="warrior relative z-20 w-8 h-8 rounded-full border-2 border-blue-900 shadow-lg warrior-glow flex items-center justify-center overflow-visible">
      <div className="absolute inset-[-4px] rounded-full bg-blue-500/20 blur-sm" />
      <div className="relative w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-200 flex items-center justify-center">
        <span className="text-[11px] text-amber-100 font-semibold leading-none">
          अभि
        </span>
      </div>
    </div>
  );
};

