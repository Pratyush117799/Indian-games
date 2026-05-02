import React from 'react';

export default function ModeSelect({ map, profile, onSelect, onBack }) {
  const topdownLocked = !profile.unlockedModes.includes('topdown');

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <div style={{ fontSize:52, textAlign:'center', marginBottom:8 }}>{map.emoji}</div>
        <h2 style={styles.heading}>{map.name}</h2>
        <p style={styles.sub}>{map.sub}</p>

        <div style={{ display:'flex', gap:16, marginTop:28, flexWrap:'wrap', justifyContent:'center' }}>
          {/* Side scroll */}
          <div style={styles.modeCard} onClick={() => onSelect('side')}>
            <div style={styles.modeEmoji}>🏍️</div>
            <div style={styles.modeName}>Side-Scroll</div>
            <div style={styles.modeDesc}>
              Classic Road Rash view.<br/>
              Dodge traffic, race AI rivals,<br/>
              escape police.
            </div>
            <div style={styles.modeBadge}>Available</div>
          </div>

          {/* Top-down */}
          <div style={{ ...styles.modeCard, opacity: topdownLocked ? 0.45 : 1,
              cursor: topdownLocked ? 'not-allowed' : 'pointer' }}
            onClick={() => !topdownLocked && onSelect('topdown')}>
            <div style={styles.modeEmoji}>🗺️</div>
            <div style={styles.modeName}>Top-Down</div>
            <div style={styles.modeDesc}>
              Bird's eye view.<br/>
              4-lane highway, weave<br/>
              through dense traffic.
            </div>
            {topdownLocked
              ? <div style={{ ...styles.modeBadge, background:'rgba(255,50,50,0.15)', color:'#e74c3c' }}>
                  🔒 Clear all maps to unlock
                </div>
              : <div style={styles.modeBadge}>Available</div>
            }
          </div>
        </div>

        <div style={styles.mapStats}>
          <span>🏁 {map.lapKm * 1000}m race</span>
          <span>⚡ {map.maxSpeed}km/h max</span>
          <span>👮 {map.policeCount} police</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position:'fixed', inset:0,
    background:'radial-gradient(ellipse at 50% 30%,#100800,#000)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontFamily:'Arial,sans-serif', color:'#fff',
  },
  card: {
    background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
    borderRadius:16, padding:'32px 40px', textAlign:'center', width:'min(520px,95vw)',
    position:'relative',
  },
  backBtn: {
    position:'absolute', top:16, left:16,
    background:'none', border:'1px solid rgba(255,255,255,0.2)',
    color:'#ccc', padding:'6px 14px', borderRadius:8, cursor:'pointer', fontSize:13,
  },
  heading: {
    fontSize:28, fontWeight:900, letterSpacing:2,
    background:'linear-gradient(135deg,#ffd700,#ff8c00)',
    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
    margin:0,
  },
  sub: { color:'#aaa', fontSize:14, margin:'6px 0 0' },
  modeCard: {
    background:'rgba(255,255,255,0.07)', border:'1.5px solid rgba(255,200,50,0.25)',
    borderRadius:14, padding:'24px 28px', width:200, cursor:'pointer',
    transition:'all .2s',
  },
  modeEmoji: { fontSize:44, marginBottom:10 },
  modeName: { fontSize:20, fontWeight:800, color:'#ffd700', marginBottom:10 },
  modeDesc: { fontSize:12, color:'#ccc', lineHeight:1.7, marginBottom:16 },
  modeBadge: {
    fontSize:11, background:'rgba(46,204,113,0.15)', color:'#2ecc71',
    padding:'4px 12px', borderRadius:20, display:'inline-block',
  },
  mapStats: {
    display:'flex', justifyContent:'center', gap:24, marginTop:28,
    fontSize:13, color:'#aaa',
  },
};
