import React from 'react'
import { clsx } from 'clsx'

const COLORS = {
  cyan:    'text-cyber-cyan   border-cyber-cyan/40   bg-cyber-cyan/10',
  purple:  'text-cyber-purple border-cyber-purple/40 bg-cyber-purple/10',
  pink:    'text-cyber-pink   border-cyber-pink/40   bg-cyber-pink/10',
  green:   'text-cyber-green  border-cyber-green/40  bg-cyber-green/10',
  amber:   'text-cyber-amber  border-cyber-amber/40  bg-cyber-amber/10',
  muted:   'text-cyber-muted  border-cyber-border    bg-cyber-border/30',
}

export default function CyberBadge({ label, color = 'cyan', size = 'sm', className }) {
  const sizeClass = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span className={clsx(
      'font-display font-medium tracking-widest uppercase border',
      'clip-cyber-sm inline-block',
      sizeClass,
      COLORS[color],
      className,
    )}>
      {label}
    </span>
  )
}
