import React from 'react'
import { motion } from 'framer-motion'
import { usePlayerStore } from '@store/usePlayerStore'

export default function XPBar({ compact = false }) {
  const { xp, level } = usePlayerStore()

  const xpPerLevel    = 200
  const currentLevelXP = xp % xpPerLevel
  const percent        = Math.min(100, (currentLevelXP / xpPerLevel) * 100)
  const nextLevelXP    = xpPerLevel - currentLevelXP

  return (
    <div className={compact ? 'flex items-center gap-3' : 'space-y-1'}>
      {!compact && (
        <div className="flex justify-between items-center mb-1">
          <span className="font-display text-xs text-cyber-cyan tracking-widest">
            RANK {level}
          </span>
          <span className="font-mono text-xs text-cyber-muted">
            {xp} XP · {nextLevelXP} to next
          </span>
        </div>
      )}

      {compact && (
        <span className="font-display text-xs text-cyber-cyan tracking-widest whitespace-nowrap">
          R{level}
        </span>
      )}

      <div className={`relative bg-cyber-border rounded-full overflow-hidden ${compact ? 'w-32 h-2' : 'h-3 w-full'}`}>
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {/* Scanline shimmer */}
        <div className="absolute inset-0 bg-scanlines opacity-30 rounded-full" />
      </div>

      {compact && (
        <span className="font-mono text-xs text-cyber-muted">{xp} XP</span>
      )}
    </div>
  )
}
