import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '@components/layout/GameShell'
import MascotDialogue from '@components/mascot/MascotDialogue'
import NeonButton from '@components/ui/NeonButton'
import { useGameStore } from '@store/useGameStore'
import { useAgentStore } from '@store/useAgentStore'
import { getLevelById } from '@data/levels'
import { MASCOT_DIALOGUES } from '@data/mascotDialogues'

import Level1 from '@levels/Level1/Level1'
import Level2 from '@levels/Level2/Level2'
import Level3 from '@levels/Level3/Level3'
import Level4 from '@levels/Level4/Level4'
import Level5 from '@levels/Level5/Level5'

const LEVEL_COMPONENTS = { 1: Level1, 2: Level2, 3: Level3, 4: Level4, 5: Level5 }

export default function GamePage() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const levelId    = parseInt(id)
  const level      = getLevelById(levelId)

  const { setActiveLevelId, showMascot, resetLevel } = useGameStore()
  const { resetAgent, setAvailableTools, enableLoop, enableMemory } = useAgentStore()

  useEffect(() => {
    if (!level) { navigate('/map'); return }

    // Setup level state
    resetLevel()
    resetAgent()
    setActiveLevelId(levelId)
    setAvailableTools(level.availableTools)
    if (level.loopEnabled)   enableLoop()
    if (level.memoryEnabled) enableMemory()

    // Greet with mascot
    const dialogue = MASCOT_DIALOGUES[`level${levelId}`]?.intro
    if (dialogue) setTimeout(() => showMascot(dialogue.text, dialogue.mood), 800)
  }, [levelId])

  if (!level) return null

  const LevelComponent = LEVEL_COMPONENTS[levelId]
  if (!LevelComponent) return (
    <GameShell>
      <div className="flex items-center justify-center h-64">
        <p className="text-cyber-muted font-mono">Level {levelId} — Coming Soon</p>
      </div>
    </GameShell>
  )

  return (
    <GameShell>
      {/* Level banner */}
      <div className="border-b border-cyber-border bg-cyber-surface/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/map')}
              className="font-display text-xs text-cyber-muted hover:text-cyber-cyan
                tracking-widest transition-colors"
            >
              ← MAP
            </button>
            <div className="w-px h-4 bg-cyber-border" />
            <span className="font-display text-xs text-cyber-muted tracking-widest">
              LEVEL {levelId}
            </span>
            <span className="font-display text-sm font-bold text-cyber-text tracking-wide">
              {level.icon} {level.title}
            </span>
          </div>
          <div className="hidden sm:block font-mono text-xs text-cyber-muted">
            {level.concept}
          </div>
        </div>
      </div>

      {/* Level content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={levelId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="flex-1"
        >
          <LevelComponent level={level} />
        </motion.div>
      </AnimatePresence>

      {/* Floating mascot dialogue */}
      <MascotDialogue position="bottom-right" />
    </GameShell>
  )
}
