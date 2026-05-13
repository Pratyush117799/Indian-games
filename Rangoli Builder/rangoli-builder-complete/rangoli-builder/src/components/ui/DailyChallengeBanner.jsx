// src/components/ui/DailyChallengeBanner.jsx
import { useEffect, useState } from "react";
import { useNavigate }          from "react-router-dom";
import { motion }               from "framer-motion";
import { Flame, Clock }         from "lucide-react";
import { festivalAPI }          from "../../utils/apiClient";
import { getFestival }          from "../../data/festivals";

export default function DailyChallengeBanner() {
  const navigate              = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [timeLeft,  setTimeLeft]  = useState("");

  useEffect(() => {
    festivalAPI.today()
      .then(r  => setChallenge(r.data))
      .catch(() => setChallenge(null))
      .finally(() => setLoading(false));
  }, []);

  // Countdown to midnight
  useEffect(() => {
    const tick = () => {
      const now  = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const h    = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m    = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s    = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (loading || !challenge) return null;

  const festival = getFestival(challenge.festival);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 26 }}
      className="mx-auto max-w-4xl px-6 mb-4"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/15 px-5 py-4
                   flex items-center gap-4 cursor-pointer group transition-all
                   hover:border-white/30"
        style={{
          background: `linear-gradient(135deg, ${festival.glowColor}, rgba(255,255,255,0.03))`,
          boxShadow: `0 4px 24px ${festival.glowColor}`,
        }}
        onClick={() => navigate(`/game/festival/${challenge.festival}/medium`)}
      >
        {/* Animated background shimmer */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(90deg, transparent, ${festival.accentColor}33, transparent)`,
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
        />

        {/* Icon */}
        <div className="relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: `${festival.accentColor}22`, border: `1px solid ${festival.accentColor}44` }}>
          {festival.emoji}
        </div>

        {/* Text */}
        <div className="relative flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Flame size={13} className="text-orange-400" />
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              Daily Challenge
            </span>
            <span className="text-xs text-white/30 ml-1">+{challenge.bonusXP} bonus XP</span>
          </div>
          <p className="text-sm font-bold text-white truncate">
            {festival.name} · {challenge.difficulty} · {Math.round(challenge.timeLimit / 60)} min
          </p>
          <p className="text-xs text-white/40 mt-0.5">
            {challenge.participants || 0} players today
          </p>
        </div>

        {/* Timer */}
        <div className="relative flex-shrink-0 text-right">
          <div className="flex items-center gap-1 text-xs text-white/40 mb-0.5 justify-end">
            <Clock size={11} />
            <span>Resets in</span>
          </div>
          <p className="text-base font-black tabular-nums" style={{ color: festival.accentColor }}>
            {timeLeft}
          </p>
        </div>

        {/* Arrow */}
        <div className="relative text-white/30 group-hover:text-white/70 transition-colors ml-1 flex-shrink-0">
          →
        </div>
      </div>
    </motion.div>
  );
}
