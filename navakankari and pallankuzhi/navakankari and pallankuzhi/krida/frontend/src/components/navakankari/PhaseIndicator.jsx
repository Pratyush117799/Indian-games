import React from 'react'
import { isFlying } from '../../game-engine/navakankari/index.js'

export default function PhaseIndicator({ state }) {
  const fly1 = isFlying(state.board, state.toPlace, 1)
  const fly2 = isFlying(state.board, state.toPlace, 2)
  const anyFly = fly1 || fly2

  return (
    <div className="phase-strip">
      <div className={`phase-chip ${state.phase === 1 ? 'on' : ''}`}>PLACE</div>
      <span style={{ color: '#282E38', fontSize: '.5rem' }}>›</span>
      <div className={`phase-chip ${state.phase === 2 && !anyFly ? 'on' : ''}`}>MOVE</div>
      <span style={{ color: '#282E38', fontSize: '.5rem' }}>›</span>
      <div className={`phase-chip ${anyFly ? 'fly' : ''}`}>FLY</div>
    </div>
  )
}
