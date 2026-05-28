import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const GLOW = {
  cyan:   'border-cyber-cyan/40 hover:border-cyber-cyan hover:shadow-neon-cyan',
  purple: 'border-cyber-purple/40 hover:border-cyber-purple hover:shadow-neon-purple',
  pink:   'border-cyber-pink/40 hover:border-cyber-pink hover:shadow-neon-pink',
  green:  'border-cyber-green/40 hover:border-cyber-green hover:shadow-neon-green',
  amber:  'border-cyber-amber/40 hover:border-cyber-amber hover:shadow-neon-amber',
  default:'border-cyber-border hover:border-cyber-muted',
}

export default function GlowCard({
  children,
  color = 'default',
  className,
  animate = true,
  clipCorner = true,
  onClick,
  padding = true,
}) {
  const Wrapper = animate ? motion.div : 'div'
  const motionProps = animate ? {
    initial:  { opacity: 0, y: 16 },
    animate:  { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' },
  } : {}

  return (
    <Wrapper
      {...motionProps}
      onClick={onClick}
      className={clsx(
        'bg-cyber-surface border transition-all duration-300',
        clipCorner && 'clip-cyber',
        padding && 'p-6',
        onClick && 'cursor-pointer',
        GLOW[color],
        className
      )}
    >
      {children}
    </Wrapper>
  )
}
