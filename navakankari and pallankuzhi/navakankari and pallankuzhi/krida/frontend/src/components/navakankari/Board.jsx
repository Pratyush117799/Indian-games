import React, { useMemo } from 'react'
import { NODE, EDGES, MILLS } from '../../game-engine/navakankari/index.js'
import { millNodeSet, removableNodes, isFlying } from '../../game-engine/navakankari/index.js'

const R_NODE  = 10
const R_PIECE = 13

export default function Board({ state, selected, legalDests, onNodeClick }) {
  const { board, toPlace, removing, turn } = state

  // All active mills (any player)
  const activeMills = useMemo(() =>
    MILLS.filter(m => m.every(n => board[n] === board[m[0]] && board[m[0]] !== 0)),
    [board])

  // Nodes removable by human during remove phase
  const removable = useMemo(() =>
    (removing && turn === 1) ? removableNodes(board, 2) : [],
    [board, removing, turn])

  return (
    <svg className="nava-board-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      {/* Board plate */}
      <rect x="4" y="4" width="292" height="292" rx="10" fill="#0D0F16" stroke="#201808" strokeWidth=".5"/>

      {/* Corner decoration rings */}
      {[[14,14],[286,14],[14,286],[286,286]].map(([cx,cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="22" fill="none" stroke="#1A1508" strokeWidth=".5"/>
          <circle cx={cx} cy={cy} r="30" fill="none" stroke="#141208" strokeWidth=".3"/>
        </g>
      ))}

      {/* Mill glow lines */}
      {activeMills.map((m, i) => {
        const a = NODE[m[0]], b = NODE[m[2]]
        const col = board[m[0]] === 1
          ? 'rgba(196,131,26,.45)' : 'rgba(56,152,192,.35)'
        return (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={col} strokeWidth="18" strokeLinecap="round"
            style={{ animation: `millGlow 2s ease-in-out infinite`, animationDelay: `${i * .2}s` }}/>
        )
      })}

      {/* Board edges */}
      {EDGES.map(([a, b], i) => (
        <line key={i}
          x1={NODE[a].x} y1={NODE[a].y} x2={NODE[b].x} y2={NODE[b].y}
          stroke="#2A2010" strokeWidth="1.2" strokeLinecap="round"/>
      ))}

      {/* Legal destination halos */}
      {legalDests.map(n => (
        <circle key={n} cx={NODE[n].x} cy={NODE[n].y} r={R_NODE + 7}
          fill="rgba(80,180,80,.22)"
          style={{ animation: 'blink 1s ease-in-out infinite' }}/>
      ))}

      {/* Removable halos */}
      {removable.map(n => (
        <circle key={n} cx={NODE[n].x} cy={NODE[n].y} r={R_NODE + 7}
          fill="rgba(200,50,30,.28)"
          style={{ animation: 'blink .8s ease-in-out infinite' }}/>
      ))}

      {/* Nodes & pieces */}
      {NODE.map(({ x, y }, i) => {
        const v      = board[i]
        const isSel  = selected === i
        const isRem  = removable.includes(i)

        return (
          <g key={i} style={{ cursor: 'pointer' }} onClick={() => onNodeClick(i)}>
            {/* Selected glow */}
            {isSel && (
              <circle cx={x} cy={y} r={R_PIECE + 6}
                fill="rgba(196,131,26,.18)"
                style={{ animation: 'pulseGold 1.2s ease-in-out infinite' }}/>
            )}

            {/* Empty node */}
            {v === 0 && (
              <circle cx={x} cy={y} r={R_NODE}
                fill="#0E1018"
                stroke={legalDests.includes(i) ? '#30A050' : '#252830'}
                strokeWidth={legalDests.includes(i) ? 1.5 : .8}/>
            )}

            {/* Human piece */}
            {v === 1 && (
              <>
                <circle cx={x} cy={y} r={R_PIECE + 1} fill="rgba(196,131,26,.18)"/>
                <circle cx={x} cy={y} r={R_PIECE}
                  fill="url(#gradHuman)"
                  stroke={isSel ? '#F0C060' : '#7A5210'}
                  strokeWidth={isSel ? 2 : 1.2}/>
                <circle cx={x-3} cy={y-3} r={4} fill="rgba(255,220,120,.22)"/>
              </>
            )}

            {/* AI piece */}
            {v === 2 && (
              <>
                <circle cx={x} cy={y} r={R_PIECE + 1} fill="rgba(56,152,192,.18)"/>
                <circle cx={x} cy={y} r={R_PIECE}
                  fill="url(#gradAI)"
                  stroke="#205878" strokeWidth="1.2"/>
                <circle cx={x-3} cy={y-3} r={4} fill="rgba(150,230,255,.18)"/>
              </>
            )}

            {/* Remove X */}
            {isRem && (
              <g style={{ animation: 'blink .8s ease-in-out infinite' }}>
                <line x1={x-5} y1={y-5} x2={x+5} y2={y+5} stroke="#C03828" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1={x+5} y1={y-5} x2={x-5} y2={y+5} stroke="#C03828" strokeWidth="1.8" strokeLinecap="round"/>
              </g>
            )}
          </g>
        )
      })}

      {/* AI thinking ring */}
      {turn === 2 && !state.winner && (
        <circle cx="150" cy="150" r="140" fill="none"
          stroke="rgba(56,152,192,.07)" strokeWidth="2" strokeDasharray="12 8"
          style={{ animation: 'spinDash 3s linear infinite', transformOrigin: '150px 150px' }}/>
      )}

      {/* Gradient defs */}
      <defs>
        <radialGradient id="gradHuman" cx="35%" cy="28%">
          <stop offset="0%"   stopColor="#F8D060"/>
          <stop offset="50%"  stopColor="#C4831A"/>
          <stop offset="100%" stopColor="#6A4008"/>
        </radialGradient>
        <radialGradient id="gradAI" cx="35%" cy="28%">
          <stop offset="0%"   stopColor="#A0E0FF"/>
          <stop offset="50%"  stopColor="#3898C0"/>
          <stop offset="100%" stopColor="#184868"/>
        </radialGradient>
      </defs>
    </svg>
  )
}
