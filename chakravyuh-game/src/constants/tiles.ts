import { Rotation, Tile, TileType, TileVariant } from "../types/types";
import { BOARD_SIZE, CENTER_POSITION, ENTRY_POSITION, EXIT_POSITION } from "./config";

export function createEmptyBoard(): Tile[][] {
  const board: Tile[][] = [];
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    const rowTiles: Tile[] = [];
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const id = `${row}-${col}`;
      let type: TileType = "empty";
      let variant: TileVariant = "solid";

      if (row === ENTRY_POSITION.row && col === ENTRY_POSITION.col) {
        type = "entry";
        variant = "straight";
      } else if (row === CENTER_POSITION.row && col === CENTER_POSITION.col) {
        type = "center";
        variant = "cross";
      } else if (row === EXIT_POSITION.row && col === EXIT_POSITION.col) {
        type = "exit";
        variant = "straight";
      }

      const walkable = type === "path" || type === "entry" || type === "exit" || type === "center";

      const tile: Tile = {
        id,
        type,
        rotation: 0,
        variant,
        position: { row, col },
        walkable,
        connections: getConnections(type, variant, 0)
      };
      rowTiles.push(tile);
    }
    board.push(rowTiles);
  }
  return board;
}

export function rotateRotation(rotation: Rotation): Rotation {
  const order: Rotation[] = [0, 90, 180, 270];
  const index = order.indexOf(rotation);
  return order[(index + 1) % order.length];
}

export function getConnections(type: TileType, variant: TileVariant, rotation: Rotation) {
  if (type === "wall" || type === "guard" || type === "empty") {
    return { north: false, south: false, east: false, west: false };
  }

  // Entry, exit, center behave like path tiles based on variant
  const rot = rotation;

  // Base connection patterns at 0°
  let base = { north: false, south: false, east: false, west: false };

  if (variant === "straight") {
    base = { north: true, south: true, east: false, west: false };
  } else if (variant === "corner") {
    base = { north: true, east: true, south: false, west: false };
  } else if (variant === "t-junction") {
    base = { north: true, east: true, west: true, south: false };
  } else if (variant === "cross") {
    base = { north: true, south: true, east: true, west: true };
  }

  // Rotate connections
  const rotateOnce = (c: typeof base) => ({
    north: c.west,
    east: c.north,
    south: c.east,
    west: c.south
  });

  let connections = base;
  if (rot === 90) {
    connections = rotateOnce(base);
  } else if (rot === 180) {
    connections = rotateOnce(rotateOnce(base));
  } else if (rot === 270) {
    connections = rotateOnce(rotateOnce(rotateOnce(base)));
  }

  return connections;
}

export function cloneBoard(board: Tile[][]): Tile[][] {
  return board.map((row) => row.map((tile) => ({ ...tile, position: { ...tile.position }, connections: { ...tile.connections } })));
}

