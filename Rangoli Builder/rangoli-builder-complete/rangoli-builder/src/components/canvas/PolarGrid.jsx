// components/canvas/PolarGrid.jsx
import { buildGridRings, buildAxisLines } from "../../utils/symmetryEngine";
import { GRID } from "../../utils/constants";

export default function PolarGrid({ axes = 8, glowColor = "rgba(232,93,4,0.25)" }) {
  const rings = buildGridRings();
  const axisLines = buildAxisLines(axes);

  return (
    <g className="polar-grid" style={{ pointerEvents: "none" }}>
      {/* Subtle background glow at center */}
      <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor={glowColor} stopOpacity="0.6" />
        <stop offset="100%" stopColor={glowColor} stopOpacity="0"   />
      </radialGradient>
      <circle
        cx={GRID.CENTER_X} cy={GRID.CENTER_Y}
        r={GRID.RINGS * GRID.RING_GAP + 20}
        fill="url(#centerGlow)"
      />

      {/* Axis guide lines (spokes) */}
      {axisLines.map((line, i) => (
        <line
          key={`axis-${i}`}
          x1={line.x1} y1={line.y1}
          x2={line.x2} y2={line.y2}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
          strokeDasharray="3 6"
        />
      ))}

      {/* Concentric ring circles */}
      {rings.map((ring, i) => (
        <circle
          key={`ring-${i}`}
          cx={ring.cx} cy={ring.cy} r={ring.r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={i === GRID.RINGS - 1 ? 1.5 : 1}
        />
      ))}

      {/* Center dot */}
      <circle
        cx={GRID.CENTER_X} cy={GRID.CENTER_Y} r={4}
        fill="rgba(255,255,255,0.2)"
      />
    </g>
  );
}
