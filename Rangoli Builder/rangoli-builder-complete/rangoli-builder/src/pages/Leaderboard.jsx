// src/pages/Leaderboard.jsx — real API-connected version
import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { ArrowLeft, Trophy, RefreshCw } from "lucide-react";
import { FESTIVALS }           from "../data/festivals";
import { leaderboardAPI }      from "../utils/apiClient";

const MOCK = [
  { rank:1, username:"Priya S.",  score:9840, festival:"diwali",   level:6 },
  { rank:2, username:"Arjun M.",  score:9610, festival:"onam",     level:7 },
  { rank:3, username:"Kavya R.",  score:9450, festival:"navratri", level:5 },
  { rank:4, username:"Rohan P.",  score:8980, festival:"holi",     level:4 },
  { rank:5, username:"Sneha T.",  score:8740, festival:"diwali",   level:6 },
];
const BADGES = ["🥇","🥈","🥉"];

export default function Leaderboard() {
  const navigate = useNavigate();
  const [tab,     setTab]     = useState("global");
  const [data,    setData]    = useState(MOCK);
  const [loading, setLoading] = useState(false);
  const [isMock,  setIsMock]  = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = tab === "global"
        ? await leaderboardAPI.global({ limit: 50 })
        : await leaderboardAPI.festival(tab, { limit: 50 });
      if (res.data?.length) { setData(res.data); setIsMock(false); }
      else { setData(MOCK); setIsMock(true); }
    } catch { setData(MOCK); setIsMock(true); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [tab]);

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(135deg,#0F0A1E,#1a0a2e)"}}>
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/8">
        <button onClick={()=>navigate("/")} className="text-white/40 hover:text-white transition-colors"><ArrowLeft size={18}/></button>
        <Trophy size={18} className="text-yellow-400"/>
        <h1 className="text-lg font-bold text-white">Leaderboard</h1>
        <button onClick={fetchData} disabled={loading} className="ml-auto text-white/30 hover:text-white/70 transition-colors disabled:opacity-30">
          <RefreshCw size={15} className={loading?"animate-spin":""}/>
        </button>
      </header>
      <div className="flex gap-2 px-6 py-4 overflow-x-auto">
        {[{id:"global",name:"Global",emoji:"🌍"},...FESTIVALS].map(f=>(
          <button key={f.id} onClick={()=>setTab(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${tab===f.id?"bg-saffron text-white":"bg-white/5 text-white/50 hover:text-white/80"}`}>
            {f.emoji} {f.name}
          </button>
        ))}
      </div>
      <div className="max-w-lg mx-auto px-6 pb-16">
        {loading ? <div className="text-center py-16 text-white/30 text-sm">Loading…</div> : (
          <div className="space-y-2">
            {data.map((entry,i)=>{
              const fest=FESTIVALS.find(f=>f.id===entry.festival);
              return (
                <div key={i} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border ${i<3?"border-white/20 bg-white/8":"border-white/8 bg-white/4"}`}>
                  <span className="text-xl w-8 text-center flex-shrink-0">
                    {BADGES[i]||<span className="text-sm text-white/30 font-bold">{i+1}</span>}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{entry.username}</p>
                    <p className="text-xs text-white/40">{fest?.emoji} {fest?.name||entry.festival}{entry.level?` · Lv.${entry.level}`:""}</p>
                  </div>
                  <span className="text-base font-bold tabular-nums flex-shrink-0"
                    style={{color:i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":"#E85D04"}}>
                    {(entry.score||entry.bestScore||0).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <p className="text-center text-white/20 text-xs mt-6">
          {isMock?"Demo data — start the backend for live rankings":`${data.length} players ranked`}
        </p>
      </div>
    </div>
  );
}
