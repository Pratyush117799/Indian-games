import { isWithinBounds, isWalkableTile } from "./validation";
import { Position, Tile } from "../types/types";
import { getConnections } from "../constants/tiles";

interface Node {
  pos: Position;
  f: number;
  g: number;
  h: number;
  parent?: Node;
}

function heuristic(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function serialize(pos: Position): string {
  return `${pos.row}-${pos.col}`;
}

export function findPath(start: Position, goal: Position, board: Tile[][]): Position[] | null {
  const openSet: Map<string, Node> = new Map();
  const closedSet: Set<string> = new Set();

  const startNode: Node = {
    pos: start,
    g: 0,
    h: heuristic(start, goal),
    f: heuristic(start, goal)
  };

  openSet.set(serialize(start), startNode);

  while (openSet.size > 0) {
    // Pick node with lowest f score
    let current: Node | null = null;
    for (const node of openSet.values()) {
      if (!current || node.f < current.f) {
        current = node;
      }
    }
    if (!current) break;

    const currentKey = serialize(current.pos);
    if (current.pos.row === goal.row && current.pos.col === goal.col) {
      // reconstruct path
      const path: Position[] = [];
      let n: Node | undefined = current;
      while (n) {
        path.unshift({ ...n.pos });
        n = n.parent;
      }
      return path;
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    const neighbors: Position[] = [
      { row: current.pos.row - 1, col: current.pos.col },
      { row: current.pos.row + 1, col: current.pos.col },
      { row: current.pos.row, col: current.pos.col - 1 },
      { row: current.pos.row, col: current.pos.col + 1 }
    ];

    const currentTile = board[current.pos.row][current.pos.col];
    const currentConn = getConnections(currentTile.type, currentTile.variant, currentTile.rotation);

    for (const neighborPos of neighbors) {
      if (!isWithinBounds(board, neighborPos)) continue;
      const key = serialize(neighborPos);
      if (closedSet.has(key)) continue;

      const neighborTile = board[neighborPos.row][neighborPos.col];
      if (!isWalkableTile(neighborTile)) continue;

      const dr = neighborPos.row - current.pos.row;
      const dc = neighborPos.col - current.pos.col;

      // Check directional connections
      const neighborConn = getConnections(
        neighborTile.type,
        neighborTile.variant,
        neighborTile.rotation
      );

      if (dr === -1) {
        if (!currentConn.north || !neighborConn.south) continue;
      } else if (dr === 1) {
        if (!currentConn.south || !neighborConn.north) continue;
      } else if (dc === 1) {
        if (!currentConn.east || !neighborConn.west) continue;
      } else if (dc === -1) {
        if (!currentConn.west || !neighborConn.east) continue;
      }

      const tentativeG = current.g + 1;

      const existing = openSet.get(key);
      if (existing && tentativeG >= existing.g) {
        continue;
      }

      const h = heuristic(neighborPos, goal);
      const node: Node = {
        pos: neighborPos,
        g: tentativeG,
        h,
        f: tentativeG + h,
        parent: current
      };
      openSet.set(key, node);
    }
  }

  return null;
}

export function verifyEntryCenterExitPath(
  entry: Position,
  center: Position,
  exit: Position,
  board: Tile[][]
): boolean {
  const toCenter = findPath(entry, center, board);
  if (!toCenter) return false;
  const toExit = findPath(center, exit, board);
  return !!toExit;
}

