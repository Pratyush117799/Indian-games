import React, { useState } from 'react';
import { CAR_COLORS } from '../../game/constants';

export default function MainMenu({ profile, onStartGame, onSetUsername }) {
  const [showName, setShowName] = useState(!profile.username);
  const [nameInput, setNameInput] = useState('');
  const [colorIdx, setColorIdx] = useState(
    CAR_COLORS.indexOf(profile.carColor) >= 0 ? CAR_COLORS.indexOf(profile.carColor) : 0
  );

  if (showName) {
    return (
      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.logo}>🏎️</div>
          <h2 style={styles.h2}>Your Name</h2>
          <input
            style={styles.input}
            placeholder="Enter racer name"
            value={nameInput}
            maxLength={20}
            onChange={e => setNameInput(e.target.value)}
            autoFocus
            onKeyDown={e => { if(e.key==='Enter' && nameInput.trim()) {
              onSetUsername(nameInput.trim(), CAR_COLORS[colorIdx]);
              setShowName(false);
            }}}
          />
          <p style={{ color:'#aaa', fontSize:13, margin:'12px 0 6px' }}>Pick your car colour</p>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
            {CAR_COLORS.map((c,i) => (
              <div key={c} onClick={() => setColorIdx(i)} style={{
                width:32, height:32, borderRadius:'50%', background:c, cursor:'pointer',
                border: colorIdx===i ? '3px solid #fff' : '3px solid transparent',
                boxShadow: colorIdx===i ? `0 0 12px ${c}` : 'none',
              }}/>
            ))}
          </div>
          <button
            style={{ ...styles.btn, opacity: nameInput.trim() ? 1 : 0.4 }}
            disabled={!nameInput.trim()}
            onClick={() => { onSetUsername(nameInput.trim(), CAR_COLORS[colorIdx]); setShowName(false); }}
          >Start Racing →</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.overlay}>
      <div style={{ textAlign:'center', maxWidth:480, width:'90%' }}>
        {/* Title */}
        <div style={{ fontSize:72, lineHeight:1, marginBottom:8 }}>🏎️</div>
        <h1 style={styles.title}>SADAK RACER</h1>
        <p style={{ color:'#c8a96a', fontSize:15, marginBottom:32, letterSpacing:3 }}>
          INDIAN CITY RACING
        </p>

        {/* Player info */}
        <div style={styles.profileChip}>
          <span style={{ width:18, height:18, borderRadius:'50%', background:profile.carColor, display:'inline-block', marginRight:8, verticalAlign:'middle' }}/>
          <span>{profile.displayName || profile.username}</span>
          <span style={{ color:'#888', marginLeft:8, fontSize:12 }}>
            {profile.totalRaces} races · {profile.bestSpeed} km/h best
          </span>
        </div>

        {/* Main buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:28 }}>
          <button style={styles.btnBig} onClick={() => onStartGame('select')}>
            🗺️ &nbsp; Select Map & Race
          </button>
          <button style={{ ...styles.btnBig, background:'rgba(255,255,255,0.07)', fontSize:16 }}
            onClick={() => onStartGame('leaderboard')}>
            🏆 &nbsp; Leaderboard
          </button>
          <button style={{ ...styles.btnBig, background:'rgba(255,255,255,0.07)', fontSize:16 }}
            onClick={() => onStartGame('settings')}>
            ⚙️ &nbsp; Settings / Change Car
          </button>
        </div>

        {/* Controls hint */}
        <div style={styles.hint}>
          ↑/W Accelerate &nbsp;·&nbsp; ←→/AD Lane Change &nbsp;·&nbsp; SPACE Nitro &nbsp;·&nbsp; P Pause
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position:'fixed', inset:0,
    background:'radial-gradient(ellipse at 50% 30%, #1a1000 0%, #000 70%)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontFamily: 'Arial, sans-serif', color:'#fff',
  },
  card: {
    background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
    borderRadius:16, padding:'36px 40px', textAlign:'center', width:'min(400px, 90vw)',
    backdropFilter:'blur(4px)',
  },
  logo: { fontSize:56, lineHeight:1, marginBottom:12 },
  title: {
    fontSize:48, fontWeight:900, letterSpacing:6,
    background:'linear-gradient(135deg,#ffd700,#ff8c00)',
    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
    margin:'0 0 8px',
  },
  h2: { fontSize:22, fontWeight:600, margin:'0 0 20px', color:'#ffd700' },
  input: {
    width:'100%', padding:'12px 16px', borderRadius:8,
    border:'1.5px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.08)',
    color:'#fff', fontSize:16, outline:'none', marginBottom:8,
    boxSizing:'border-box',
  },
  btn: {
    width:'100%', padding:'13px', borderRadius:10,
    border:'1.5px solid #ffd700',
    background:'linear-gradient(135deg,#8B6914,#5a3800)',
    color:'#ffd700', fontSize:16, fontWeight:700, cursor:'pointer',
    letterSpacing:1,
  },
  btnBig: {
    padding:'16px 24px', borderRadius:12,
    border:'1.5px solid rgba(255,200,50,0.35)',
    background:'linear-gradient(135deg,rgba(139,105,20,0.4),rgba(90,56,0,0.4))',
    color:'#ffd700', fontSize:18, fontWeight:700, cursor:'pointer',
    letterSpacing:1, transition:'all .2s',
  },
  profileChip: {
    display:'inline-block', padding:'8px 16px',
    background:'rgba(255,255,255,0.08)',
    border:'1px solid rgba(255,255,255,0.15)',
    borderRadius:30, fontSize:14, color:'#ddd',
  },
  hint: {
    marginTop:32, fontSize:12, color:'rgba(255,255,255,0.3)', letterSpacing:1,
  },
};
