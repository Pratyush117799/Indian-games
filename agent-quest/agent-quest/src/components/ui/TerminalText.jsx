import React, { useState, useEffect } from 'react'
import { clsx } from 'clsx'

export default function TerminalText({
  text,
  speed = 30,
  className,
  onComplete,
  showCursor = true,
  color = 'green',
  prefix = '> ',
}) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  const colorClass = {
    green:  'text-cyber-green',
    cyan:   'text-cyber-cyan',
    purple: 'text-cyber-purple',
    amber:  'text-cyber-amber',
    text:   'text-cyber-text',
  }[color] || 'text-cyber-green'

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        setDone(true)
        clearInterval(interval)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className={clsx('font-mono', colorClass, className)}>
      {prefix && <span className="text-cyber-muted">{prefix}</span>}
      {displayed}
      {showCursor && !done && (
        <span className="animate-pulse text-cyber-cyan">█</span>
      )}
    </span>
  )
}
