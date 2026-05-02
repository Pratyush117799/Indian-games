import React from 'react'

const MESSAGES = {
  1: { icon: '⚔️', title: 'VICTORY',  sub: 'The board remembers\nyour strategy, Scholar.' },
  2: { icon: '🪨', title: 'DEFEAT',   sub: 'The stone plays cold.\nChallenge it again.' },
}

export default function GameOverOverlay({ winner, onReplay }) {
  const { icon, title, sub } = MESSAGES[winner] ?? MESSAGES[2]
  return (
    <div className="go-overlay">
      <div className="go-box">
        <span className="go-icon">{icon}</span>
        <div className="go-title">{title}</div>
        <div className="go-sub">{sub}</div>
        <button className="go-btn" onClick={onReplay}>PLAY AGAIN</button>
      </div>
    </div>
  )
}
