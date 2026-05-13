// src/components/modes/FreeBuildMode.jsx
import { useEffect, useCallback, useState } from "react";
import { Save } from "lucide-react";
import RangolicCanvas    from "../canvas/RangolicCanvas";
import CanvasToolbar     from "../canvas/CanvasToolbar";
import TilePicker        from "../tiles/TilePicker";
import ColorPalette      from "../tiles/ColorPalette";
import SaveDesignModal   from "../ui/SaveDesignModal";
import XPToast, { showXPToast } from "../ui/XPToast";
import useCanvasStore    from "../../store/canvasStore";
import useGameStore      from "../../store/gameStore";
import { getFestival }   from "../../data/festivals";
import { GAME_MODES }    from "../../utils/constants";
import { exportCanvasSVG } from "../../utils/svgExporter";

export default function FreeBuildMode({ festivalId = "diwali" }) {
  const festival = getFestival(festivalId);
  const { setMode, startGame } = useGameStore();
  const { tiles }              = useCanvasStore();
  const [showSave, setShowSave] = useState(false);

  useEffect(() => { setMode(GAME_MODES.FREE); startGame(); }, []);

  const handleKey = useCallback((e) => {
    const { undo, redo } = useCanvasStore.getState();
    if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === "z") { e.preventDefault(); undo(); }
    if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  const handleExport = () => exportCanvasSVG(`rangoli-${festivalId}-${Date.now()}.svg`);

  return (
    <div className="min-h-screen flex flex-col"
         style={{ background: "linear-gradient(135deg,#0F0A1E,#1a0a2e)" }}>
      <XPToast />
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{festival.emoji}</span>
          <div>
            <h1 className="text-base font-bold text-white leading-none">{festival.name}</h1>
            <p className="text-xs text-white/40">{festival.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/30">{tiles.length} tiles</span>
          <button onClick={() => setShowSave(true)} disabled={tiles.length < 3}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold
                       text-white transition-all active:scale-95 disabled:opacity-30"
            style={{ background: festival.accentColor + "33", border: `1px solid ${festival.accentColor}55` }}>
            <Save size={14} /> Save
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-44 flex-shrink-0 p-3 flex flex-col gap-3 border-r border-white/8 overflow-y-auto">
          <CanvasToolbar onExport={handleExport} />
        </aside>
        <main className="flex-1 flex items-center justify-center p-4 min-w-0">
          <div className="w-full max-w-[min(100%,calc(100vh-120px))] aspect-square"
               style={{ filter: `drop-shadow(0 0 40px ${festival.glowColor})` }}>
            <RangolicCanvas glowColor={festival.glowColor} />
          </div>
        </main>
        <aside className="w-48 flex-shrink-0 p-3 flex flex-col gap-3 border-l border-white/8 overflow-y-auto">
          <TilePicker />
          <ColorPalette festivalColors={festival.palette} />
        </aside>
      </div>

      <div className="h-0.5 w-full"
           style={{ background: `linear-gradient(90deg,transparent,${festival.accentColor},transparent)`, opacity:0.5 }} />

      {showSave && (
        <SaveDesignModal
          festivalId={festivalId}
          onClose={() => setShowSave(false)}
          onSaved={() => showXPToast(50, "Design saved to gallery!")}
        />
      )}
    </div>
  );
}
