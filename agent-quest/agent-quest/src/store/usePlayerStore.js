import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const usePlayerStore = create(
  persist(
    (set, get) => ({
      // ── Identity ──
      playerName: '',
      apiKey: '',

      // ── Progress ──
      currentLevel: 1,
      completedLevels: [],   // [1, 2, ...]
      xp: 0,
      level: 1,              // player rank level (1–10)

      // ── Collectibles ──
      unlockedBlueprints: [],   // blueprint IDs
      quizScores: {},           // { levelId: score }

      // ── Actions ──
      setPlayerName: (name) => set({ playerName: name }),
      setApiKey:     (key)  => set({ apiKey: key }),

      addXP: (amount) => {
        const newXP = get().xp + amount
        // Level up every 200 XP (rank 1–10)
        const newRank = Math.min(10, Math.floor(newXP / 200) + 1)
        set({ xp: newXP, level: newRank })
      },

      completeLevel: (id) => {
        const already = get().completedLevels
        if (!already.includes(id)) {
          set({ completedLevels: [...already, id] })
        }
        if (id >= get().currentLevel) {
          set({ currentLevel: Math.min(5, id + 1) })
        }
      },

      unlockBlueprint: (bpId) => {
        const current = get().unlockedBlueprints
        if (!current.includes(bpId)) {
          set({ unlockedBlueprints: [...current, bpId] })
        }
      },

      saveQuizScore: (levelId, score) =>
        set({ quizScores: { ...get().quizScores, [levelId]: score } }),

      reset: () => set({
        playerName: '', apiKey: '',
        currentLevel: 1, completedLevels: [],
        xp: 0, level: 1,
        unlockedBlueprints: [], quizScores: {},
      }),
    }),
    {
      name: 'agent-quest-player',   // localStorage key
      partialize: (s) => ({
        playerName:        s.playerName,
        apiKey:            s.apiKey,
        currentLevel:      s.currentLevel,
        completedLevels:   s.completedLevels,
        xp:                s.xp,
        level:             s.level,
        unlockedBlueprints: s.unlockedBlueprints,
        quizScores:        s.quizScores,
      }),
    }
  )
)
