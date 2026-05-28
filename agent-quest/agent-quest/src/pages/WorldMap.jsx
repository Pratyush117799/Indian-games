import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import GameShell from '@components/layout/GameShell'
import GlowCard from '@components/ui/GlowCard'
import NeonButton from '@components/ui/NeonButton'
import CyberBadge from '@components/ui/CyberBadge'
import Mascot from '@components/mascot/Mascot'
import { LEVELS, LEVEL_COLORS } from '@data/levels'
import { usePlayerStore } from '@store/usePlayerStore'

export default function WorldMap() {
  const navigate = useNavigate()
  const { completedLevels, currentLevel, playerName, xp } = usePlayerStore()

  return (
    <GameShell>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-xs text-cyber-muted tracking-widest mb-2">
            MISSION BRIEFING · OPERATOR: {playerName}
          </p>
          <h1 className="font-display text-4xl font-bold text-cyber-cyan glow-cyan tracking-widest">
            AGENT ACADEMY
          </h1>
          <p className="font-body text-cyber-text/60 mt-2">
            Master 5 levels to become a full-stack AI Agent Engineer
          </p>
        </motion.div>

        {/* Connection lines SVG */}
        <div className="relative">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {LEVELS.slice(0, -1).map((_, i) => (
              <motion.line
                key={i}
                x1={`${(i + 0.5) * (100 / LEVELS.length)}%`}
                y1="50%"
                x2={`${(i + 1.5) * (100 / LEVELS.length)}%`}
                y2="50%"
                stroke={completedLevels.includes(i + 1) ? '#00f5ff' : '#0d1f3c'}
                strokeWidth="2"
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: i * 0.2 + 0.5, duration: 0.6 }}
              />
            ))}
          </svg>

          {/* Level cards */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4">
            {LEVELS.map((level, i) => {
              const isCompleted = completedLevels.includes(level.id)
              const isUnlocked  = level.id <= currentLevel
              const isActive    = level.id === currentLevel
              const colorKey    = level.color
              const colors      = LEVEL_COLORS[colorKey]

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  <GlowCard
                    color={isUnlocked ? colorKey : 'default'}
                    animate={false}
                    padding={false}
                    onClick={isUnlocked ? () => navigate(`/level/${level.id}`) : undefined}
                    className={`
                      relative overflow-hidden transition-all duration-300
                      ${!isUnlocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                      ${isActive ? 'animate-glow-pulse' : ''}
                    `}
                  >
                    {/* Top color bar */}
                    <div
                      className="h-1 w-full"
                      style={{ backgroundColor: isUnlocked ? colors.primary : '#0d1f3c' }}
                    />

                    <div className="p-4 space-y-3">
                      {/* Level number + status */}
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs text-cyber-muted tracking-widest">
                          LVL {level.id}
                        </span>
                        {isCompleted ? (
                          <CyberBadge label="✓ DONE" color={colorKey} size="xs" />
                        ) : isActive ? (
                          <CyberBadge label="ACTIVE" color={colorKey} size="xs" />
                        ) : !isUnlocked ? (
                          <span className="text-cyber-muted text-xs">🔒</span>
                        ) : null}
                      </div>

                      {/* Icon */}
                      <div className="text-3xl text-center py-1">
                        {isUnlocked ? level.icon : '🔒'}
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className={`font-display text-sm font-bold tracking-wide ${isUnlocked ? colors.text : 'text-cyber-muted'}`}>
                          {level.title}
                        </h3>
                        <p className="font-body text-xs text-cyber-muted mt-1 leading-relaxed">
                          {level.subtitle}
                        </p>
                      </div>

                      {/* XP reward */}
                      <div className="flex items-center justify-between pt-1 border-t border-cyber-border">
                        <span className="font-mono text-xs text-cyber-green">
                          +{level.xpReward} XP
                        </span>
                        {isUnlocked && (
                          <span className={`font-display text-xs ${colors.text} tracking-widest`}>
                            {isCompleted ? 'REPLAY →' : 'START →'}
                          </span>
                        )}
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Stats footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 flex flex-wrap justify-center gap-6 text-center"
        >
          {[
            { label: 'LEVELS COMPLETE', value: `${completedLevels.length} / 5` },
            { label: 'TOTAL XP',        value: xp },
            { label: 'BLUEPRINTS',      value: `${completedLevels.length} / 5` },
          ].map(({ label, value }) => (
            <div key={label} className="border border-cyber-border px-6 py-3 clip-cyber-sm">
              <div className="font-mono text-xl text-cyber-cyan">{value}</div>
              <div className="font-display text-xs text-cyber-muted tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* NOVA tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-8 flex items-center gap-4 bg-cyber-surface border border-cyber-purple/30 clip-cyber p-4"
        >
          <Mascot mood="happy" size="sm" floating={false} />
          <p className="font-body text-sm text-cyber-text/80 italic">
            "Start with Level 1 to understand LLM basics — phir slowly tools, loop, memory sab samajh aayega! 
            Each level builds on the last." — NOVA
          </p>
        </motion.div>
      </div>
    </GameShell>
  )
}
