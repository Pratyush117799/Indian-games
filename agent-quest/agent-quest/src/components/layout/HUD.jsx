import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import XPBar from '@components/ui/XPBar'
import { usePlayerStore } from '@store/usePlayerStore'

export default function HUD() {
  const { playerName, level, completedLevels } = usePlayerStore()
  const navigate = useNavigate()

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-cyber-border bg-cyber-bg/90 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/map" className="flex items-center gap-2 group">
          <span className="font-display text-lg font-bold text-cyber-cyan glow-cyan tracking-widest">
            AGENT<span className="text-cyber-purple">QUEST</span>
          </span>
        </Link>

        {/* Center: XP Bar */}
        <div className="flex-1 max-w-xs hidden md:block">
          <XPBar compact />
        </div>

        {/* Right: Nav + Player */}
        <div className="flex items-center gap-4">
          <nav className="hidden sm:flex items-center gap-4 font-display text-xs tracking-widest">
            <Link
              to="/map"
              className="text-cyber-muted hover:text-cyber-cyan transition-colors"
            >
              MAP
            </Link>
            <Link
              to="/vault"
              className="text-cyber-muted hover:text-cyber-amber transition-colors"
            >
              VAULT
              {completedLevels.length > 0 && (
                <span className="ml-1 text-cyber-amber">
                  ({completedLevels.length})
                </span>
              )}
            </Link>
          </nav>

          {playerName && (
            <div className="flex items-center gap-2 border border-cyber-border px-3 py-1 clip-cyber-sm">
              <span className="text-cyber-cyan font-display text-xs">RANK {level}</span>
              <span className="text-cyber-muted text-xs">·</span>
              <span className="text-cyber-text font-mono text-xs">{playerName}</span>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}
