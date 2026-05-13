// components/tiles/ColorPalette.jsx
import { useRef } from "react";
import useCanvasStore from "../../store/canvasStore";

// Extra universal colors always available
const EXTRA_COLORS = [
  "#FFFFFF", "#F5F5F5", "#212121", "#37474F",
  "#FF1744", "#FF6D00", "#FFD600", "#00E676",
  "#2979FF", "#AA00FF", "#00B0FF", "#FF4081",
];

export default function ColorPalette({ festivalColors = [] }) {
  const { activeColor, setActiveColor } = useCanvasStore();
  const inputRef = useRef(null);

  const allColors = [...new Set([...festivalColors, ...EXTRA_COLORS])];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-3 text-center">
        Colours
      </p>

      {/* Festival palette section */}
      {festivalColors.length > 0 && (
        <>
          <p className="text-xs text-white/30 mb-2 px-1">Festival</p>
          <ColorGrid colors={festivalColors} active={activeColor} onSelect={setActiveColor} />
          <div className="border-t border-white/10 my-2" />
        </>
      )}

      {/* Extra colors */}
      <p className="text-xs text-white/30 mb-2 px-1">More</p>
      <ColorGrid colors={EXTRA_COLORS} active={activeColor} onSelect={setActiveColor} />

      {/* Custom color picker */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white/80
                     transition-colors px-2 py-1 rounded-lg hover:bg-white/8 w-full"
        >
          <span
            className="w-5 h-5 rounded-full border-2 border-dashed border-white/30 flex-shrink-0"
            style={{ background: activeColor }}
          />
          Custom…
        </button>
        <input
          ref={inputRef}
          type="color"
          value={activeColor}
          onChange={e => setActiveColor(e.target.value)}
          className="sr-only"
        />
      </div>
    </div>
  );
}

function ColorGrid({ colors, active, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-1.5 px-0.5">
      {colors.map(color => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          title={color}
          className={`
            w-full aspect-square rounded-lg transition-all duration-100
            ${active === color
              ? "ring-2 ring-white ring-offset-1 ring-offset-black scale-110 shadow-lg"
              : "hover:scale-105 hover:ring-1 hover:ring-white/40"}
          `}
          style={{
            background: color,
            boxShadow: active === color ? `0 0 10px ${color}88` : "none",
          }}
        />
      ))}
    </div>
  );
}
