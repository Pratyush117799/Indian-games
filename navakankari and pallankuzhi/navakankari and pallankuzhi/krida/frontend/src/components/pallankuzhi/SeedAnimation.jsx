/**
 * SeedAnimation.jsx
 * Canvas overlay that animates seeds flying in parabolic arcs
 * from source cup to each destination cup, one seed at a time.
 *
 * Props:
 *   animation  { from, path, captures, player }
 *   svgRef     ref to the board SVG element (for coordinate mapping)
 *   onDone     callback when animation completes
 */
import React, { useEffect, useRef } from 'react'
import { cupCenter } from './boardGeometry.js'

const SEED_COLORS = {
  1: { fill: '#E8A030', hi: '#F8C870' },
  2: { fill: '#5090C8', hi: '#90C8F0' },
}

export default function SeedAnimation({ animation, svgRef, onDone }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)

  // Sync canvas size to SVG
  useEffect(() => {
    const sync = () => {
      const cv  = canvasRef.current
      const svg = svgRef?.current
      if (!cv || !svg) return
      const r    = svg.getBoundingClientRect()
      cv.width  = r.width
      cv.height = r.height
      cv.style.width  = r.width  + 'px'
      cv.style.height = r.height + 'px'
    }
    sync()
    const ro = new ResizeObserver(sync)
    if (svgRef?.current) ro.observe(svgRef.current)
    return () => ro.disconnect()
  }, [svgRef])

  useEffect(() => {
    if (!animation?.path?.length) return
    const canvas = canvasRef.current
    const svg    = svgRef?.current
    if (!canvas || !svg) { onDone?.(); return }

    const { from, path, player = 1 } = animation
    const color = SEED_COLORS[player] ?? SEED_COLORS[1]

    // Map SVG coords → canvas coords
    const toC = (svgX, svgY) => {
      const vb    = svg.viewBox.baseVal
      const rect  = canvas.getBoundingClientRect()
      const sX    = rect.width  / vb.width
      const sY    = rect.height / vb.height
      return { x: svgX * sX, y: svgY * sY }
    }

    const src  = cupCenter(from)
    const arcH = canvas.height * 0.28

    // Build seed list
    const seeds = path.map((cup, i) => {
      const dst = cupCenter(cup)
      return {
        sx: src.cx + (Math.random() - .5) * 14,
        sy: src.cy + (Math.random() - .5) * 10,
        dx: dst.cx,
        dy: dst.cy,
        arc: arcH * (.6 + Math.random() * .8),
        size: 4.2 + Math.random() * .8,
        delay: i * 50,
        dur: 250 + Math.random() * 70,
        done: false,
      }
    })

    const total    = seeds.length
    let   startTs  = null

    const tick = (now) => {
      if (!startTs) startTs = now
      const elapsed = now - startTs

      const ct = canvas.getContext('2d')
      ct.clearRect(0, 0, canvas.width, canvas.height)

      let allSettled = true

      for (const s of seeds) {
        const lt = elapsed - s.delay
        if (lt < 0)     { allSettled = false; continue }
        if (s.done)       continue

        const prog = Math.min(lt / s.dur, 1)
        if (prog < 1)    allSettled = false
        if (prog >= 1) { s.done = true; continue }

        const p1 = toC(s.sx, s.sy)
        const p2 = toC(s.dx, s.dy)
        const cpX = (p1.x + p2.x) / 2
        const cpY = Math.min(p1.y, p2.y) - s.arc
        const t   = prog
        const px  = (1-t)*(1-t)*p1.x + 2*(1-t)*t*cpX + t*t*p2.x
        const py  = (1-t)*(1-t)*p1.y + 2*(1-t)*t*cpY + t*t*p2.y
        const r   = s.size * (1 - .15 * Math.sin(Math.PI * prog))

        ct.beginPath()
        ct.arc(px, py, r, 0, Math.PI * 2)
        ct.fillStyle    = color.fill
        ct.shadowColor  = color.fill
        ct.shadowBlur   = 7
        ct.fill()
        ct.shadowBlur   = 0

        // Highlight dot
        ct.beginPath()
        ct.arc(px - r * .3, py - r * .3, r * .3, 0, Math.PI * 2)
        ct.fillStyle = color.hi
        ct.globalAlpha = .6
        ct.fill()
        ct.globalAlpha = 1
      }

      const maxEnd = (total - 1) * 50 + 330
      if (allSettled || elapsed > maxEnd + 100) {
        ct.clearRect(0, 0, canvas.width, canvas.height)
        onDone?.()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      canvasRef.current?.getContext('2d')?.clearRect(
        0, 0, canvasRef.current.width, canvasRef.current.height
      )
    }
  }, [animation])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none',
    }}/>
  )
}
