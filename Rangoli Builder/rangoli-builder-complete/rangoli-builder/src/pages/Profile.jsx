// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate }          from "react-router-dom";
import { motion }               from "framer-motion";
import { ArrowLeft, LogOut, Award, Zap, Target, Clock } from "lucide-react";
import useUserStore    from "../store/userStore";
import { gameAPI }     from "../utils/apiClient";
import { FESTIVALS }   from "../data/festivals";

// XP thresholds per level
const LEVELS = [
  { level: 1, label: "Chalk Beginner",   min: 0,     max: 200   },
  { level: 2, label: "Petal Learner",    min: 200,   max: 500   },
  { level: 3, label: "Colour Weaver",    min: 500,   max: 1000  },
  { level: 4, label: "Mandala Artist",   min: 1000,  max: 2000  },
  { level: 5, label: "Festival Painter", min: 2000,  max: 4000  },
  { level: 6, label: "Rangoli Master",   min: 4000,  max: 8000  },
  { level: 7, label: "Kolam Legend",     min: 8000,  max: 15000 },
  { level: 8, label: "Pookalam Guru",    min: 15000, max: 25000 },
];

const BADGE_META = {
  diwali_master:       { emoji: "🪔", label: "Diwali Master"       },
  holi_burst:          { emoji: "🎨", label: "Holi Burst"           },
  onam_pookalam:       { emoji: "🌸", label: "Pookalam Artist"      },
  navratri_garba:      { emoji: "🔥", label: "Garba Circle"         },
  first_save:          { emoji: "💾", label: "First Save"           },
  speed_demon:         { emoji: "⚡", label: "Speed Demon"          },
  perfect_score:       { emoji: "⭐", label: "Perfect Score"        },
  symmetry_guru:       { emoji: "✳",  label: "Symmetry Guru"        },
  multiplayer_winner:  { emoji: "🏆", label: "Multiplayer Winner"   },
};

export default function Profile() {
  const navigate          = useNavigate();
  const { user, logout, isAuthenticated } = useUserStore();
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [tab,      setTab]      = useState("stats"); // stats | badges | history

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated]);

  // Fetch game history
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    gameAPI.sessions({ limit: 20 })
      .then(r => setSessions(r.data || []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!user) return null;

  const currentLevel = LEVELS.find(l => l.level === user.level) || LEVELS[0];
  const nextLevel    = LEVELS.find(l => l.level === user.level + 1);
  const xpInLevel    = user.xp - currentLevel.min;
  const xpNeeded     = (nextLevel?.min || currentLevel.max) - currentLevel.min;
  const levelPct     = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#0F0A1E,#1a0a2e)" }}>
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/8">
        <button onClick={() => navigate("/")} className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-white">Profile</h1>
        <button onClick={handleLogout}
          className="ml-auto flex items-center gap-1.5 text-xs text-white/30
                     hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10">
          <LogOut size={13} /> Sign out
        </button>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-5">

        {/* ── Identity card ─────────────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: "linear-gradient(135deg,#E85D04,#9B2335)" }}>
              {user.username?.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user.username}</h2>
              <p className="text-xs text-white/40">{user.email}</p>
              <p className="text-xs mt-0.5" style={{ color: "#FFD700" }}>
                Lv.{user.level} — {currentLevel.label}
              </p>
            </div>
          </div>

          {/* XP bar */}
          <div>
            <div className="flex justify-between text-xs text-white/40 mb-1.5">
              <span>{user.xp.toLocaleString()} XP</span>
              <span>{nextLevel ? `${nextLevel.min.toLocaleString()} XP → Lv.${nextLevel.level}` : "Max level!"}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden bg-white/8">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${levelPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ background: "linear-gradient(90deg,#E85D04,#FFD700)" }}
              />
            </div>
            <p className="text-right text-xs text-white/30 mt-1">{levelPct}%</p>
          </div>
        </motion.div>

        {/* ── Tab switcher ───────────────────────────────────────── */}
        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1">
          {["stats","badges","history"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize
                ${tab === t ? "bg-saffron text-white shadow-lg" : "text-white/50 hover:text-white/80"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── Stats tab ─────────────────────────────────────────── */}
        {tab === "stats" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="grid grid-cols-2 gap-3">
            {[
              { icon: <Target  size={18}/>, label: "Games Played",    value: user.stats?.totalGames    || 0,         color: "#E85D04" },
              { icon: <Award   size={18}/>, label: "Best Accuracy",   value: `${user.stats?.bestAccuracy || 0}%`,    color: "#4CAF50" },
              { icon: <Zap     size={18}/>, label: "Total XP",        value: user.xp?.toLocaleString() || 0,         color: "#FFD700" },
              { icon: <Clock   size={18}/>, label: "Fastest Game",    value: user.stats?.fastestTime
                  ? `${Math.floor(user.stats.fastestTime/60)}m ${user.stats.fastestTime%60}s`
                  : "—",                                                                                              color: "#00BCD4" },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>
                  {s.icon}
                  <span className="text-xs text-white/40">{s.label}</span>
                </div>
                <p className="text-xl font-bold tabular-nums" style={{ color: s.color }}>
                  {s.value}
                </p>
              </div>
            ))}

            {/* Festival breakdown */}
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Festival Activity</p>
              <div className="space-y-2">
                {FESTIVALS.slice(0, 5).map(f => {
                  const plays = user.stats?.festivalPlays?.[f.id] || 0;
                  const max   = Math.max(...FESTIVALS.map(ff => user.stats?.festivalPlays?.[ff.id] || 0), 1);
                  return (
                    <div key={f.id} className="flex items-center gap-3">
                      <span className="text-base w-6">{f.emoji}</span>
                      <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${(plays/max)*100}%`, background: f.accentColor || "#E85D04" }} />
                      </div>
                      <span className="text-xs text-white/30 w-6 text-right">{plays}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Badges tab ─────────────────────────────────────────── */}
        {tab === "badges" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {user.badges?.length ? (
              <div className="grid grid-cols-3 gap-3">
                {user.badges.map((b, i) => {
                  const meta = BADGE_META[b.badgeId] || { emoji: "🏅", label: b.badgeId };
                  return (
                    <motion.div key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.06, type: "spring", stiffness: 400 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                      <div className="text-3xl mb-2"
                        style={{ filter: "drop-shadow(0 0 8px rgba(255,200,0,0.5))" }}>
                        {meta.emoji}
                      </div>
                      <p className="text-xs text-white/70 font-medium leading-snug">{meta.label}</p>
                      <p className="text-xs text-white/25 mt-1">
                        {new Date(b.earnedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🏅</p>
                <p className="text-white/40 text-sm">No badges yet</p>
                <p className="text-white/25 text-xs mt-1">Complete festival challenges to earn them</p>
                <button onClick={() => navigate("/")}
                  className="mt-5 px-6 py-2.5 rounded-xl text-sm font-bold text-white
                             bg-saffron hover:bg-saffron-dark transition-all active:scale-95">
                  Play Now 🎨
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ── History tab ────────────────────────────────────────── */}
        {tab === "history" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {loading ? (
              <div className="text-center py-12 text-white/30 text-sm">Loading…</div>
            ) : sessions.length ? (
              <div className="space-y-2">
                {sessions.map((s, i) => {
                  const fest = FESTIVALS.find(f => f.id === s.festival);
                  const date = new Date(s.createdAt).toLocaleDateString("en-IN",
                    { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
                  return (
                    <motion.div key={s._id}
                      initial={{ opacity:0, x:-12 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-3 bg-white/5 border border-white/8
                                 rounded-xl px-4 py-3">
                      <span className="text-xl flex-shrink-0">{fest?.emoji || "🎨"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white capitalize">
                          {s.mode} · {fest?.name || s.festival}
                        </p>
                        <p className="text-xs text-white/35">{date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold tabular-nums" style={{ color: "#FFD700" }}>
                          {(s.score?.total || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-white/30">{s.score?.accuracy || 0}%</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-white/40 text-sm">No games yet</p>
                <p className="text-white/25 text-xs mt-1">Your completed games appear here</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
