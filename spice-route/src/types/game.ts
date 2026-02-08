export type GameMode = "practice" | "ai" | "friends" | "online";

export interface Cargo {
  Pepper: number;
  Cardamom: number;
}

export interface GameState {
  gold: number;
  cargo: Cargo;
  currentPortId: string | null;
  phase: "idle" | "sailing" | "trading";
  selectedPortId: string | null;
  log: string[];
  showTutorial: boolean;
  gameMode: GameMode;
  savedGameId?: number | null;
}

export const initialCargo: Cargo = { Pepper: 0, Cardamom: 0 };

export function getInitialGameState(gameMode: GameMode): GameState {
  return {
    gold: 100,
    cargo: { ...initialCargo },
    currentPortId: "calicut",
    phase: "idle",
    selectedPortId: null,
    log: ["Docked at Calicut. Buy spices here, then sail to other ports to sell for profit."],
    showTutorial: gameMode === "practice",
    gameMode,
  };
}
