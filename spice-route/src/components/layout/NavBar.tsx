import React from "react";

interface NavBarProps {
  onNavigate: (view: "lobby" | "map") => void;
  currentView: "lobby" | "map";
}

export const NavBar: React.FC<NavBarProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-amber-700/40 bg-amber-100/80">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow">
          <span className="text-xs font-bold text-amber-50">SR</span>
        </div>
        <div className="leading-tight">
          <div className="text-lg font-semibold text-amber-900">Spice Route</div>
          <div className="text-[11px] text-amber-800">Young Merchants of the Indian Ocean</div>
        </div>
      </div>
      <nav className="flex items-center gap-2 text-xs">
        {[
          { key: "lobby" as const, label: "Harbor" },
          { key: "map" as const, label: "World Map" }
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            className={`px-3 py-1 rounded-full border text-[11px] transition ${
              currentView === item.key
                ? "bg-amber-700 text-amber-50 border-amber-800 shadow-sm"
                : "bg-amber-50/70 text-amber-900 border-amber-400 hover:bg-amber-200/70"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

