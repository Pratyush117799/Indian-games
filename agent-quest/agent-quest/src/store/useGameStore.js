import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  // ── Active level ──
  activeLevelId: null,
  phase: 'intro',   // 'intro' | 'playing' | 'quiz' | 'complete'

  // ── Mascot ──
  mascotMessage: null,    // { text, mood }   mood: 'happy'|'thinking'|'excited'|'idle'
  mascotVisible: true,

  // ── Hint system ──
  hintUsed: false,
  hintsRemaining: 3,

  // ── Actions ──
  setActiveLevelId: (id)  => set({ activeLevelId: id, phase: 'intro', hintUsed: false }),
  setPhase:         (p)   => set({ phase: p }),

  showMascot: (text, mood = 'happy') =>
    set({ mascotMessage: { text, mood }, mascotVisible: true }),
  hideMascot: () => set({ mascotVisible: false }),

  useHint: () => {
    const rem = get().hintsRemaining
    if (rem > 0) set({ hintUsed: true, hintsRemaining: rem - 1 })
  },

  resetLevel: () => set({
    phase: 'intro',
    hintUsed: false,
    hintsRemaining: 3,
    mascotMessage: null,
  }),
}))
