// src/components/canvas/TileRenderer.jsx
import { motion } from "framer-motion";
import { segmentAngle } from "../../utils/symmetryEngine";
import { GRID } from "../../utils/constants";

const { CENTER_X, CENTER_Y, RING_GAP } = GRID;

function TileShape({ shapeId, x, y, color, size, rotation }) {
  const glow = { filter: `drop-shadow(0 0 4px ${color}88)` };
  switch (shapeId) {
    case "dot":
      return <circle cx={x} cy={y} r={size*0.38} fill={color} style={glow} />;
    case "petal":
      return <ellipse cx={x} cy={y} rx={size*0.18} ry={size*0.42} fill={color} transform={`rotate(${rotation} ${x} ${y})`} style={glow} />;
    case "diamond":
      return <polygon points={`${x},${y-size*0.44} ${x+size*0.26},${y} ${x},${y+size*0.44} ${x-size*0.26},${y}`} fill={color} transform={`rotate(${rotation-90} ${x} ${y})`} style={glow} />;
    case "star": {
      const pts = Array.from({length:10},(_,i)=>{const a=(i*Math.PI)/5-Math.PI/2;const r=i%2===0?size*0.42:size*0.18;return`${x+r*Math.cos(a)},${y+r*Math.sin(a)}`;}).join(" ");
      return <polygon points={pts} fill={color} style={{filter:`drop-shadow(0 0 5px ${color}99)`}} />;
    }
    case "leaf":
      return <path d={`M ${x} ${y-size*0.45} C ${x+size*0.22} ${y-size*0.22} ${x+size*0.22} ${y+size*0.15} ${x} ${y+size*0.45} C ${x-size*0.22} ${y+size*0.15} ${x-size*0.22} ${y-size*0.22} ${x} ${y-size*0.45} Z`} fill={color} transform={`rotate(${rotation} ${x} ${y})`} style={glow} />;
    case "triangle":
      return <polygon points={`${x},${y-size*0.45} ${x+size*0.39},${y+size*0.35} ${x-size*0.39},${y+size*0.35}`} fill={color} transform={`rotate(${rotation-90} ${x} ${y})`} style={glow} />;
    case "hexagon": {
      const pts = Array.from({length:6},(_,i)=>{const a=(i*Math.PI)/3;return`${x+size*0.42*Math.cos(a)},${y+size*0.42*Math.sin(a)}`;}).join(" ");
      return <polygon points={pts} fill={color} style={glow} />;
    }
    case "arc":
      return <path d={`M ${x-size*0.36} ${y} A ${size*0.38} ${size*0.38} 0 0 1 ${x+size*0.36} ${y} A ${size*0.22} ${size*0.22} 0 0 0 ${x-size*0.36} ${y} Z`} fill={color} transform={`rotate(${rotation} ${x} ${y})`} style={glow} />;
    case "diya":
      return (
        <g transform={`rotate(${rotation-90} ${x} ${y})`}>
          <path d={`M ${x-size*0.36} ${y+size*0.15} Q ${x} ${y-size*0.28} ${x+size*0.36} ${y+size*0.15} Q ${x} ${y+size*0.42} ${x-size*0.36} ${y+size*0.15} Z`} fill={color} style={glow} />
          <ellipse cx={x} cy={y-size*0.35} rx={size*0.07} ry={size*0.14} fill="#FFD700" style={{filter:"drop-shadow(0 0 4px #FF6B00)"}} />
        </g>
      );
    case "lotus":
      return (
        <g>
          {Array.from({length:6},(_,i)=>{const a=(i*Math.PI)/3-Math.PI/2;const px=x+size*0.22*Math.cos(a);const py=y+size*0.22*Math.sin(a);return<ellipse key={i} cx={px} cy={py} rx={size*0.12} ry={size*0.28} fill={color} opacity={0.85} transform={`rotate(${(a*180/Math.PI)+90} ${px} ${py})`}/>;}).concat([<circle key="c" cx={x} cy={y} r={size*0.12} fill={color} style={glow}/>])}
        </g>
      );
    default:
      return <circle cx={x} cy={y} r={size*0.35} fill={color} />;
  }
}

export default function TileRenderer({ tile, size = 28, isNew = false }) {
  const { ring, segment, totalSegments, shapeId, color } = tile;
  const radius   = (ring + 1) * RING_GAP;
  const angle    = segmentAngle(segment, totalSegments);
  const x        = CENTER_X + radius * Math.cos(angle);
  const y        = CENTER_Y + radius * Math.sin(angle);
  const rotation = (angle * 180) / Math.PI + 90;

  return (
    <motion.g
      key={tile.id}
      initial={isNew ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 22, mass: 0.6 }}
      style={{ originX: x, originY: y }}
    >
      <TileShape shapeId={shapeId} x={x} y={y} color={color} size={size} rotation={rotation} />
    </motion.g>
  );
}
