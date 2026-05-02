import React, { useState, useEffect } from 'react';
import { MAPS_LIST } from '../../game/maps/index';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function LeaderboardScreen({ onBack, profile }) {
  const [tab, setTab] = useState('global');
  const [mapId, setMapId] = useState('mumbai');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = tab === 'global'
      ? `${API}/api/leaderboard`
      : `${API}/api/leaderboard/${mapId}?mode=side`;

    fetch(url)
      .then(r => r.json())
      .then(j => {
        setData(tab === 'global' ? (j.players || []) : (j.entries || []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tab, mapId]);

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
          <button style={styles.backBtn} onClick={onBack}>← Back</button>
          <h2 style={styles.heading}>🏆 Leaderboard</h2>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {['global','bymap'].map(t => (
            <button key={t} style={{ ...styles.tab, ...(tab===t ? styles.tabActive:{}) }} onClick={()=>setTab(t)}>
              {t === 'global' ? '🌍 Global' : '🗺️ By Map'}
            </button>
          ))}
        </div>

        {tab === 'bymap' && (
          <div style={styles.mapPicker}>
            {MAPS_LIST.map(m => (
              <button key={m.id}
                style={{ ...styles.mapBtn, ...(mapId===m.id ? styles.mapBtnActive:{}) }}
                onClick={()=>setMapId(m.id)}>
                {m.emoji} {m.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign:'center', color:'#888', padding:40 }}>Loading…</div>
        ) : data.length === 0 ? (
          <div style={{ textAlign:'center', color:'#555', padding:60 }}>
            <div style={{ fontSize:48 }}>🏁</div>
            <p>No races yet. Be the first!</p>
          </div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>#</span>
              <span>Racer</span>
              {tab === 'global' ? <><span>Wins</span><span>Top Speed</span><span>Win%</span></>
                               : <><span>Time</span><span>Score</span><span>Speed</span></>}
            </div>
            {data.slice(0,30).map((row,i) => (
              <div key={row.id||i} style={{
                ...styles.tableRow,
                background: i<3 ? `rgba(255,215,0,${0.06-i*0.015})` : 'rgba(255,255,255,0.03)',
                border: row.player_id === profile?.id || row.id === profile?.id
                  ? '1px solid rgba(255,215,0,0.4)' : '1px solid transparent',
              }}>
                <span style={{ color: i===0?'#ffd700':i===1?'#c0c0c0':i===2?'#cd7f32':'#666', fontWeight:700 }}>
                  {i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
                </span>
                <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:12,height:12,borderRadius:'50%',background:row.car_color||'#e74c3c',display:'inline-block',flexShrink:0 }}/>
                  {row.username||row.display_name||'Racer'}
                </span>
                {tab === 'global'
                  ? <><span>{row.total_wins||0}</span><span>{row.best_speed||0}km/h</span><span>{row.win_pct||0}%</span></>
                  : <><span>{row.best_time_ms ? formatTime(row.best_time_ms) : '-'}</span>
                     <span>{(row.best_score||0).toLocaleString()}</span>
                     <span>{row.top_speed||0}km/h</span></>
                }
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(ms) {
  const s = ms / 1000;
  const m = Math.floor(s / 60);
  return `${m}:${(s%60).toFixed(2).padStart(5,'0')}`;
}

const styles = {
  overlay: { position:'fixed',inset:0,background:'#000',overflowY:'auto',fontFamily:'Arial,sans-serif',color:'#fff' },
  container: { maxWidth:700,margin:'0 auto',padding:'24px 20px 60px' },
  backBtn: { background:'none',border:'1px solid rgba(255,255,255,0.2)',color:'#ccc',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontSize:13 },
  heading: { fontSize:24,fontWeight:900,margin:0,color:'#ffd700' },
  tabs: { display:'flex',gap:10,marginBottom:20 },
  tab: { padding:'8px 20px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#aaa',cursor:'pointer',fontSize:14 },
  tabActive: { border:'1px solid #ffd700',color:'#ffd700',background:'rgba(255,215,0,0.08)' },
  mapPicker: { display:'flex',gap:8,flexWrap:'wrap',marginBottom:20 },
  mapBtn: { padding:'6px 14px',borderRadius:20,border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#aaa',cursor:'pointer',fontSize:13 },
  mapBtnActive: { border:'1px solid #ffd700',color:'#ffd700' },
  table: { display:'flex',flexDirection:'column',gap:6 },
  tableHeader: { display:'grid',gridTemplateColumns:'36px 1fr 1fr 1fr 1fr',padding:'8px 14px',fontSize:11,color:'#555',letterSpacing:1,textTransform:'uppercase' },
  tableRow: { display:'grid',gridTemplateColumns:'36px 1fr 1fr 1fr 1fr',padding:'12px 14px',borderRadius:8,fontSize:14,alignItems:'center' },
};
