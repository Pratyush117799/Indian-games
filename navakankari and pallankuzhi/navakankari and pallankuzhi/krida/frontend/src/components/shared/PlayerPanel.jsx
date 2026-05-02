import React from 'react'
import { countOnBoard, isFlying } from '../../game-engine/navakankari/index.js'

export default function PlayerPanel({ player, state, active }) {
  const isHuman   = player === 1
  const onBoard   = countOnBoard(state.board, player)
  const reserve   = state.toPlace[player]
  const total     = onBoard + reserve
  const flying    = isFlying(state.board, state.toPlace, player)
  const cls       = active ? (isHuman ? 'active-h' : 'active-a') : ''

  return (
    <div className={`nava-pp ${isHuman ? 'area-hp' : 'area-ap'} ${cls}`}>
      <div className="pname" style={{ fontSize: '.6rem', fontWeight: 700, letterSpacing: '.14em',
        marginBottom: '.5rem', display: 'flex', alignItems: 'center', gap: 5,
        color: isHuman ? 'var(--gold)' : 'var(--blue-piece)' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
          background: isHuman ? 'var(--gold)' : 'var(--blue-piece)',
          boxShadow: `0 0 6px ${isHuman ? 'rgba(196,131,26,.6)' : 'rgba(56,152,192,.6)'}` }}/>
        {isHuman ? 'YOU' : 'AI'}
        {flying && <span style={{ fontSize: '.48rem', color: 'var(--purple-fly)',
          letterSpacing: '.08em', marginLeft: 'auto' }}>FLYING</span>}
      </div>

      {/* Piece pips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: '.5rem', minHeight: 36 }}>
        {Array.from({ length: 9 }, (_, k) => {
          const alive  = k < onBoard
          const placed = k < total
          const col    = isHuman
            ? 'radial-gradient(circle at 35% 30%, #F8D060, #C4831A 50%, #6A4008)'
            : 'radial-gradient(circle at 35% 30%, #A0E0FF, #3898C0 50%, #184868)'

          return (
            <div key={k} style={{
              width: 12, height: 12, borderRadius: '50%',
              background: placed ? col : '#101418',
              border: placed ? 'none' : '1px solid #1E2230',
              opacity: alive ? 1 : placed ? .35 : 1,
              filter: alive ? 'none' : placed ? 'saturate(.2)' : 'none',
              transform: alive ? 'scale(1)' : placed ? 'scale(.95)' : 'scale(.7)',
              transition: 'all .25s',
            }}/>
          )
        })}
      </div>

      <div style={{ fontSize: '.59rem', color: 'var(--txt-muted)', letterSpacing: '.05em', lineHeight: 2 }}>
        <div>Board   <span style={{ color: 'var(--txt-secondary)' }}>{onBoard}</span></div>
        <div>Reserve <span style={{ color: 'var(--txt-secondary)' }}>{reserve}</span></div>
        <div>Total   <span style={{ color: 'var(--txt-secondary)' }}>{total}</span></div>
      </div>
    </div>
  )
}
