import { Position } from "../types/types";

export const BOARD_SIZE = 9;

// Entry at outer edge (west), center, and exit on opposite edge (east)
export const ENTRY_POSITION: Position = { row: 4, col: 0 };
export const CENTER_POSITION: Position = { row: 4, col: 4 };
export const EXIT_POSITION: Position = { row: 4, col: 8 };

// Inventory counts (total path tiles = 12 across all variants)
export const INITIAL_INVENTORY: { [key: string]: number } = {
  "path-straight": 6,
  "path-corner": 3,
  "path-t": 3,
  "path-cross": 0,
  wall: 6,
  guard: 3
};

