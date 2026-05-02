import type { Point, Edge } from "../types/types";

// Diamond-shaped board: 13 points (0-12), traditional layout
// Can be expanded to 23 points for full traditional board
export const POINTS: Point[] = [
  { id: 0, x: 400, y: 50, connections: [1, 2, 3] },
  { id: 1, x: 250, y: 150, connections: [0, 2, 4, 5] },
  { id: 2, x: 400, y: 150, connections: [0, 1, 3, 5, 6, 7] },
  { id: 3, x: 550, y: 150, connections: [0, 2, 7, 8] },
  { id: 4, x: 100, y: 250, connections: [1, 5, 9] },
  { id: 5, x: 250, y: 250, connections: [1, 2, 4, 6, 9, 10] },
  { id: 6, x: 400, y: 250, connections: [2, 5, 7, 10, 11] },
  { id: 7, x: 550, y: 250, connections: [2, 3, 6, 8, 11] },
  { id: 8, x: 700, y: 250, connections: [3, 7, 11] },
  { id: 9, x: 250, y: 350, connections: [4, 5, 10, 12] },
  { id: 10, x: 400, y: 350, connections: [5, 6, 9, 11, 12] },
  { id: 11, x: 550, y: 350, connections: [6, 7, 8, 10, 12] },
  { id: 12, x: 400, y: 450, connections: [9, 10, 11] },
];

const edgeSet = new Set<string>();
for (const p of POINTS) {
  for (const c of p.connections) {
    const key = [p.id, c].sort((a, b) => a - b).join("-");
    edgeSet.add(key);
  }
}

export const EDGES: Edge[] = Array.from(edgeSet).map((key) => {
  const [from, to] = key.split("-").map(Number);
  return { from, to };
});

export const TIGER_START_POSITIONS = [0, 4, 8];

export function getPointById(id: number): Point | undefined {
  return POINTS.find((p) => p.id === id);
}

/** Point that is connected to both a and b (the "between" point for a jump). */
export function getMidPointBetween(a: number, b: number): number | null {
  const pa = getPointById(a);
  const pb = getPointById(b);
  if (!pa || !pb) return null;
  const mid = POINTS.find(
    (p) =>
      p.id !== a &&
      p.id !== b &&
      pa.connections.includes(p.id) &&
      pb.connections.includes(p.id)
  );
  return mid?.id ?? null;
}

export function areInLine(a: number, b: number, mid: number): boolean {
  const pa = getPointById(a);
  const pm = getPointById(mid);
  const pb = getPointById(b);
  if (!pa || !pm || !pb) return false;
  return pa.connections.includes(mid) && pm.connections.includes(b);
}
