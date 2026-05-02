import React from 'react';

export default function RaceResult({ result, map, mode, onPlayAgain, onMapSelect, onMenu }) {
  if (!result) return null;
  const { completed, timeMs, maxSpeed, score, nearMisses, policeEscaped, crashes, dist, position } = result;
  const mins = Math.floor(timeMs / 60000);
  const secs = ((timeMs % 60000) / 1000).toFixed(2);
  const posLabel = ['','🥇 1ST','🥈 2ND','🥉 3RD','4TH'][Math.min(position||4,4)] || `${position}TH`;

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Result banner */}
        <div style={{
          fontSize:48, marginBottom:8,
          textShadow: completed ? '0 0 30px rgba(255,215,0,0.8)' : 'none'
        }}>
          {completed ? '🏁' : '💥'}
        </div>
        <h2 style={{ ...styles.heading, color: completed ? '#ffd700' : '#e74c3c' }}>
          {completed ? 'RACE COMPLETE!' : 'WIPED OUT!'}
        </h2>
        <p style={styles.sub}>{map.emoji} {map.name} · {mode === 'topdown' ? 'Top-Down' : 'Side-Scroll'}</p>

        {/* Position */}
        {completed && (
          <div style={styles.positionBadge}>{posLabel}</div>
        )}

        {/* Stats grid */}
        <div style={styles.statsGrid}>
          <StatBox label="Score" value={score?.toLocaleString() || '0'} color="#ffd700" big />
          <StatBox label="Time" value={`${mins}:${secs}`} color="#fff" />
          <StatBox label="Top Speed" value={`${Math.round(maxSpeed)} km/h`} color="#2ecc71" />
          <StatBox label="Distance" value={`${Math.round(dist)}m`} color="#3498db" />
          <StatBox label="Near Misses" value={nearMisses} color="#f39c12" />
          <StatBox label="Crashes" value={crashes} color="#e74c3c" />
          {policeEscaped && <StatBox label="Police Evaded" value="✓" color="#e74c3c" />}
        </div>

        {/* Bonus notes */}
        {policeEscaped && (
          <div style={styles.bonusTag}>🚔 Police Escape Bonus! +300 pts</div>
        )}
        {nearMisses > 5 && (
          <div style={styles.bonusTag}>😱 Daredevil! {nearMisses} near misses</div>
        )}
        {Math.round(maxSpeed) >= map.maxSpeed * 0.92 && (
          <div style={styles.bonusTag}>⚡ Top Speed Achieved!</div>
        )}

        {/* Unlock notification */}
        {completed && result.newUnlock && (
          <div style={styles.unlockBadge}>
            🎉 Unlocked: <strong>{result.newUnlock}</strong>!
          </div>
        )}

        {/* Actions */}
        <div style={styles.btnRow}>
          <button style={styles.btnPrimary} onClick={onPlayAgain}>
            🔄 Race Again
          </button>
          <button style={styles.btnSecondary} onClick={onMapSelect}>
            🗺️ Maps
          </button>
          <button style={styles.btnSecondary} onClick={onMenu}>
            🏠 Menu
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color, big }) {
  return (
    <div style={{
      background:'rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 8px',
      textAlign:'center',
    }}>
      <div style={{ fontSize: big ? 28 : 20, fontWeight:800, color }}>{value}</div>
      <div style={{ fontSize:11, color:'#888', marginTop:3 }}>{label}</div>
    </div>
  );
}

const styles = {
  overlay: {
    position:'fixed', inset:0,
    background:'radial-gradient(ellipse at 50% 20%,#0a0500,#000)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontFamily:'Arial,sans-serif', color:'#fff',
  },
  card: {
    background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)',
    borderRadius:18, padding:'36px 40px', textAlign:'center',
    width:'min(460px,95vw)', backdropFilter:'blur(4px)',
  },
  heading: { fontSize:28, fontWeight:900, letterSpacing:3, margin:'0 0 6px' },
  sub: { color:'#888', fontSize:13, margin:'0 0 16px' },
  positionBadge: {
    fontSize:32, marginBottom:16,
    textShadow:'0 0 20px rgba(255,215,0,0.6)',
  },
  statsGrid: {
    display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
    gap:10, margin:'16px 0',
  },
  bonusTag: {
    fontSize:12, color:'#f39c12',
    background:'rgba(243,156,18,0.12)',
    borderRadius:20, padding:'5px 14px',
    display:'inline-block', margin:'4px',
  },
  unlockBadge: {
    background:'rgba(46,204,113,0.15)', border:'1px solid rgba(46,204,113,0.3)',
    borderRadius:10, padding:'10px 16px', margin:'14px 0 0',
    fontSize:14, color:'#2ecc71',
  },
  btnRow: { display:'flex', gap:10, marginTop:24, justifyContent:'center' },
  btnPrimary: {
    padding:'12px 24px', borderRadius:10,
    border:'1.5px solid #ffd700',
    background:'linear-gradient(135deg,#8B6914,#5a3800)',
    color:'#ffd700', fontSize:15, fontWeight:700, cursor:'pointer',
  },
  btnSecondary: {
    padding:'12px 18px', borderRadius:10,
    border:'1px solid rgba(255,255,255,0.2)',
    background:'rgba(255,255,255,0.07)',
    color:'#ccc', fontSize:14, cursor:'pointer',
  },
};
