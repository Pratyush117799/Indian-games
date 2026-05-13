// store/canvasStore.js
import { create } from "zustand";
import { getMirrorPositions, segmentsForRing } from "../utils/symmetryEngine";

const useCanvasStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────────────────────
  tiles:        [],       // [{ id, ring, segment, totalSegments, shapeId, color, rotation }]
  history:      [],       // undo stack — array of tiles[] snapshots
  future:       [],       // redo stack
  symmetryAxes: 8,
  activeShape:  "petal",
  activeColor:  "#FF6B00",
  hoveredCell:  null,     // { ring, segment, totalSegments } — for preview ghost

  // ── Tile actions ──────────────────────────────────────────────────────────
  placeTile: ({ ring, segment, totalSegments }) => {
    const { tiles, history, symmetryAxes, activeShape, activeColor } = get();

    // Prevent duplicate on same cell
    const exists = (r, s) => tiles.some(t => t.ring === r && t.segment === s);

    const mirrors = getMirrorPositions(ring, segment, totalSegments, symmetryAxes);
    const newTiles = mirrors
      .filter(m => !exists(m.ring, m.segment))
      .map(m => ({
        id:             `${m.ring}-${m.segment}-${Date.now()}-${Math.random()}`,
        ring:           m.ring,
        segment:        m.segment,
        totalSegments,
        shapeId:        activeShape,
        color:          activeColor,
        rotation:       0,
        placedAt:       Date.now(),
      }));

    if (newTiles.length === 0) return;

    set({
      tiles:   [...tiles, ...newTiles],
      history: [...history, tiles],
      future:  [],            // clear redo on new action
    });
  },

  removeTile: (ring, segment) => {
    const { tiles, history } = get();
    set({
      tiles:   tiles.filter(t => !(t.ring === ring && t.segment === segment)),
      history: [...history, tiles],
      future:  [],
    });
  },

  undo: () => {
    const { history, tiles, future } = get();
    if (history.length === 0) return;
    set({
      tiles:   history.at(-1),
      history: history.slice(0, -1),
      future:  [tiles, ...future],
    });
  },

  redo: () => {
    const { history, tiles, future } = get();
    if (future.length === 0) return;
    set({
      tiles:   future[0],
      history: [...history, tiles],
      future:  future.slice(1),
    });
  },

  clear: () => {
    const { tiles, history } = get();
    if (tiles.length === 0) return;
    set({ tiles: [], history: [...history, tiles], future: [] });
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  setSymmetryAxes: (axes) => set({ symmetryAxes: axes }),
  setActiveShape:  (id)   => set({ activeShape: id }),
  setActiveColor:  (hex)  => set({ activeColor: hex }),
  setHoveredCell:  (cell) => set({ hoveredCell: cell }),

  // ── Load external pattern (puzzle / festival) ─────────────────────────────
  loadPattern: (patternTiles) => set({ tiles: patternTiles, history: [], future: [] }),
}));

export default useCanvasStore;
