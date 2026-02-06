export type TileType = "path" | "wall" | "guard" | "entry" | "exit" | "center" | "empty";

export type TileVariant = "straight" | "corner" | "t-junction" | "cross" | "solid";

export type Rotation = 0 | 90 | 180 | 270;

export interface Position {
  row: number;
  col: number;
}

export interface Tile {
  id: string;
  type: TileType;
  rotation: Rotation;
  variant: TileVariant;
  position: Position;
  walkable: boolean;
  connections: {
    north: boolean;
    south: boolean;
    east: boolean;
    west: boolean;
  };
}

export type GameMode = "menu" | "building" | "solving" | "victory" | "defeat";

export interface GameState {
  mode: GameMode;
  board: Tile[][];
  warriorPosition: Position | null;
  moveCount: number;
  centerReached: boolean;
  inventory: { [key: string]: number };
  solutionExists: boolean;
  message: string | null;
  // educational / UX flags
  showStoryModal: boolean;
  tutorialEnabled: boolean;
  showTutorial: boolean;
  tutorialStep: number;
  sanskritLearningEnabled: boolean;
  // simple aggregate stats
  totalGames: number;
  totalVictories: number;
}

export type InventoryKey =
  | "path-straight"
  | "path-corner"
  | "path-t"
  | "path-cross"
  | "wall"
  | "guard";

