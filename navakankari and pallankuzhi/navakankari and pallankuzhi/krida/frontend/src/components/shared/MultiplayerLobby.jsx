/**
 * MultiplayerLobby.jsx
 * Shown when the player picks "Play Online" mode.
 * Handles: ranked matchmaking, private room create/join.
 */
import React, { useState, useRef } from 'react'
import { SOCKET_STATUS } from '../../hooks/useGameSocket.js'

const LOBBY_CSS = `
.lobby { display:flex; flex-direction:column; align-items:center; gap:1.1rem;
  padding:1.5rem 1rem; max-width:380px; width:100%; }
.lobby-title { font-size:.72rem; font-weight:700; letter-spacing:.18em;
  color:var(--txt-muted); text-align:center; }
.lobby-card { width:100%; background:var(--bg-surface);
  border:1px solid var(--border-dim); border-radius:var(--r-lg); padding:1.1rem; }
.lobby-card-head { font-size:.65rem; font-weight:700; letter-spacing:.12em;
  color:var(--gold); margin-bottom:.5rem; }
.lobby-card-sub { font-family:var(--font-body); font-size:.78rem;
  color:var(--txt-secondary); line-height:1.6; margin-bottom:.9rem; }
.lobby-btn { font-family:var(--font-display); font-size:.62rem; font-weight:700;
  letter-spacing:.1em; padding:.45rem 1.1rem; border-radius:var(--r-sm);
  border:1px solid var(--border-mid); background:var(--bg-raised);
  color:var(--txt-secondary); cursor:pointer; transition:all .15s; width:100%; }
.lobby-btn:hover { background:#160D02; color:var(--gold); border-color:var(--gold-dim); }
.lobby-btn:active { transform:scale(.97); }
.lobby-btn.primary { background:linear-gradient(135deg,#C4831A,#8A5208);
  color:#040206; border-color:transparent; }
.lobby-btn.primary:hover { opacity:.88; }
.lobby-sep { width:100%; height:1px;
  background:linear-gradient(90deg,transparent,var(--border-dim),transparent); }
.lobby-input { font-family:var(--font-display); font-size:.65rem; letter-spacing:.08em;
  padding:.42rem .75rem; border-radius:var(--r-sm); border:1px solid var(--border-mid);
  background:var(--bg-raised); color:var(--txt-primary); width:100%;
  text-transform:uppercase; }
.lobby-input:focus { outline:none; border-color:var(--gold-dim); }
.lobby-input::placeholder { color:var(--txt-muted); text-transform:none; }
.lobby-row { display:flex; gap:.4rem; width:100%; }
.status-pill { font-size:.6rem; font-weight:700; letter-spacing:.1em;
  padding:3px 10px; border-radius:100px; animation:blink 1s ease-in-out infinite; }
.status-pill.queued { background:#150F02; color:var(--gold); border:1px solid #4A3008; }
.status-pill.matched { background:#0A2018; color:#40C070; border:1px solid #204A30; }
.status-pill.error { background:#1A0808; color:#C04040; border:1px solid #4A2020; }
.room-code { font-family:var(--font-display); font-size:1.4rem; font-weight:900;
  letter-spacing:.3em; color:var(--gold);
  text-shadow:0 0 20px var(--gold-glow); text-align:center; margin:.4rem 0; }
.room-code-hint { font-size:.58rem; color:var(--txt-muted); text-align:center;
  letter-spacing:.06em; }
`

export default function MultiplayerLobby({
  gameType, status, roomId, queuePos, opponentTag,
  onRanked, onCancelQueue,
  onCreateRoom, onJoinRoom,
  onBack,
}) {
  const [code, setCode] = useState('')
  const inputRef = useRef()

  const isQueued  = status === SOCKET_STATUS.QUEUED
  const isMatched = status === SOCKET_STATUS.MATCHED || status === SOCKET_STATUS.IN_GAME
  const isError   = status === SOCKET_STATUS.ERROR

  const handleJoin = () => {
    const c = code.trim().toUpperCase()
    if (c.length < 4) return
    onJoinRoom(c)
  }

  const copyCode = () => {
    if (roomId) navigator.clipboard?.writeText(roomId).catch(() => {})
  }

  return (
    <>
      <style>{LOBBY_CSS}</style>
      <div className="lobby fade-in">
        <div className="lobby-title">ONLINE — {gameType.toUpperCase()}</div>

        {/* Status pill */}
        {isQueued && !roomId && (
          <div className="status-pill queued">SEARCHING FOR OPPONENT…</div>
        )}
        {isMatched && (
          <div className="status-pill matched">OPPONENT FOUND · {opponentTag}</div>
        )}
        {isError && (
          <div className="status-pill error">CONNECTION ERROR</div>
        )}

        {/* Ranked matchmaking */}
        <div className="lobby-card">
          <div className="lobby-card-head">⚔ RANKED MATCH</div>
          <div className="lobby-card-sub">
            Join the global queue. Auto-matched with a player of similar rank.
            XP awarded on win.
          </div>
          {!isQueued ? (
            <button className="lobby-btn primary" onClick={onRanked}>
              FIND OPPONENT
            </button>
          ) : !roomId ? (
            <button className="lobby-btn" onClick={onCancelQueue}>
              CANCEL SEARCH
            </button>
          ) : null}
        </div>

        <div className="lobby-sep"/>

        {/* Private room */}
        <div className="lobby-card">
          <div className="lobby-card-head">🏠 PRIVATE ROOM</div>
          <div className="lobby-card-sub">
            Create a room and share the code with a friend.
          </div>

          {/* Show room code if created */}
          {roomId && (
            <>
              <div className="room-code" onClick={copyCode} style={{ cursor: 'pointer' }}>
                {roomId}
              </div>
              <div className="room-code-hint">
                Share this code · Click to copy · Waiting for opponent…
              </div>
            </>
          )}

          {!roomId && (
            <button className="lobby-btn" onClick={onCreateRoom}
              style={{ marginBottom: '.5rem' }}>
              CREATE ROOM
            </button>
          )}

          <div className="lobby-sep" style={{ margin: '.6rem 0' }}/>

          <div className="lobby-row">
            <input
              ref={inputRef}
              className="lobby-input"
              placeholder="Enter room code…"
              maxLength={8}
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
            />
            <button className="lobby-btn" style={{ width: 'auto', flexShrink: 0 }}
              onClick={handleJoin}>
              JOIN
            </button>
          </div>
        </div>

        <button className="lobby-btn" onClick={onBack}>← BACK TO MENU</button>
      </div>
    </>
  )
}
