// store/gameStore.js
import { create } from "zustand";
import { GAME_PHASES, GAME_MODES } from "../utils/constants";

const useGameStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────────────────────
  mode:           GAME_MODES.FREE,
  phase:          GAME_PHASES.IDLE,
  festival:       "diwali",
  targetPattern:  null,
  currentPart:    1,
  totalParts:     1,

  timeLimit:      600,    // seconds
  timeLeft:       600,
  timerActive:    false,

  score:          0,
  accuracy:       0,
  streak:         0,
  bestStreak:     0,
  tilesPlaced:    0,

  // ── Mode / festival ───────────────────────────────────────────────────────
  setMode:       (mode)    => set({ mode }),
  setFestival:   (id)      => set({ festival: id }),
  setPattern:    (pattern) => set({ targetPattern: pattern }),

  // ── Timer ─────────────────────────────────────────────────────────────────
  setTimeLimit:  (secs)    => set({ timeLimit: secs, timeLeft: secs }),

  startGame: () => set({
    phase:       GAME_PHASES.ACTIVE,
    timerActive: true,
    score:       0,
    accuracy:    0,
    streak:      0,
    bestStreak:  0,
    tilesPlaced: 0,
  }),

  tick: () => {
    const { timeLeft, timerActive } = get();
    if (!timerActive || timeLeft <= 0) return;
    const newTime = timeLeft - 1;
    if (newTime <= 0) {
      set({ timeLeft: 0, timerActive: false, phase: GAME_PHASES.FINISHED });
    } else {
      set({ timeLeft: newTime });
    }
  },

  pauseTimer:  () => set({ timerActive: false }),
  resumeTimer: () => set({ timerActive: true }),

  finishGame: (finalScore) => set({
    phase:       GAME_PHASES.FINISHED,
    timerActive: false,
    score:       finalScore,
  }),

  resetGame: () => set({
    phase:       GAME_PHASES.IDLE,
    timerActive: false,
    timeLeft:    600,
    score:       0,
    accuracy:    0,
    streak:      0,
    bestStreak:  0,
    tilesPlaced: 0,
  }),

  // ── Score updates ─────────────────────────────────────────────────────────
  addTilePlaced: () => {
    const { tilesPlaced, streak, bestStreak } = get();
    const newStreak = streak + 1;
    set({
      tilesPlaced: tilesPlaced + 1,
      streak:      newStreak,
      bestStreak:  Math.max(bestStreak, newStreak),
    });
  },

  breakStreak: () => set({ streak: 0 }),
  updateScore: (s) => set({ score: s }),
  updateAccuracy: (a) => set({ accuracy: a }),
}));

export default useGameStore;
