import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import NeonButton from '@components/ui/NeonButton'
import CyberBadge from '@components/ui/CyberBadge'
import Mascot from '@components/mascot/Mascot'
import { usePlayerStore } from '@store/usePlayerStore'
import { useXP } from '@hooks/useXP'
import { BLUEPRINTS } from '@data/blueprints'

export default function LevelComplete({ level }) {
  const navigate = useNavigate()
  const { completeLevel, unlockBlueprint } = usePlayerStore()
  const { awardXP } = useXP()

  const blueprint = BLUEPRINTS.find(b => b.id === level.blueprintId)

  useEffect(() => {
    completeLevel(level.id)
    unlockBlueprint(level.blueprintId)
    awardXP(level.xpReward, `Level ${level.id} complete!`)
  }, [])

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: ['#00f5ff', '#bd00ff', '#00ff88', '#ffaa00'][i % 4],
  }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cyber-bg"
    >
      {/* Particle burst */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: '50%', backgroundColor: p.color }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{ y: [-20, -200], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 2, delay: p.delay, ease: 'easeOut' }}
        />
      ))}

      <div className="relative z-10 text-center space-y-8 px-4 max-w-lg">
        {/* Mascot */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="flex justify-center"
        >
          <Mascot mood="celebrate" size="xl" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="font-display text-xs text-cyber-muted tracking-widest mb-2">
            MISSION COMPLETE
          </div>
          <h1 className="font-display text-4xl font-black text-cyber-green glow-green tracking-widest">
            LEVEL {level.id} CLEARED
          </h1>
          <p className="font-body text-cyber-text/70 mt-2">
            {level.title}
          </p>
        </motion.div>

        {/* Blueprint unlock card */}
        {blueprint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="border border-cyber-amber/50 bg-cyber-amber/10 clip-cyber p-5 space-y-2"
          >
            <div className="font-display text-xs text-cyber-amber tracking-widest">
              ⚡ BLUEPRINT UNLOCKED
            </div>
            <div className="text-4xl">{blueprint.icon}</div>
            <div className="font-display text-lg text-cyber-amber glow-amber">
              {blueprint.name}
            </div>
            <CyberBadge label={blueprint.rarity} color="amber" />
          </motion.div>
        )}

        {/* XP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="font-display text-2xl text-cyber-green tracking-widest"
        >
          +{level.xpReward} XP
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <NeonButton variant="green" size="lg" onClick={() => navigate('/map')}>
            BACK TO MAP
          </NeonButton>
          {level.id < 5 && (
            <NeonButton variant="cyan" size="lg" onClick={() => navigate(`/level/${level.id + 1}`)}>
              NEXT LEVEL →
            </NeonButton>
          )}
          <NeonButton variant="amber" size="md" onClick={() => navigate('/vault')}>
            VIEW VAULT
          </NeonButton>
        </motion.div>
      </div>
    </motion.div>
  )
}
