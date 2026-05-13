// components/canvas/CanvasToolbar.jsx
import { Undo2, Redo2, Trash2, Download } from "lucide-react";
import { SYMMETRY_OPTIONS } from "../../utils/constants";
import useCanvasStore from "../../store/canvasStore";

export default function CanvasToolbar({ onExport }) {
  const {
    undo, redo, clear,
    history, future, tiles,
    symmetryAxes, setSymmetryAxes,
  } = useCanvasStore();

  return (
    <div className="flex flex-col gap-3">
      {/* ── Symmetry Selector ─────────────────────────────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-2 text-center">
          Symmetry
        </p>
        <div className="flex flex-col gap-1">
          {SYMMETRY_OPTIONS.map(opt => (
            <button
              key={opt.axes}
              onClick={() => setSymmetryAxes(opt.axes)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                transition-all duration-150
                ${symmetryAxes === opt.axes
                  ? "bg-saffron text-white shadow-lg shadow-saffron/30"
                  : "text-white/60 hover:text-white hover:bg-white/8"}
              `}
            >
              <span className="text-base w-5 text-center">{opt.icon}</span>
              <span>{opt.label}</span>
              {opt.axes > 1 && (
                <span className="ml-auto text-xs opacity-50">{opt.axes}×</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Action Buttons ────────────────────────────────────────── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-2">
        <p className="text-xs text-white/40 uppercase tracking-widest mb-1 text-center">
          Actions
        </p>

        <ToolBtn
          icon={<Undo2 size={15} />}
          label="Undo"
          onClick={undo}
          disabled={history.length === 0}
          shortcut="⌘Z"
        />
        <ToolBtn
          icon={<Redo2 size={15} />}
          label="Redo"
          onClick={redo}
          disabled={future.length === 0}
          shortcut="⌘Y"
        />
        <div className="border-t border-white/10 my-1" />
        <ToolBtn
          icon={<Trash2 size={15} />}
          label="Clear"
          onClick={() => { if (window.confirm("Clear the entire canvas?")) clear(); }}
          disabled={tiles.length === 0}
          danger
        />
        {onExport && (
          <ToolBtn
            icon={<Download size={15} />}
            label="Export SVG"
            onClick={onExport}
          />
        )}
      </div>

      {/* ── Tile count ────────────────────────────────────────────── */}
      <div className="text-center text-xs text-white/30">
        {tiles.length} tile{tiles.length !== 1 ? "s" : ""} placed
      </div>
    </div>
  );
}

function ToolBtn({ icon, label, onClick, disabled, danger, shortcut }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm
        transition-all duration-150
        ${disabled
          ? "opacity-25 cursor-not-allowed"
          : danger
            ? "text-red-400 hover:bg-red-500/15 hover:text-red-300"
            : "text-white/70 hover:text-white hover:bg-white/8"}
      `}
    >
      {icon}
      <span>{label}</span>
      {shortcut && <span className="ml-auto text-xs opacity-30">{shortcut}</span>}
    </button>
  );
}
