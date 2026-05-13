// components/canvas/RangolicCanvas.jsx
import { useRef, useCallback } from "react";
import { GRID } from "../../utils/constants";
import { xyToGrid, getMirrorPositions, segmentAngle, segmentsForRing } from "../../utils/symmetryEngine";
import useCanvasStore from "../../store/canvasStore";
import PolarGrid from "./PolarGrid";
import TileRenderer from "./TileRenderer";

const { CENTER_X, CENTER_Y, RING_GAP, VIEWBOX } = GRID;

export default function RangolicCanvas({ glowColor, readonly = false }) {
  const svgRef = useRef(null);
  const lastPlacedRef = useRef(null); // debounce rapid clicks

  const {
    tiles, hoveredCell, symmetryAxes, activeShape, activeColor,
    placeTile, setHoveredCell,
  } = useCanvasStore();

  // ── Convert SVG click → grid cell ────────────────────────────────────────
  const getSVGPoint = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    const rect = svg.getBoundingClientRect();
    // Support both mouse and touch
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    pt.x = clientX - rect.left;
    pt.y = clientY - rect.top;
    // Scale from rendered size → viewBox size
    pt.x = (pt.x / rect.width)  * VIEWBOX;
    pt.y = (pt.y / rect.height) * VIEWBOX;
    return pt;
  }, []);

  const handleClick = useCallback((e) => {
    if (readonly) return;
    const pt = getSVGPoint(e);
    if (!pt) return;
    const cell = xyToGrid(pt.x, pt.y, symmetryAxes);
    if (!cell) return;

    // Simple debounce — don't re-place on same cell twice in 300ms
    const key = `${cell.ring}-${cell.segment}`;
    if (lastPlacedRef.current === key) return;
    lastPlacedRef.current = key;
    setTimeout(() => { lastPlacedRef.current = null; }, 300);

    placeTile(cell);
  }, [readonly, getSVGPoint, symmetryAxes, placeTile]);

  const handleMouseMove = useCallback((e) => {
    if (readonly) return;
    const pt = getSVGPoint(e);
    if (!pt) { setHoveredCell(null); return; }
    const cell = xyToGrid(pt.x, pt.y, symmetryAxes);
    setHoveredCell(cell || null);
  }, [readonly, getSVGPoint, symmetryAxes, setHoveredCell]);

  const handleMouseLeave = useCallback(() => setHoveredCell(null), [setHoveredCell]);

  // ── Build hover ghost tiles ───────────────────────────────────────────────
  const ghostTiles = hoveredCell
    ? getMirrorPositions(
        hoveredCell.ring,
        hoveredCell.segment,
        hoveredCell.totalSegments,
        symmetryAxes
      )
    : [];

  // Track which tile IDs were "new" (just placed) for pop animation
  const recentIds = new Set(
    tiles.slice(-symmetryAxes * 2).map(t => t.id)
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      width="100%"
      height="100%"
      style={{ cursor: readonly ? "default" : "crosshair", userSelect: "none" }}
      className="canvas-glow"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleClick}
    >
      {/* ── Dark background ───────────────────────────────────────────── */}
      <rect width={VIEWBOX} height={VIEWBOX} fill="#0F0A1E" rx={16} />

      {/* ── Polar grid ────────────────────────────────────────────────── */}
      <PolarGrid axes={symmetryAxes} glowColor={glowColor} />

      {/* ── Placed tiles ──────────────────────────────────────────────── */}
      {tiles.map(tile => (
        <TileRenderer
          key={tile.id}
          tile={tile}
          isNew={recentIds.has(tile.id)}
        />
      ))}

      {/* ── Hover ghost preview ───────────────────────────────────────── */}
      {!readonly && ghostTiles.map((g, i) => (
        <GhostTile
          key={i}
          ring={g.ring}
          segment={g.segment}
          totalSegments={hoveredCell.totalSegments}
          shapeId={activeShape}
          color={activeColor}
        />
      ))}
    </svg>
  );
}

// ── Ghost tile (semi-transparent preview) ─────────────────────────────────────
function GhostTile({ ring, segment, totalSegments, shapeId, color }) {
  const radius = (ring + 1) * RING_GAP;
  const angle  = segmentAngle(segment, totalSegments);
  const x = CENTER_X + radius * Math.cos(angle);
  const y = CENTER_Y + radius * Math.sin(angle);

  return (
    <circle
      cx={x} cy={y} r={10}
      fill={color}
      opacity={0.35}
      style={{ pointerEvents: "none", transition: "all 0.08s ease" }}
    />
  );
}
