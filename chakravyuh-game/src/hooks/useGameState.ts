import { useCallback, useMemo, useState } from "react";
import { CENTER_POSITION, ENTRY_POSITION, EXIT_POSITION, INITIAL_INVENTORY } from "../constants/config";
import { cloneBoard, createEmptyBoard, getConnections, rotateRotation } from "../constants/tiles";
import { findPath, verifyEntryCenterExitPath } from "../utils/pathfinding";
import { hasAnyValidMoves, canMoveTo, isSpecialPosition } from "../utils/validation";
import {
  GameMode,
  GameState,
  InventoryKey,
  Position,
  Tile,
  TileType,
  TileVariant
} from "../types/types";

interface GameApi extends GameState {
  selectedInventoryKey: InventoryKey | null;
  setMode: (mode: GameMode) => void;
  selectInventoryKey: (key: InventoryKey | null) => void;
  placeOrRotateTile: (pos: Position) => void;
  removeTile: (pos: Position) => void;
  verifySolution: () => void;
  lockFormation: () => void;
  restart: () => void;
  warriorSelected: boolean;
  toggleWarriorSelected: () => void;
  moveWarriorTo: (pos: Position) => void;
  validWarriorMoves: Position[];
  // education / UX
  closeStoryModal: () => void;
  toggleTutorialEnabled: () => void;
  nextTutorialStep: () => void;
  skipTutorial: () => void;
  toggleSanskritLearning: () => void;
}

export function useGameState(): GameApi {
  const [state, setState] = useState<GameState>(() => ({
    mode: "building",
    board: createEmptyBoard(),
    warriorPosition: null,
    moveCount: 0,
    centerReached: false,
    inventory: { ...INITIAL_INVENTORY },
    solutionExists: false,
    message: null,
    showStoryModal: true,
    tutorialEnabled: true,
    showTutorial: true,
    tutorialStep: 0,
    sanskritLearningEnabled: true,
    totalGames: 0,
    totalVictories: 0
  }));

  const [selectedInventoryKey, setSelectedInventoryKey] = useState<InventoryKey | null>("path-straight");
  const [warriorSelected, setWarriorSelected] = useState(false);

  const setMode = useCallback((mode: GameMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  const selectInventoryKey = useCallback((key: InventoryKey | null) => {
    setSelectedInventoryKey(key);
  }, []);

  const applyTileMeta = (tile: Tile, type: TileType, variant: TileVariant, rotation: number): Tile => {
    const rot = (rotation % 360) as 0 | 90 | 180 | 270;
    const walkable = type === "path" || type === "entry" || type === "exit" || type === "center";
    return {
      ...tile,
      type,
      variant,
      rotation: rot,
      walkable,
      connections: getConnections(type, variant, rot)
    };
  };

  const placeOrRotateTile = useCallback(
    (pos: Position) => {
      setState((prev) => {
        if (prev.mode !== "building") return prev;
        const invKey = selectedInventoryKey;
        const board = cloneBoard(prev.board);
        const tile = board[pos.row][pos.col];

        // Do not modify special tiles directly
        if (isSpecialPosition(pos)) {
          // allow rotation of center/entry/exit
          if (tile.type === "entry" || tile.type === "exit" || tile.type === "center") {
            const rotation = rotateRotation(tile.rotation);
            board[pos.row][pos.col] = applyTileMeta(tile, tile.type, tile.variant, rotation);
          }
          return { ...prev, board, message: null };
        }

        // Empty cell: place from inventory
        if (tile.type === "empty") {
          if (!invKey) return prev;
          if (prev.inventory[invKey] <= 0) return { ...prev, message: "No tiles of this type left." };

          let type: TileType = "path";
          let variant: TileVariant = "straight";
          if (invKey === "path-straight") {
            type = "path";
            variant = "straight";
          } else if (invKey === "path-corner") {
            type = "path";
            variant = "corner";
          } else if (invKey === "path-t") {
            type = "path";
            variant = "t-junction";
          } else if (invKey === "path-cross") {
            type = "path";
            variant = "cross";
          } else if (invKey === "wall") {
            type = "wall";
            variant = "solid";
          } else if (invKey === "guard") {
            type = "guard";
            variant = "solid";
          }

          board[pos.row][pos.col] = applyTileMeta(tile, type, variant, 0);

          return {
            ...prev,
            board,
            inventory: {
              ...prev.inventory,
              [invKey]: prev.inventory[invKey] - 1
            },
            solutionExists: false,
            message: null
          };
        }

        // Existing tile (non-special): rotate
        if (!isSpecialPosition(pos) && tile.type !== "empty") {
          const rotation = rotateRotation(tile.rotation);
          board[pos.row][pos.col] = applyTileMeta(tile, tile.type, tile.variant, rotation);
        }

        return { ...prev, board, solutionExists: false, message: null };
      });
    },
    [selectedInventoryKey]
  );

  const removeTile = useCallback((pos: Position) => {
    setState((prev) => {
      if (prev.mode !== "building") return prev;
      if (isSpecialPosition(pos)) return prev;
      const board = cloneBoard(prev.board);
      const tile = board[pos.row][pos.col];
      if (tile.type === "empty") return prev;

      // Determine inventory key to refund
      let invKey: InventoryKey | null = null;
      if (tile.type === "path") {
        if (tile.variant === "straight") invKey = "path-straight";
        else if (tile.variant === "corner") invKey = "path-corner";
        else if (tile.variant === "t-junction") invKey = "path-t";
        else if (tile.variant === "cross") invKey = "path-cross";
      } else if (tile.type === "wall") {
        invKey = "wall";
      } else if (tile.type === "guard") {
        invKey = "guard";
      }

      board[pos.row][pos.col] = applyTileMeta(
        tile,
        "empty",
        "solid",
        0
      );

      return {
        ...prev,
        board,
        inventory: invKey
          ? {
              ...prev.inventory,
              [invKey]: prev.inventory[invKey] + 1
            }
          : prev.inventory,
        solutionExists: false,
        message: null
      };
    });
  }, []);

  const verifySolution = useCallback(() => {
    setState((prev) => {
      const ok = verifyEntryCenterExitPath(ENTRY_POSITION, CENTER_POSITION, EXIT_POSITION, prev.board);
      return {
        ...prev,
        solutionExists: ok,
        message: ok ? "Solution verified!" : "No valid path exists"
      };
    });
  }, []);

  const lockFormation = useCallback(() => {
    setState((prev) => {
      if (!prev.solutionExists) {
        return { ...prev, message: "Verify a valid solution before locking." };
      }
      return {
        ...prev,
        mode: "solving",
        warriorPosition: { ...ENTRY_POSITION },
        moveCount: 0,
        centerReached: false,
        message: "Guide the warrior through the Chakravyuh."
      };
    });
    setWarriorSelected(false);
  }, []);

  const restart = useCallback(() => {
    setState((prev) => ({
      ...prev,
      mode: "building",
      board: createEmptyBoard(),
      warriorPosition: null,
      moveCount: 0,
      centerReached: false,
      inventory: { ...INITIAL_INVENTORY },
      solutionExists: false,
      message: null
    }));
    setSelectedInventoryKey("path-straight");
    setWarriorSelected(false);
  }, []);

  const toggleWarriorSelected = useCallback(() => {
    setWarriorSelected((v) => !v);
  }, []);

  const moveWarriorTo = useCallback(
    (pos: Position) => {
      setState((prev) => {
        if (prev.mode !== "solving" || !prev.warriorPosition) return prev;

        const fromTile = prev.board[prev.warriorPosition.row][prev.warriorPosition.col];
        const toTile = prev.board[pos.row][pos.col];

        if (!canMoveTo(fromTile, toTile, prev.board, prev.centerReached)) {
          return { ...prev, message: "Invalid move." };
        }

        const newCenterReached =
          prev.centerReached ||
          (pos.row === CENTER_POSITION.row && pos.col === CENTER_POSITION.col);

        const isExit = pos.row === EXIT_POSITION.row && pos.col === EXIT_POSITION.col;

        let mode: GameMode = prev.mode;
        let message = "Move made.";

        let totalGames = prev.totalGames;
        let totalVictories = prev.totalVictories;

        if (isExit && newCenterReached) {
          mode = "victory";
          message = `Victory! Solved in ${prev.moveCount + 1} moves.`;
          totalGames += 1;
          totalVictories += 1;
        } else {
          // Check defeat (no valid moves from new position)
          if (!hasAnyValidMoves(pos, prev.board, newCenterReached)) {
            mode = "defeat";
            message = "No valid moves available.";
            totalGames += 1;
          }
        }

        return {
          ...prev,
          warriorPosition: { ...pos },
          moveCount: prev.moveCount + 1,
          centerReached: newCenterReached,
          mode,
          message,
          totalGames,
          totalVictories
        };
      });
    },
    []
  );

  const validWarriorMoves = useMemo<Position[]>(() => {
    if (state.mode !== "solving" || !state.warriorPosition) return [];
    const from = state.board[state.warriorPosition.row][state.warriorPosition.col];
    const candidates: Position[] = [
      { row: from.position.row - 1, col: from.position.col },
      { row: from.position.row + 1, col: from.position.col },
      { row: from.position.row, col: from.position.col - 1 },
      { row: from.position.row, col: from.position.col + 1 }
    ];
    return candidates.filter((pos) => {
      if (pos.row < 0 || pos.col < 0 || pos.row >= state.board.length || pos.col >= state.board[0].length) {
        return false;
      }
      const to = state.board[pos.row][pos.col];
      return canMoveTo(from, to, state.board, state.centerReached);
    });
  }, [state.board, state.centerReached, state.mode, state.warriorPosition]);

  const closeStoryModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showStoryModal: false
    }));
  }, []);

  const toggleTutorialEnabled = useCallback(() => {
    setState((prev) => {
      const enabled = !prev.tutorialEnabled;
      return {
        ...prev,
        tutorialEnabled: enabled,
        showTutorial: enabled && prev.showTutorial
      };
    });
  }, []);

  const nextTutorialStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      tutorialStep: prev.tutorialStep + 1,
      showTutorial: prev.tutorialStep + 1 < 5 // 5 steps total
    }));
  }, []);

  const skipTutorial = useCallback(() => {
    setState((prev) => ({
      ...prev,
      tutorialEnabled: false,
      showTutorial: false
    }));
  }, []);

  const toggleSanskritLearning = useCallback(() => {
    setState((prev) => ({
      ...prev,
      sanskritLearningEnabled: !prev.sanskritLearningEnabled
    }));
  }, []);

  return {
    ...state,
    selectedInventoryKey,
    setMode,
    selectInventoryKey,
    placeOrRotateTile,
    removeTile,
    verifySolution,
    lockFormation,
    restart,
    warriorSelected,
    toggleWarriorSelected,
    moveWarriorTo,
    validWarriorMoves,
    closeStoryModal,
    toggleTutorialEnabled,
    nextTutorialStep,
    skipTutorial,
    toggleSanskritLearning
  };
}

