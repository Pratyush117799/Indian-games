// src/pages/Home.jsx
import { useState }             from "react";
import { useNavigate }          from "react-router-dom";
import { motion }               from "framer-motion";
import { User }                 from "lucide-react";
import { FESTIVALS }            from "../data/festivals";
import DailyChallengeBanner     from "../components/ui/DailyChallengeBanner";
import XPToast                  from "../components/ui/XPToast";
import useUserStore              from "../store/userStore";

export default function Home() {
  const navigate                = useNavigate();
  const { user, isAuthenticated } = useUserStore();
  const [selected,    setSelected]    = useState(null);
  const [selectedDiff,setSelectedDiff] = useState(null);
  const fest = selected ? FESTIVALS.find(f => f.id === selected) : null;

  return (
    <div className="min-h-screen" style={{ background:"linear-gradient(135deg,#0F0A1E 0%,#1a0a2e 50%,#0a0a1a 100%)" }}>
      <XPToast />

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎨</span>
          <span className="text-sm font-bold text-white/80">Rangoli Builder</span>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <button onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm
                         text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all">
              <User size={14} />
              <span>{user?.username}</span>
              <span className="text-xs text-yellow-400">Lv.{user?.level}</span>
            </button>
          ) : (
            <button onClick={() => navigate("/auth")}
              className="px-4 py-1.5 rounded-xl text-sm font-medium text-white
                         bg-saffron/20 hover:bg-saffron/30 border border-saffron/30 transition-all">
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <header className="text-center pt-10 pb-6 px-6">
        <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
          transition={{type:"spring",stiffness:300,damping:24}}
          className="text-5xl mb-3" style={{filter:"drop-shadow(0 0 24px rgba(232,93,4,0.8))"}}>
          🎨
        </motion.div>
        <motion.h1 initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
          className="text-4xl font-bold text-white tracking-tight mb-2">
          Rangoli <span style={{color:"#E85D04"}}>Builder</span>
        </motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}
          className="text-white/50 text-base max-w-md mx-auto">
          Create beautiful Indian festival patterns with real-time symmetry
        </motion.p>
      </header>

      {/* ── Daily Challenge ──────────────────────────────────────── */}
      <DailyChallengeBanner />

      {/* ── Quick actions ────────────────────────────────────────── */}
      <div className="flex justify-center gap-3 mb-8 px-6 flex-wrap">
        {[
          { label:"🎮 Free Build",    path:"/game/free/diwali"  },
          { label:"✳ Symmetry",       path:"/game/symmetry/diwali" },
          { label:"🏆 Leaderboard",   path:"/leaderboard"       },
          { label:"🖼️ Gallery",       path:"/gallery"           },
          { label:"⚔️ Multiplayer",   path:"/lobby"             },
        ].map(b => (
          <motion.button key={b.path} whileTap={{scale:0.96}}
            onClick={() => navigate(b.path)}
            className="px-5 py-2 rounded-xl text-sm font-medium text-white
                       border border-white/15 hover:border-white/30 bg-white/5
                       hover:bg-white/8 transition-all">
            {b.label}
          </motion.button>
        ))}
      </div>

      {/* ── Festival grid ─────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-center text-xs text-white/30 uppercase tracking-widest mb-6">
          Choose a Festival
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {FESTIVALS.map((f, i) => (
            <motion.button key={f.id}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i * 0.05, type:"spring", stiffness:300 }}
              onClick={() => { setSelected(f.id); setSelectedDiff(null); }}
              className={`p-4 rounded-2xl border text-left transition-all duration-200
                ${selected===f.id
                  ? "border-white/30 scale-105"
                  : "border-white/8 hover:border-white/20"}`}
              style={{
                background: selected===f.id
                  ? `linear-gradient(135deg,${f.glowColor},rgba(255,255,255,0.05))`
                  : "rgba(255,255,255,0.03)",
                boxShadow: selected===f.id ? `0 0 30px ${f.glowColor}` : "none",
              }}>
              <div className="text-3xl mb-2">{f.emoji}</div>
              <h3 className="text-sm font-bold text-white leading-tight">{f.name}</h3>
              <p className="text-xs text-white/40 mt-0.5">{f.tagline}</p>
              <div className="flex gap-1 mt-2">
                {f.palette.slice(0,5).map((c,j) => (
                  <div key={j} className="w-2.5 h-2.5 rounded-full" style={{background:c}} />
                ))}
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Difficulty + mode picker ─────────────────────────────── */}
        {fest && (
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
            className="mt-6 p-5 rounded-2xl border border-white/10 bg-white/5"
            style={{ boxShadow: `0 0 40px ${fest.glowColor}` }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{fest.emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{fest.name}</h3>
                <p className="text-xs text-white/40">{fest.style}</p>
              </div>
            </div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Select Difficulty</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {fest.difficulties.map(d => (
                <button key={d.id} onClick={() => setSelectedDiff(d.id)}
                  className={`p-3 rounded-xl border text-left transition-all
                    ${selectedDiff===d.id ? "border-white/40 bg-white/15" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{d.label}</span>
                    <div className="flex gap-0.5">
                      {Array.from({length:5},(_,i)=>(
                        <span key={i} style={{fontSize:11,color:i<d.stars?fest.accentColor:"rgba(255,255,255,0.15)"}}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/40">{d.timeMin}–{d.timeMax} min</p>
                  {d.parts && <p className="text-xs mt-0.5" style={{color:fest.accentColor}}>{d.parts} parts</p>}
                </button>
              ))}
            </div>
            {selectedDiff && (
              <div className="flex gap-2">
                <button onClick={() => {
                  const diff = fest.difficulties.find(d=>d.id===selectedDiff);
                  navigate(diff?.parts
                    ? `/game/partbuild/${fest.id}/${selectedDiff}`
                    : `/game/festival/${fest.id}/${selectedDiff}`);
                }}
                  className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition-all active:scale-95"
                  style={{background:fest.accentColor}}>
                  🎨 Solo Play
                </button>
                <button onClick={() => navigate("/lobby")}
                  className="py-3 px-4 rounded-xl text-white text-sm border border-white/20 hover:border-white/40 transition-all">
                  ⚔️ VS
                </button>
              </div>
            )}
          </motion.div>
        )}
      </section>
    </div>
  );
}
