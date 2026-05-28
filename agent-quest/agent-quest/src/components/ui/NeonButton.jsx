import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

const VARIANTS = {
  cyan:   'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10 shadow-neon-cyan',
  purple: 'border-cyber-purple text-cyber-purple hover:bg-cyber-purple/10 shadow-neon-purple',
  pink:   'border-cyber-pink text-cyber-pink hover:bg-cyber-pink/10 shadow-neon-pink',
  green:  'border-cyber-green text-cyber-green hover:bg-cyber-green/10 shadow-neon-green',
  amber:  'border-cyber-amber text-cyber-amber hover:bg-cyber-amber/10 shadow-neon-amber',
  ghost:  'border-cyber-border text-cyber-text hover:bg-cyber-border/20',
}

const SIZES = {
  sm:  'px-3 py-1.5 text-xs',
  md:  'px-5 py-2.5 text-sm',
  lg:  'px-7 py-3 text-base',
  xl:  'px-10 py-4 text-lg',
}

export default function NeonButton({
  children,
  variant = 'cyan',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className,
  type = 'button',
  clipCorner = true,
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled   ? { scale: 0.97 } : {}}
      className={clsx(
        'relative font-display font-medium tracking-widest uppercase',
        'border transition-all duration-200 outline-none select-none',
        clipCorner && 'clip-cyber-sm',
        VARIANTS[variant],
        SIZES[size],
        (disabled || loading) && 'opacity-40 cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : children}
    </motion.button>
  )
}
