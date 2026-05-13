// components/tiles/TilePicker.jsx
import useCanvasStore from "../../store/canvasStore";
import { TILE_SHAPES } from "../../data/tileShapes";

export default function TilePicker() {
  const { activeShape, activeColor, setActiveShape } = useCanvasStore();

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-3 text-center">
        Shapes
      </p>
      <div className="grid grid-cols-2 gap-2">
        {TILE_SHAPES.map(shape => (
          <button
            key={shape.id}
            onClick={() => setActiveShape(shape.id)}
            className={`
              flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-150
              ${activeShape === shape.id
                ? "bg-white/15 ring-1 ring-saffron/60 shadow-lg"
                : "hover:bg-white/8"}
            `}
          >
            {/* Mini SVG preview of the shape */}
            <svg width={36} height={36} viewBox="0 0 36 36">
              <ShapePreview shapeId={shape.id} color={activeColor} />
            </svg>
            <span className="text-xs text-white/60 leading-none">{shape.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Renders a tiny centred preview of each shape at (18,18)
function ShapePreview({ shapeId, color }) {
  const cx = 18, cy = 18, size = 30;
  switch (shapeId) {
    case "dot":
      return <circle cx={cx} cy={cy} r={10} fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />;

    case "petal":
      return <ellipse cx={cx} cy={cy} rx={5} ry={12} fill={color} style={{ filter: `drop-shadow(0 0 2px ${color})` }} />;

    case "diamond":
      return <polygon points={`${cx},${cy-13} ${cx+8},${cy} ${cx},${cy+13} ${cx-8},${cy}`} fill={color} style={{ filter: `drop-shadow(0 0 2px ${color})` }} />;

    case "star": {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const r = i % 2 === 0 ? 13 : 6;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      }).join(" ");
      return <polygon points={pts} fill={color} style={{ filter: `drop-shadow(0 0 3px ${color})` }} />;
    }

    case "leaf":
      return (
        <path
          d={`M ${cx} ${cy-13} C ${cx+6} ${cy-6} ${cx+6} ${cy+4} ${cx} ${cy+13}
              C ${cx-6} ${cy+4} ${cx-6} ${cy-6} ${cx} ${cy-13} Z`}
          fill={color}
        />
      );

    case "triangle":
      return <polygon points={`${cx},${cy-13} ${cx+11},${cy+9} ${cx-11},${cy+9}`} fill={color} />;

    case "hexagon": {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3;
        return `${cx + 12 * Math.cos(a)},${cy + 12 * Math.sin(a)}`;
      }).join(" ");
      return <polygon points={pts} fill={color} />;
    }

    case "arc":
      return (
        <path
          d={`M ${cx-11} ${cy} A 11 11 0 0 1 ${cx+11} ${cy}
              A 6 6 0 0 0 ${cx-11} ${cy} Z`}
          fill={color}
        />
      );

    case "diya":
      return (
        <>
          <path
            d={`M ${cx-10} ${cy+4} Q ${cx} ${cy-8} ${cx+10} ${cy+4} Q ${cx} ${cy+12} ${cx-10} ${cy+4} Z`}
            fill={color}
          />
          <ellipse cx={cx} cy={cy-10} rx={2} ry={4} fill="#FFD700" />
        </>
      );

    case "lotus":
      return (
        <g>
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i * Math.PI) / 3 - Math.PI / 2;
            const px = cx + 7 * Math.cos(a);
            const py = cy + 7 * Math.sin(a);
            const rot = (a * 180) / Math.PI + 90;
            return <ellipse key={i} cx={px} cy={py} rx={3} ry={8} fill={color} opacity={0.85} transform={`rotate(${rot} ${px} ${py})`} />;
          })}
          <circle cx={cx} cy={cy} r={3.5} fill={color} />
        </g>
      );

    default:
      return <circle cx={cx} cy={cy} r={10} fill={color} />;
  }
}
