// utils/symmetryEngine.js
import { GRID } from "./constants";

const { CENTER_X, CENTER_Y, RING_GAP } = GRID;

/**
 * Convert a polar grid position (ring, segment) to SVG x/y coordinates.
 * ring=0 is the innermost ring; segment=0 starts at 12 o'clock, clockwise.
 */
export function polarToXY(ring, segment, totalSegments) {
  const radius = (ring + 1) * RING_GAP;
  const angle  = (segment / totalSegments) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CENTER_X + radius * Math.cos(angle),
    y: CENTER_Y + radius * Math.sin(angle),
  };
}

/**
 * Get the angle (radians) for a given segment.
 */
export function segmentAngle(segment, totalSegments) {
  return (segment / totalSegments) * 2 * Math.PI - Math.PI / 2;
}

/**
 * Given a placed tile (ring, segment), return ALL mirror positions
 * for the chosen number of symmetry axes.
 */
export function getMirrorPositions(ring, segment, totalSegments, axes) {
  if (axes <= 1) return [{ ring, segment }]; // Free mode — no mirror
  const step = totalSegments / axes;
  return Array.from({ length: axes }, (_, i) => ({
    ring,
    segment: Math.round((segment + i * step) % totalSegments),
  }));
}

/**
 * Compute the total number of segments for a given ring and axis count.
 * Inner rings have fewer slots; outer rings have more.
 * We keep it a multiple of axes so mirroring is always clean.
 */
export function segmentsForRing(ring, axes) {
  // Base segments scales with ring number; always a clean multiple of axes
  const base = axes === 1 ? 12 : axes * Math.max(1, ring + 1);
  return Math.min(base, axes * 8); // cap at axes*8
}

/**
 * Snap an SVG (x, y) click to the nearest (ring, segment) grid cell.
 * Returns null if outside the grid.
 */
export function xyToGrid(x, y, axes) {
  const dx = x - CENTER_X;
  const dy = y - CENTER_Y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Which ring?
  const ring = Math.round(dist / RING_GAP) - 1;
  if (ring < 0 || ring >= GRID.RINGS) return null;

  // Which segment?
  const totalSegs = segmentsForRing(ring, axes);
  let angle = Math.atan2(dy, dx) + Math.PI / 2; // shift so 0 = 12 o'clock
  if (angle < 0) angle += 2 * Math.PI;
  const segment = Math.round((angle / (2 * Math.PI)) * totalSegs) % totalSegs;

  return { ring, segment, totalSegments: totalSegs };
}

/**
 * Build all concentric ring circles for the SVG grid background.
 */
export function buildGridRings() {
  return Array.from({ length: GRID.RINGS }, (_, i) => ({
    r: (i + 1) * RING_GAP,
    cx: CENTER_X,
    cy: CENTER_Y,
  }));
}

/**
 * Build axis guide lines (like spokes on a wheel) for the current symmetry.
 */
export function buildAxisLines(axes) {
  if (axes <= 1) return [];
  const outerR = GRID.RINGS * RING_GAP + 4;
  return Array.from({ length: axes }, (_, i) => {
    const angle = (i / axes) * 2 * Math.PI - Math.PI / 2;
    return {
      x1: CENTER_X + outerR * Math.cos(angle),
      y1: CENTER_Y + outerR * Math.sin(angle),
      x2: CENTER_X - outerR * Math.cos(angle),
      y2: CENTER_Y - outerR * Math.sin(angle),
    };
  });
}
