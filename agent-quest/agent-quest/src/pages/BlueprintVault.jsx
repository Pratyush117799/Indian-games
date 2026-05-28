import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GameShell from '@components/layout/GameShell'
import GlowCard from '@components/ui/GlowCard'
import CyberBadge from '@components/ui/CyberBadge'
import NeonButton from '@components/ui/NeonButton'
import { BLUEPRINTS, RARITY_COLORS } from '@data/blueprints'
import { usePlayerStore } from '@store/usePlayerStore'

export default function BlueprintVault() {
  const { unlockedBlueprints } = usePlayerStore()
  const [selected, setSelected] = useState(null)

  return (
    <GameShell>
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="font-mono text-xs text-cyber-muted tracking-widest mb-2">
            COLLECTIBLE AGENT ARCHITECTURES
          </p>
          <h1 className="font-display text-4xl font-bold text-cyber-amber glow-amber tracking-widest">
            BLUEPRINT VAULT
          </h1>
          <p className="font-body text-cyber-text/60 mt-2">
            {unlockedBlueprints.length} / {BLUEPRINTS.length} blueprints unlocked
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLUEPRINTS.map((bp, i) => {
            const unlocked = unlockedBlueprints.includes(bp.id)
            const rarity   = RARITY_COLORS[bp.rarity]

            return (
              <motion.div
                key={bp.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => unlocked && setSelected(bp)}
              >
                <GlowCard
                  color={unlocked ? bp.color : 'default'}
                  animate={false}
                  padding={false}
                  className={`overflow-hidden ${unlocked ? 'cursor-pointer' : 'opacity-40'}`}
                >
                  {/* Top accent bar */}
                  <div
                    className="h-1 w-full transition-all"
                    style={{ backgroundColor: unlocked ? rarity.color : '#0d1f3c' }}
                  />

                  <div className="p-5 space-y-4">
                    {/* Rarity + level */}
                    <div className="flex items-center justify-between">
                      <CyberBadge label={bp.rarity} color={unlocked ? bp.color : 'muted'} size="xs" />
                      <span className="font-mono text-xs text-cyber-muted">LVL {bp.level}</span>
                    </div>

                    {/* Icon */}
                    <div className="text-center py-3">
                      {unlocked ? (
                        <motion.span
                          className="text-5xl"
                          animate={{ rotateY: [0, 360] }}
                          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                        >
                          {bp.icon}
                        </motion.span>
                      ) : (
                        <span className="text-5xl grayscale opacity-30">🔒</span>
                      )}
                    </div>

                    {/* Name */}
                    <div className="text-center">
                      <h3 className={`font-display text-sm font-bold tracking-wide ${unlocked ? `text-cyber-${bp.color}` : 'text-cyber-muted'}`}>
                        {bp.name}
                      </h3>
                      {unlocked && (
                        <p className="font-body text-xs text-cyber-text/60 mt-1 leading-relaxed">
                          {bp.description.slice(0, 70)}...
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    {unlocked && (
                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-cyber-border">
                        {[
                          { label: 'TOOLS', value: bp.stats.tools },
                          { label: 'LOOP',  value: bp.stats.loop ? '✓' : '✗' },
                          { label: 'MEM',   value: bp.stats.memory ? '✓' : '✗' },
                          { label: 'AGENTS',value: bp.stats.agents },
                        ].map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <div className="font-mono text-xs text-cyber-cyan">{value}</div>
                            <div className="font-display text-[9px] text-cyber-muted tracking-widest">{label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {!unlocked && (
                      <p className="font-display text-xs text-cyber-muted tracking-widest text-center">
                        COMPLETE LEVEL {bp.level} TO UNLOCK
                      </p>
                    )}
                  </div>
                </GlowCard>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-cyber-surface border border-cyber-amber/40 clip-cyber p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <CyberBadge label={selected.rarity} color={selected.color} />
                  <h2 className="font-display text-2xl font-bold text-cyber-amber glow-amber mt-2">
                    {selected.icon} {selected.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-cyber-muted hover:text-cyber-pink font-display text-xs tracking-widest"
                >
                  [ CLOSE ]
                </button>
              </div>

              <p className="font-body text-cyber-text/80 text-sm leading-relaxed">
                {selected.description}
              </p>

              {/* Code snippet */}
              <div className="bg-cyber-bg border border-cyber-border clip-cyber-sm overflow-auto">
                <div className="flex items-center justify-between px-4 py-2 border-b border-cyber-border">
                  <span className="font-mono text-xs text-cyber-muted">blueprint.js</span>
                  <CyberBadge label="CODE" color="cyan" size="xs" />
                </div>
                <pre className="p-4 font-mono text-xs text-cyber-green leading-relaxed overflow-x-auto">
                  {selected.code}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  )
}
