import React, { useState } from 'react';
import { MAPS_LIST } from '../../game/maps/index';

export default function MapSelect({ profile, onSelect, onBack }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h2 style={styles.heading}>Choose Your Track</h2>
        <p style={styles.sub}>5 Indian cities · 5000m each · Beat traffic &amp; police</p>

        <div style={styles.grid}>
          {MAPS_LIST.map((map) => {
            const unlocked = profile.unlockedMaps.includes(map.id);
            const isHover  = hoveredId === map.id;
            return (
              <div
                key={map.id}
                style={{
                  ...styles.card,
                  border: `1.5px solid ${unlocked ? (isHover ? '#ffd700' : 'rgba(255,200,50,0.3)') : 'rgba(255,255,255,0.1)'}`,
                  opacity: unlocked ? 1 : 0.5,
                  transform: isHover && unlocked ? 'translateY(-4px)' : 'none',
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  boxShadow: isHover && unlocked ? '0 8px 30px rgba(255,200,50,0.2)' : 'none',
                }}
                onMouseEnter={() => setHoveredId(map.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => unlocked && onSelect(map)}
              >
                {/* Map emoji banner */}
                <div style={{ ...styles.banner, background: getBannerGrad(map.id) }}>
                  <span style={{ fontSize:48 }}>{map.emoji}</span>
                  {!unlocked && <div style={styles.lockIcon}>🔒</div>}
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.mapName}>{map.name}</div>
                  <div style={styles.mapSub}>{map.sub}</div>
                  <div style={styles.desc}>{map.desc}</div>

                  {/* Stats row */}
                  <div style={styles.statRow}>
                    <Stat label="Speed" value={`${map.maxSpeed}km/h`} />
                    <Stat label="Traffic" value={trafficLabel(map.trafficDensity)} />
                    <Stat label="Police" value={`×${map.policeCount}`} />
                  </div>

                  {/* Hazard badge */}
                  <div style={styles.hazardBadge}>
                    ⚠️ {map.specialHazard.replace('_',' ')}
                  </div>

                  {!unlocked && (
                    <div style={styles.lockedMsg}>
                      Complete <strong>{map.unlockCondition}</strong> to unlock
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mode selector hint */}
        {profile.unlockedModes.includes('topdown') && (
          <p style={{ color:'#ffd700', textAlign:'center', marginTop:20, fontSize:13 }}>
            🏆 Top-Down mode unlocked! Select any map to choose mode.
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ fontSize:14, fontWeight:700, color:'#ffd700' }}>{value}</div>
      <div style={{ fontSize:10, color:'#888', marginTop:2 }}>{label}</div>
    </div>
  );
}

function trafficLabel(density) {
  if (density < 0.8) return 'Light';
  if (density < 1.2) return 'Moderate';
  if (density < 1.6) return 'Heavy';
  return 'Chaos';
}

function getBannerGrad(id) {
  const grads = {
    mumbai:    'linear-gradient(135deg,#03051a,#1a2260)',
    delhi:     'linear-gradient(135deg,#5a4a2a,#8a6a3a)',
    himalaya:  'linear-gradient(135deg,#1a3a5e,#4a7a9e)',
    rajasthan: 'linear-gradient(135deg,#c05010,#f08030)',
    chennai:   'linear-gradient(135deg,#1a6aaa,#3a9ade)',
  };
  return grads[id] || '#222';
}

const styles = {
  overlay: {
    position:'fixed', inset:0, overflowY:'auto',
    background:'radial-gradient(ellipse at 50% 20%,#100800,#000)',
    fontFamily:'Arial,sans-serif', color:'#fff',
  },
  container: { maxWidth:960, margin:'0 auto', padding:'24px 20px 48px' },
  backBtn: {
    background:'none', border:'1px solid rgba(255,255,255,0.2)',
    color:'#ccc', padding:'8px 16px', borderRadius:8,
    cursor:'pointer', fontSize:14, marginBottom:24,
  },
  heading: { fontSize:32, fontWeight:900, textAlign:'center', letterSpacing:3,
    background:'linear-gradient(135deg,#ffd700,#ff8c00)',
    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0 },
  sub: { textAlign:'center', color:'#888', fontSize:14, margin:'8px 0 32px' },
  grid: {
    display:'grid',
    gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',
    gap:20,
  },
  card: {
    background:'rgba(255,255,255,0.05)',
    borderRadius:14, overflow:'hidden',
    transition:'all .2s',
  },
  banner: {
    height:100, display:'flex', alignItems:'center', justifyContent:'center',
    position:'relative',
  },
  lockIcon: {
    position:'absolute', top:8, right:12, fontSize:22,
  },
  cardBody: { padding:'16px 18px' },
  mapName: { fontSize:20, fontWeight:800, letterSpacing:1, color:'#ffd700' },
  mapSub: { fontSize:12, color:'#aaa', marginBottom:8 },
  desc: { fontSize:13, color:'#ccc', lineHeight:1.5, marginBottom:12, minHeight:40 },
  statRow: { display:'flex', justifyContent:'space-around', padding:'10px 0',
    borderTop:'1px solid rgba(255,255,255,0.1)', borderBottom:'1px solid rgba(255,255,255,0.1)',
    margin:'8px 0' },
  hazardBadge: {
    fontSize:11, color:'#f39c12',
    background:'rgba(243,156,18,0.12)', borderRadius:20,
    padding:'3px 10px', display:'inline-block', marginTop:6,
  },
  lockedMsg: {
    fontSize:11, color:'#888', marginTop:8, textAlign:'center',
  },
};
