import { CENTER_POSITION, ENTRY_POSITION, EXIT_POSITION } from "../constants/config";
import { getConnections } from "../constants/tiles";
import { Position, Tile, TileType } from "../types/types";

export function isSpecialPosition(pos: Position): boolean {
  const key = `${pos.row}-${pos.col}`;
  return (
    key === `${ENTRY_POSITION.row}-${ENTRY_POSITION.col}` ||
    key === `${CENTER_POSITION.row}-${CENTER_POSITION.col}` ||
    key === `${EXIT_POSITION.row}-${EXIT_POSITION.col}`
  );
}

export function canPlaceTile(tileType: TileType, row: number, col: number, board: Tile[][]): boolean {
  const target = board[row][col];
  if (target.type !== "empty" && !isSpecialPosition({ row, col })) {
    return false;
  }

  if (isSpecialPosition({ row, col })) {
    // Cannot overwrite entry/center/exit
    return false;
  }

  if ((tileType === "wall" || tileType === "guard") && isSpecialPosition({ row, col })) {
    return false;
  }

  return true;
}

export function areAdjacent(a: Position, b: Position): boolean {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

export function isWithinBounds(board: Tile[][], pos: Position): boolean {
  return pos.row >= 0 && pos.col >= 0 && pos.row < board.length && pos.col < board[0].length;
}

export function isWalkableTile(tile: Tile): boolean {
  if (!tile.walkable) return false;
  if (tile.type === "wall" || tile.type === "guard" || tile.type === "empty") return false;
  return true;
}

export function canMoveTo(from: Tile, to: Tile, board: Tile[][], centerReached: boolean): boolean {
  if (!areAdjacent(from.position, to.position)) return false;
  if (!isWalkableTile(to)) return false;

  const fromConn = getConnections(from.type, from.variant, from.rotation);
  const toConn = getConnections(to.type, to.variant, to.rotation);

  const dr = to.position.row - from.position.row;
  const dc = to.position.col - from.position.col;

  if (dr === -1) {
    // moving north
    if (!fromConn.north || !toConn.south) return false;
  } else if (dr === 1) {
    // south
    if (!fromConn.south || !toConn.north) return false;
  } else if (dc === 1) {
    // east
    if (!fromConn.east || !toConn.west) return false;
  } else if (dc === -1) {
    // west
    if (!fromConn.west || !toConn.east) return false;
  }

  // Must visit center before exit
  const isExit =
    to.position.row === EXIT_POSITION.row && to.position.col === EXIT_POSITION.col;
  if (isExit && !centerReached) {
    return false;
  }

  return true;
}

export function hasAnyValidMoves(current: Position, board: Tile[][], centerReached: boolean): boolean {
  const currentTile = board[current.row][current.col];
  const candidates: Position[] = [
    { row: current.row - 1, col: current.col },
    { row: current.row + 1, col: current.col },
    { row: current.row, col: current.col - 1 },
    { row: current.row, col: current.col + 1 }
  ];

  return candidates.some((pos) => {
    if (!isWithinBounds(board, pos)) return false;
    const t = board[pos.row][pos.col];
    return canMoveTo(currentTile, t, board, centerReached);
  });
}

