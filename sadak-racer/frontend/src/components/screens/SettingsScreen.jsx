import React, { useState } from 'react';
import { CAR_COLORS } from '../../game/constants';

export default function SettingsScreen({ profile, onSave, onBack }) {
  const [colorIdx, setColorIdx] = useState(
    Math.max(0, CAR_COLORS.indexOf(profile.carColor))
  );
  const [name, setName] = useState(profile.displayName || profile.username || '');

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <h2 style={styles.heading}>⚙️ Settings</h2>

        <label style={styles.label}>Racer Name</label>
        <input
          style={styles.input}
          value={name}
          maxLength={20}
          onChange={e => setName(e.target.value)}
          placeholder="Your racing name"
        />

        <label style={styles.label}>Car Colour</label>
        <div style={{ display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center',margin:'8px 0 20px' }}>
          {CAR_COLORS.map((c,i) => (
            <div key={c} onClick={()=>setColorIdx(i)} style={{
              width:40,height:40,borderRadius:'50%',background:c,cursor:'pointer',
              border:colorIdx===i?'3px solid #fff':'3px solid transparent',
              boxShadow:colorIdx===i?`0 0 18px ${c}99`:'none',
              transition:'all .15s',
            }}/>
          ))}
        </div>

        {/* Preview car */}
        <div style={{ textAlign:'center',margin:'16px 0' }}>
          <svg width={120} height={50}>
            <rect x={10} y={10} width={100} height={30} rx={8} fill={CAR_COLORS[colorIdx]}/>
            <rect x={30} y={3} width={55} height={22} rx={5} fill={lighten(CAR_COLORS[colorIdx])}/>
            <rect x={36} y={5} width={28} height={16} rx={3} fill="rgba(180,230,255,0.7)"/>
            <circle cx={28} cy={40} r={9} fill="#222"/>
            <circle cx={92} cy={40} r={9} fill="#222"/>
          </svg>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.stat}><div style={styles.statVal}>{profile.totalRaces}</div><div style={styles.statLabel}>Races</div></div>
          <div style={styles.stat}><div style={styles.statVal}>{profile.totalWins}</div><div style={styles.statLabel}>Wins</div></div>
          <div style={styles.stat}><div style={styles.statVal}>{Math.round(profile.bestSpeed)}</div><div style={styles.statLabel}>Best km/h</div></div>
          <div style={styles.stat}><div style={{ ...styles.statVal,color:'#ffd700' }}>{(profile.totalScore||0).toLocaleString()}</div><div style={styles.statLabel}>Score</div></div>
        </div>

        <button
          style={styles.saveBtn}
          onClick={() => onSave(name || profile.username, CAR_COLORS[colorIdx])}
        >
          💾 Save Changes
        </button>
      </div>
    </div>
  );
}

function lighten(hex) {
  const n=parseInt(hex.replace('#',''),16);
  return `rgb(${Math.min(255,(n>>16)+40)},${Math.min(255,((n>>8)&0xff)+40)},${Math.min(255,(n&0xff)+40)})`;
}

const styles = {
  overlay:{ position:'fixed',inset:0,background:'radial-gradient(ellipse at 50% 30%,#100800,#000)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Arial,sans-serif',color:'#fff' },
  card:{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:16,padding:'36px 40px',textAlign:'center',width:'min(420px,95vw)',position:'relative' },
  backBtn:{ position:'absolute',top:16,left:16,background:'none',border:'1px solid rgba(255,255,255,0.2)',color:'#ccc',padding:'6px 14px',borderRadius:8,cursor:'pointer',fontSize:13 },
  heading:{ fontSize:24,fontWeight:900,margin:'0 0 24px',color:'#ffd700' },
  label:{ display:'block',textAlign:'left',fontSize:12,color:'#888',letterSpacing:1,textTransform:'uppercase',marginBottom:6 },
  input:{ width:'100%',padding:'10px 14px',borderRadius:8,border:'1.5px solid rgba(255,255,255,0.2)',background:'rgba(255,255,255,0.08)',color:'#fff',fontSize:15,outline:'none',marginBottom:20,boxSizing:'border-box' },
  statsRow:{ display:'flex',gap:12,margin:'20px 0' },
  stat:{ flex:1,background:'rgba(255,255,255,0.07)',borderRadius:8,padding:'10px' },
  statVal:{ fontSize:20,fontWeight:700,color:'#fff' },
  statLabel:{ fontSize:10,color:'#666',marginTop:2 },
  saveBtn:{ width:'100%',padding:'13px',borderRadius:10,border:'1.5px solid #ffd700',background:'linear-gradient(135deg,#8B6914,#5a3800)',color:'#ffd700',fontSize:16,fontWeight:700,cursor:'pointer' },
};
