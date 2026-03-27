export interface Point {
  id: number;
  x: number;
  y: number;
  connections: number[];
}

export interface Edge {
  from: number;
  to: number;
}

export interface Piece {
  id: string;
  type: "tiger" | "goat";
  position: number | null;
  captured: boolean;
}

export type Phase = "placement" | "movement";
export type Player = "tiger" | "goat";

export interface Move {
  pieceId: string;
  from: number | null;
  to: number;
  captured?: number;
  turn: number;
}

export interface GameState {
  phase: Phase;
  currentPlayer: Player;
  tigers: Piece[];
  goats: Piece[];
  goatsPlaced: number;
  goatsCaptured: number;
  moveHistory: Move[];
  winner: Player | null;
  selectedPieceId: string | null;
}
