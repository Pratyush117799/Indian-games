import React, { useEffect, useState } from 'react'
import { NODE } from '../../game-engine/navakankari/index.js'

/**
 * Overlays a brief golden flash when a mill is formed.
 * Positioned absolutely over the board SVG.
 */
export default function MillFlash({ millNodes }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!millNodes?.length) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 800)
    return () => clearTimeout(t)
  }, [millNodes])

  if (!visible || !millNodes?.length) return null

  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      viewBox="0 0 300 300">
      {millNodes.map(n => (
        <circle key={n} cx={NODE[n].x} cy={NODE[n].y} r="22"
          fill="rgba(255,200,50,.35)"
          style={{ animation: 'fadeIn .1s ease, fadeOut .7s ease .1s forwards' }}/>
      ))}
    </svg>
  )
}
