import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MOOD_COLORS = {
  idle:      { primary: '#3a5070', glow: '#3a5070' },
  happy:     { primary: '#00f5ff', glow: '#00f5ff' },
  thinking:  { primary: '#bd00ff', glow: '#bd00ff' },
  excited:   { primary: '#ffaa00', glow: '#ffaa00' },
  warning:   { primary: '#ff0090', glow: '#ff0090' },
  celebrate: { primary: '#00ff88', glow: '#00ff88' },
}

function NovaSVG({ mood = 'happy' }) {
  const { primary, glow } = MOOD_COLORS[mood] || MOOD_COLORS.happy

  // Eye expressions per mood
  const eyeShape = {
    happy:     { cy: 38, rx: 7, ry: 6 },
    idle:      { cy: 40, rx: 7, ry: 4 },
    thinking:  { cy: 38, rx: 7, ry: 5 },
    excited:   { cy: 36, rx: 8, ry: 8 },
    warning:   { cy: 38, rx: 6, ry: 7 },
    celebrate: { cy: 35, rx: 8, ry: 9 },
  }[mood] || { cy: 38, rx: 7, ry: 6 }

  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <filter id="nova-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="body-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={primary} stopOpacity="0.08" />
        </linearGradient>
      </defs>

      {/* Body glow aura */}
      <ellipse cx="50" cy="70" rx="28" ry="32" fill={glow} opacity="0.06" filter="url(#nova-glow)" />

      {/* Torso */}
      <rect x="28" y="58" width="44" height="38" rx="8" fill="url(#body-grad)" stroke={primary} strokeWidth="1.5" />

      {/* Chest panel detail */}
      <rect x="35" y="66" width="30" height="18" rx="3" fill={primary} opacity="0.12" stroke={primary} strokeWidth="0.8" />
      <rect x="39" y="70" width="22" height="2" rx="1" fill={primary} opacity="0.6" />
      <rect x="39" y="75" width="15" height="2" rx="1" fill={primary} opacity="0.4" />
      <circle cx="54" cy="80" r="3" fill={primary} opacity="0.8" filter="url(#nova-glow)" />

      {/* Neck */}
      <rect x="42" y="52" width="16" height="8" rx="3" fill="#080e1a" stroke={primary} strokeWidth="1" />

      {/* Head */}
      <rect x="22" y="18" width="56" height="38" rx="12" fill="url(#body-grad)" stroke={primary} strokeWidth="1.5" />

      {/* Ear / antenna bolts */}
      <rect x="14" y="28" width="8" height="18" rx="4" fill="#080e1a" stroke={primary} strokeWidth="1" />
      <rect x="78" y="28" width="8" height="18" rx="4" fill="#080e1a" stroke={primary} strokeWidth="1" />

      {/* Antenna */}
      <line x1="50" y1="18" x2="50" y2="6" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="50" cy="5" r="3" fill={primary} filter="url(#nova-glow)" />

      {/* Eyes */}
      <motion.ellipse
        cx="38" cy={eyeShape.cy} rx={eyeShape.rx} ry={eyeShape.ry}
        fill={primary} opacity="0.9" filter="url(#nova-glow)"
        animate={{ ry: [eyeShape.ry, eyeShape.ry * 0.3, eyeShape.ry] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
      />
      <motion.ellipse
        cx="62" cy={eyeShape.cy} rx={eyeShape.rx} ry={eyeShape.ry}
        fill={primary} opacity="0.9" filter="url(#nova-glow)"
        animate={{ ry: [eyeShape.ry, eyeShape.ry * 0.3, eyeShape.ry] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, delay: 0.05 }}
      />

      {/* Mouth — changes per mood */}
      {mood === 'celebrate' || mood === 'excited' ? (
        <path d="M 38 50 Q 50 58 62 50" stroke={primary} strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : mood === 'warning' ? (
        <path d="M 38 54 Q 50 50 62 54" stroke={primary} strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M 40 52 Q 50 56 60 52" stroke={primary} strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* Arms */}
      <rect x="6" y="60" width="22" height="10" rx="5" fill="url(#body-grad)" stroke={primary} strokeWidth="1" />
      <rect x="72" y="60" width="22" height="10" rx="5" fill="url(#body-grad)" stroke={primary} strokeWidth="1" />

      {/* Legs */}
      <rect x="33" y="94" width="14" height="22" rx="6" fill="url(#body-grad)" stroke={primary} strokeWidth="1" />
      <rect x="53" y="94" width="14" height="22" rx="6" fill="url(#body-grad)" stroke={primary} strokeWidth="1" />
    </svg>
  )
}

export default function Mascot({ mood = 'happy', size = 'md', floating = true }) {
  const sizes = { sm: 'w-16 h-20', md: 'w-24 h-28', lg: 'w-32 h-40', xl: 'w-48 h-56' }

  return (
    <motion.div
      className={`${sizes[size]} relative`}
      animate={floating ? { y: [0, -6, 0] } : {}}
      transition={floating ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={mood}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full"
        >
          <NovaSVG mood={mood} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
