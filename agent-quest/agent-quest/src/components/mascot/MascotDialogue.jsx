import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Mascot from './Mascot'
import { useGameStore } from '@store/useGameStore'

export default function MascotDialogue({ position = 'bottom-right' }) {
  const { mascotMessage, mascotVisible, hideMascot } = useGameStore()
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (!mascotMessage) return
    setDisplayed('')
    setTyping(true)
    const text = mascotMessage.text
    let i = 0
    const t = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setTyping(false)
        clearInterval(t)
      }
    }, 22)
    return () => clearInterval(t)
  }, [mascotMessage])

  const posClass = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left':  'bottom-6 left-6',
    'top-right':    'top-20 right-6',
  }[position]

  return (
    <AnimatePresence>
      {mascotVisible && mascotMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`fixed ${posClass} z-50 flex items-end gap-3 max-w-sm`}
        >
          {/* Speech bubble */}
          <div className="relative bg-cyber-surface border border-cyber-cyan/40 clip-cyber p-4 flex-1 shadow-neon-cyan">
            {/* Triangle pointer */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-cyber-surface border-r border-b border-cyber-cyan/40 rotate-45" />

            <p className="font-body text-sm text-cyber-text leading-relaxed">
              {displayed}
              {typing && <span className="animate-pulse text-cyber-cyan ml-0.5">█</span>}
            </p>

            {/* Dismiss */}
            {!typing && (
              <button
                onClick={hideMascot}
                className="mt-2 font-display text-xs text-cyber-muted hover:text-cyber-cyan transition-colors tracking-widest"
              >
                [ CONTINUE ]
              </button>
            )}
          </div>

          {/* NOVA */}
          <Mascot mood={mascotMessage.mood} size="md" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
