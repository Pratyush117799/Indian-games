import React from 'react'
import { PLAYER_ROWS } from '../../game-engine/pallankuzhi/index.js'

const CUP_W = 56, CUP_H = 56, GAP = 8, PAD = 16

export default function PallankuzhiBoard({ state, onCupClick, legalMoves, animating }) {
  const { cups, turn } = state

  const renderRow = (rowCups, player, flip = false) => {
    const indices = flip ? [...rowCups].reverse() : rowCups
    return indices.map((cupIdx, col) => {
      const count    = cups[cupIdx]
      const isLegal  = legalMoves.includes(cupIdx) && turn === player && !animating
      const isPlayer = player === 1

      const x = PAD + col * (CUP_W + GAP)
      const y = player === 1 ? PAD + CUP_H + GAP + 8 : PAD + 8

      return (
        <g key={cupIdx} onClick={() => isLegal && onCupClick(cupIdx)}
          style={{ cursor: isLegal ? 'pointer' : 'default' }}>
          {/* Cup bowl */}
          <ellipse cx={x + CUP_W/2} cy={y + CUP_H * .75}
            rx={CUP_W/2 - 2} ry={CUP_H * .35}
            fill={isLegal ? '#2A1C0E' : '#1C1008'}
            stroke={isLegal ? '#8B4A0A' : '#3A1E08'}
            strokeWidth={isLegal ? 1.5 : 1}/>
          <ellipse cx={x + CUP_W/2} cy={y + CUP_H * .38}
            rx={CUP_W/2 - 2} ry={CUP_H * .38}
            fill={isLegal ? '#2A1C0E' : '#1C1008'}
            stroke={isLegal ? '#8B4A0A' : '#3A1E08'}
            strokeWidth={isLegal ? 1.5 : 1}/>
          {/* Inner shadow */}
          <ellipse cx={x + CUP_W/2} cy={y + CUP_H * .42}
            rx={CUP_W/2 - 6} ry={CUP_H * .32}
            fill="#120A04"/>

          {/* Seeds */}
          {count > 0 && renderSeeds(count, x, y, isPlayer)}

          {/* Count label */}
          <text x={x + CUP_W/2} y={y + CUP_H + 14}
            textAnchor="middle" fontSize="10"
            fontFamily="Cinzel, serif" fontWeight="700"
            fill={isLegal ? '#E8820A' : '#4A3018'}>
            {count}
          </text>
        </g>
      )
    })
  }

  const renderSeeds = (count, x, y, isHuman) => {
    const display = Math.min(count, 12)
    const seeds   = []
    const cols    = 4
    const seedR   = 3.5
    const fillH   = 'radial-gradient(circle, #F5C87A, #C4831A)'
    const fillA   = 'radial-gradient(circle, #90D4F8, #3898C0)'
    for (let i = 0; i < display; i++) {
      const row = Math.floor(i / cols), col = i % cols
      const sx  = x + 8 + col * 10 + (row % 2) * 4
      const sy  = y + CUP_H * .6 - row * 8
      seeds.push(
        <circle key={i} cx={sx} cy={sy} r={seedR}
          fill={isHuman ? '#C4831A' : '#3898C0'}
          stroke={isHuman ? '#F5C87A' : '#90D4F8'}
          strokeWidth=".5" opacity=".9"/>
      )
    }
    if (count > 12) seeds.push(
      <text key="more" x={x + CUP_W/2} y={y + CUP_H * .35}
        textAnchor="middle" fontSize="8" fill="#8B6A3A" fontFamily="Cinzel, serif">
        +{count - 12}
      </text>
    )
    return seeds
  }

  const totalW = 7 * CUP_W + 6 * GAP + 2 * PAD
  const totalH = 2 * CUP_H + GAP + 2 * PAD + 40

  return (
    <svg className="palla-board-svg" viewBox={`0 0 ${totalW} ${totalH}`}
      xmlns="http://www.w3.org/2000/svg">
      {/* Wood grain base */}
      <rect x="0" y="0" width={totalW} height={totalH} rx="12"
        fill="#1A0E06" stroke="#3A1E08" strokeWidth="1.5"/>

      {/* Row labels */}
      <text x={PAD} y={PAD + CUP_H * .4}
        fontSize="8" fontFamily="Cinzel, serif" fill="#5A3018" letterSpacing="2">AI</text>
      <text x={PAD} y={PAD + CUP_H + GAP + CUP_H * .4 + 8}
        fontSize="8" fontFamily="Cinzel, serif" fill="#5A3018" letterSpacing="2">YOU</text>

      {/* Dividing line */}
      <line x1={PAD} y1={PAD + CUP_H + GAP/2 + 8}
        x2={totalW - PAD} y2={PAD + CUP_H + GAP/2 + 8}
        stroke="#3A1E08" strokeWidth=".8" strokeDasharray="4 4"/>

      {/* AI row (top, index 7-13, displayed right-to-left) */}
      {renderRow(PLAYER_ROWS[2], 2, true)}

      {/* Human row (bottom, index 0-6) */}
      {renderRow(PLAYER_ROWS[1], 1, false)}
    </svg>
  )
}
