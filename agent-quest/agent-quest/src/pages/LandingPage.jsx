import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import NeonButton from '@components/ui/NeonButton'
import Mascot from '@components/mascot/Mascot'
import { usePlayerStore } from '@store/usePlayerStore'

const GLITCH_CHARS = '!@#$%^&*<>?/\\|[]{}ABCDEFGHIJKLMNOP'
function glitch(text) {
  return text.split('').map((c, i) =>
    Math.random() > 0.85 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c
  ).join('')
}

export default function LandingPage() {
  const navigate  = useNavigate()
  const { apiKey } = usePlayerStore()
  const [titleText, setTitleText] = useState('AGENTQUEST')
  const [particles, setParticles] = useState([])

  // Glitch effect on title
  useEffect(() => {
    let count = 0
    const id = setInterval(() => {
      count++
      if (count % 8 < 3) {
        setTitleText(glitch('AGENTQUEST'))
      } else {
        setTitleText('AGENTQUEST')
      }
    }, 120)
    return () => clearInterval(id)
  }, [])

  // Floating particles
  useEffect(() => {
    setParticles(Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 3,
      color: ['#00f5ff', '#bd00ff', '#ff0090', '#00ff88'][Math.floor(Math.random() * 4)]
    })))
  }, [])

  const handleStart = () => {
    navigate(apiKey ? '/map' : '/onboarding')
  }

  return (
    <div className="relative min-h-screen bg-cyber-bg overflow-hidden flex flex-col items-center justify-center bg-cyber-grid bg-grid-40">

      {/* Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Horizon glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64
        bg-gradient-to-t from-cyber-cyan/10 via-cyber-purple/5 to-transparent pointer-events-none" />

      {/* Grid horizon lines */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,245,255,0.15) 1px, transparent 1px)',
          backgroundSize: '100% 24px',
          transform: 'perspective(300px) rotateX(60deg)',
          transformOrigin: 'bottom',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 gap-8">

        {/* NOVA mascot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <Mascot mood="excited" size="xl" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h1
            className="font-display font-black text-6xl md:text-8xl tracking-widest glow-cyan"
            style={{ color: '#00f5ff' }}
          >
            {titleText.slice(0, 5)}
            <span style={{ color: '#bd00ff', textShadow: '0 0 8px #bd00ff, 0 0 20px #bd00ff66' }}>
              {titleText.slice(5)}
            </span>
          </h1>
          <p className="font-body text-cyber-muted text-lg md:text-xl mt-3 tracking-widest">
            LEARN TO BUILD AI AGENTS — INTERACTIVELY
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="font-body text-cyber-text/70 text-base max-w-lg leading-relaxed"
        >
          A hands-on cyberpunk game where you build real AI agents from scratch.
          Five levels. Real API calls. No fluff — just pure agent architecture.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {['⚡ Live DeepSeek API', '🔧 Tool Calling', '🔄 Agent Loops', '🧠 Memory', '🕸️ Multi-Agent'].map((f, i) => (
            <span key={i} className="font-mono text-xs text-cyber-cyan border border-cyber-cyan/30
              bg-cyber-cyan/5 px-3 py-1.5 clip-cyber-sm">
              {f}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, type: 'spring' }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <NeonButton variant="cyan" size="xl" onClick={handleStart}>
            INITIALIZE AGENT
          </NeonButton>
          {apiKey && (
            <NeonButton variant="purple" size="lg" onClick={() => navigate('/vault')}>
              BLUEPRINT VAULT
            </NeonButton>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.6 }}
          className="font-mono text-xs text-cyber-muted"
        >
          Powered by DeepSeek API · Built with React + Framer Motion
        </motion.p>
      </div>
    </div>
  )
}
