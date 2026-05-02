/**
 * OnlineHUD.jsx
 * Header strip shown during an active online game.
 * Shows: opponent tag, connection status, resign button, rematch offer.
 */
import React from 'react'
import { SOCKET_STATUS } from '../../hooks/useGameSocket.js'

const HUD_CSS = `
.ohud { width:100%; max-width:380px; display:flex; align-items:center;
  justify-content:space-between; gap:.5rem;
  background:var(--bg-surface); border:1px solid var(--border-dim);
  border-radius:var(--r-md); padding:.45rem .8rem; }
.ohud-tag { font-size:.62rem; font-weight:700; letter-spacing:.1em; }
.ohud-tag.you { color:var(--gold); }
.ohud-tag.opp { color:var(--blue-piece); }
.ohud-vs { font-size:.56rem; color:var(--txt-muted); }
.ohud-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
.ohud-dot.on  { background:#40C070; box-shadow:0 0 6px rgba(64,192,112,.5);
  animation:glowPulse 2s ease-in-out infinite; }
.ohud-dot.off { background:#C04040; }
.ohud-resign { font-family:var(--font-display); font-size:.52rem; font-weight:700;
  letter-spacing:.08em; padding:2px 8px; border-radius:4px;
  border:1px solid #3A1A1A; background:#1A0A0A; color:#804040;
  cursor:pointer; transition:all .15s; }
.ohud-resign:hover { color:#C04040; border-color:#602020; }
.rematch-bar { width:100%; max-width:380px; background:var(--bg-surface);
  border:1px solid var(--border-dim); border-radius:var(--r-md);
  padding:.55rem .9rem; display:flex; align-items:center;
  justify-content:space-between; gap:.5rem; }
.rematch-txt { font-size:.62rem; color:var(--txt-secondary); letter-spacing:.05em; }
.rematch-btn { font-family:var(--font-display); font-size:.58rem; font-weight:700;
  letter-spacing:.1em; padding:.32rem .8rem; border-radius:var(--r-sm);
  border:1px solid var(--gold-dim); background:#160D02; color:var(--gold);
  cursor:pointer; transition:opacity .15s; }
.rematch-btn:hover { opacity:.8; }
@keyframes glowPulse { 0%,100%{box-shadow:0 0 4px rgba(64,192,112,.4)}
  50%{box-shadow:0 0 10px rgba(64,192,112,.7)} }
`

export default function OnlineHUD({
  myTag, opponentTag, connected,
  rematchOffer, onResign, onRematch,
}) {
  return (
    <>
      <style>{HUD_CSS}</style>
      <div className="ohud">
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div className={`ohud-dot ${connected ? 'on' : 'off'}`}/>
          <span className="ohud-tag you">#{myTag ?? '…'}</span>
        </div>
        <span className="ohud-vs">VS</span>
        <span className="ohud-tag opp">#{opponentTag ?? '…'}</span>
        <button className="ohud-resign" onClick={onResign}>RESIGN</button>
      </div>

      {rematchOffer && (
        <div className="rematch-bar">
          <span className="rematch-txt">
            #{opponentTag} wants a rematch
          </span>
          <button className="rematch-btn" onClick={onRematch}>ACCEPT</button>
        </div>
      )}
    </>
  )
}
