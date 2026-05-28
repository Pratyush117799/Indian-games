import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { usePlayerStore } from '@store/usePlayerStore'

export function useXP() {
  const { addXP, level: currentLevel } = usePlayerStore()

  const awardXP = useCallback((amount, reason = '') => {
    addXP(amount)

    toast.custom((t) => (
      <div
        className={`
          flex items-center gap-3 px-4 py-3 bg-cyber-surface 
          border border-cyber-green/50 clip-cyber-sm
          font-display text-sm text-cyber-green
          shadow-neon-green
          transition-all duration-300
          ${t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        `}
      >
        <span className="text-lg">⚡</span>
        <div>
          <div className="tracking-widest">+{amount} XP</div>
          {reason && <div className="text-xs text-cyber-muted font-body normal-case tracking-normal">{reason}</div>}
        </div>
      </div>
    ), { duration: 2500 })

    // Check for rank-up
    const afterXP = usePlayerStore.getState().xp
    const newLevel = Math.min(10, Math.floor(afterXP / 200) + 1)
    if (newLevel > currentLevel) {
      setTimeout(() => {
        toast.custom((t) => (
          <div className={`
            flex items-center gap-3 px-5 py-4 bg-cyber-surface
            border border-cyber-amber/60 clip-cyber
            font-display text-sm text-cyber-amber
            shadow-neon-amber
            ${t.visible ? 'opacity-100' : 'opacity-0'}
          `}>
            <span className="text-2xl">🏆</span>
            <div>
              <div className="tracking-widest text-base">RANK UP!</div>
              <div className="text-xs text-cyber-muted font-body normal-case">You are now Rank {newLevel}</div>
            </div>
          </div>
        ), { duration: 4000 })
      }, 500)
    }
  }, [addXP, currentLevel])

  return { awardXP }
}
