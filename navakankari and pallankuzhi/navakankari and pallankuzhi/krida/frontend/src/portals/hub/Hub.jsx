import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatTag } from '../../services/tagGenerator.js'
import '../../styles/hub.css'

const RANK_ORDER = ['Pebble','Stone','Warrior','Scholar','Sage','Grandmaster']

export default function Hub() {
  const player = useSelector(s => s.player.data)

  return (
    <div className="hub-portal fade-in">
      {/* Player tag */}
      {player && (
        <div className="player-tag-bar">
          <span className="tag-label">PLAYER</span>
          <span className="tag-value">{formatTag(player.tagId)}</span>
          <span className="tag-rank">{player.rank ?? 'Pebble'}</span>
          <span className="tag-label" style={{ marginLeft: '.5rem' }}>
            {player.xp ?? 0} XP
          </span>
        </div>
      )}

      {/* Hero */}
      <div className="hub-hero">
        <div className="hub-kicker">KRIDA · क्रीडा · ANCIENT INDIAN GAMES</div>
        <div className="hub-title">PLAY HISTORY</div>
        <div className="hub-tagline">
          Two games. Thousands of years. One board at a time.
        </div>
      </div>

      {/* Game cards */}
      <div className="hub-games">
        <Link to="/navakankari" className="game-card nava">
          <span className="gc-icon">⚔️</span>
          <div className="gc-title nava">NAVAKANKARI</div>
          <div className="gc-deva">नव कंकड़ी · Rajasthan / UP · Ancient</div>
          <div className="gc-desc">
            Three concentric squares. Nine pieces per player. Form a mill of three
            to capture. The deepest strategy game of ancient India — rivals early chess openings.
          </div>
          <div className="gc-tags">
            <span className="gc-tag">STRATEGY</span>
            <span className="gc-tag">2 PLAYER</span>
            <span className="gc-tag">3 PHASES</span>
            <span className="gc-tag">AI OPPONENT</span>
          </div>
          <span className="gc-cta nava">PLAY NOW →</span>
        </Link>

        <Link to="/pallankuzhi" className="game-card palla">
          <span className="gc-icon">🪔</span>
          <div className="gc-title palla">PALLANKUZHI</div>
          <div className="gc-deva">பல்லாங்குழி · Tamil Nadu · Ancient</div>
          <div className="gc-desc">
            Two rows of seven cups. Sow seeds clockwise. Land on four to capture.
            India's only living mancala tradition — played at harvest festivals for millennia.
          </div>
          <div className="gc-tags">
            <span className="gc-tag">MANCALA</span>
            <span className="gc-tag">2 PLAYER</span>
            <span className="gc-tag">COUNTING</span>
            <span className="gc-tag">AI OPPONENT</span>
          </div>
          <span className="gc-cta palla">PLAY NOW →</span>
        </Link>
      </div>

      {/* Footer lore */}
      <div style={{ textAlign: 'center', fontSize: '.6rem', color: 'var(--txt-muted)',
        letterSpacing: '.1em', lineHeight: 2.5, marginTop: '1rem',
        borderTop: '1px solid var(--border-dim)', paddingTop: '1.5rem' }}>
        NAVAKANKARI boards carved at Angkor Wat &nbsp;·&nbsp;
        PALLANKUZHI mentioned in 6th-century Tamil epics &nbsp;·&nbsp;
        Both games pre-date chess
      </div>
    </div>
  )
}
