import React from 'react'

export default function SeedCounter({ score, total }) {
  const pct = total > 0 ? (score / total) * 100 : 50
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: 'var(--bg-raised)',
        borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border-dim)' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3,
          background: 'linear-gradient(90deg, #E8820A, #C4521A)', transition: 'width .4s ease' }}/>
      </div>
      <span style={{ fontSize: '.7rem', fontWeight: 700, color: '#E8820A', minWidth: 28 }}>{score}</span>
    </div>
  )
}
