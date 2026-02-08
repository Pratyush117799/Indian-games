import type { GameState } from "../types/types";
import { GOATS_TO_CAPTURE } from "../constants/config";
import { getValidMoves } from "./moveValidation";

export function checkVictory(state: GameState): "tiger" | "goat" | null {
  if (state.goatsCaptured >= GOATS_TO_CAPTURE) return "tiger";

  if (state.phase === "movement") {
    const allTigersTrapped = state.tigers.every((t) => {
      if (t.position === null) return false;
      return getValidMoves(t, state).length === 0;
    });
    if (allTigersTrapped) return "goat";
  }

  return null;
}
