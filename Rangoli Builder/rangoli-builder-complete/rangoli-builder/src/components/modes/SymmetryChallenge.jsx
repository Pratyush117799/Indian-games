// src/components/modes/SymmetryChallenge.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence }     from "framer-motion";
import RangolicCanvas  from "../canvas/RangolicCanvas";
import CanvasToolbar   from "../canvas/CanvasToolbar";
import TilePicker      from "../tiles/TilePicker";
import ColorPalette    from "../tiles/ColorPalette";
import FestivalBadge   from "../ui/FestivalBadge";
import { showXPToast } from "../ui/XPToast";
import useCanvasStore  from "../../store/canvasStore";
import useGameStore    from "../../store/gameStore";
import { getFestival } from "../../data/festivals";
import { GAME_MODES, GAME_PHASES, SYMMETRY_OPTIONS } from "../../utils/constants";
import { calculateScore, calculateXP }  from "../../utils/scoreCalculator";
import { gameAPI }     from "../../utils/apiClient";

const CHALLENGE_DURATION = 5 * 60; // 5 minutes fixed

// Bonus goals shown mid-game
const MILESTONES = [
  { tiles: 10, label: "Getting started! 🌱",  xpBonus: 20 },
  { tiles: 25, label: "Nice flow! 🎨",          xpBonus: 40 },
  { tiles: 50, label: "Halfway master! ⭐",     xpBonus: 60 },
  { tiles: 80, label: "Almost legendary! 🔥",   xpBonus: 80 },
  { tiles: 120,label: "Symmetry guru! 🪔",      xpBonus: 120 },
];

export default function SymmetryChallenge({ festivalId = "diwali" }) {
  const festival = getFestival(festivalId);

  const { setMode, setFestival, setTimeLimit, startGame,
          finishGame, phase, timeLeft, timeLimit,
          streak, addTilePlaced } = useGameStore();
  const { tiles, clear, setSymmetryAxes, symmetryAxes } = useCanvasStore();

  const [started,      setStarted]      = useState(false);
  const [showBadge,    setShowBadge]    = useState(false);
  const [finalScore,   setFinalScore]   = useState(0);
  const [milestone,    setMilestone]    = useState(null); // current flash message
  const [hitMilestones,setHitMilestones]= useState(new Set());
  const [chosenAxes,   setChosenAxes]   = useState(8);

  const timerRef = useRef(null);

  // Countdown tick
  useEffect(() => {
    if (!started || phase !== GAME_PHASES.ACTIVE) return;
    timerRef.current = setInterval(() => {
      useGameStore.getState().tick();
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, phase]);

  // Timer expired
  useEffect(() => {
    if (phase === GAME_PHASES.FINISHED && started) endGame();
  }, [phase]);

  // Milestone detection
  useEffect(() => {
    if (!started) return;
    for (const m of MILESTONES) {
      if (tiles.length >= m.tiles && !hitMilestones.has(m.tiles)) {
        setHitMilestones(prev => new Set([...prev, m.tiles]));
        setMilestone(m.label);
        showXPToast(m.xpBonus, m.label);
        setTimeout(() => setMilestone(null), 2200);
      }
    }
  }, [tiles.length]);

  const handleStart = (axes) => {
    setChosenAxes(axes);
    setSymmetryAxes(axes);
    setMode(GAME_MODES.SYMMETRY);
    setFestival(festivalId);
    setTimeLimit(CHALLENGE_DURATION);
    clear();
    startGame();
    setStarted(true);
  };

  const endGame = async () => {
    clearInterval(timerRef.current);
    // Score: tile variety bonus + count + time
    const varietyBonus = new Set(tiles.map(t => t.shapeId)).size * 80;
    const colorBonus   = new Set(tiles.map(t => t.color)).size * 40;
    const baseScore    = calculateScore({
      accuracy:  Math.min(100, tiles.length * 1.5),
      timeLeft:  useGameStore.getState().timeLeft,
      totalTime: CHALLENGE_DURATION,
      streak,
      completed: tiles.length >= 30,
    });
    const total = Math.min(10000, baseScore.total + varietyBonus + colorBonus);
    const xp    = calculateXP({ score: total, mode: "symmetry", festival: festivalId });

    setFinalScore(total);
    finishGame(total);
    showXPToast(xp, "Symmetry Challenge");

    try {
      await gameAPI.submit({
        mode: "symmetry", festival: festivalId,
        tiles, timeLeft: useGameStore.getState().timeLeft,
        totalTime: CHALLENGE_DURATION,
        bestStreak: streak, tilesPlaced: tiles.length,
        completed: tiles.length >= 30,
      });
    } catch { /* non-critical */ }

    setShowBadge(true);
  };

  const pct      = timeLimit > 0 ? (timeLeft / timeLimit) : 1;
  const mins     = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs     = String(timeLeft % 60).padStart(2, "0");
  const timerClr = timeLeft <= 20 ? "#EF4444" : timeLeft <= 60 ? "#F59E0B" : "#E85D04";
  const R = 26, CIRC = 2 * Math.PI * R;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg,#0F0A1E,#1a0a2e)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/8">
        <div className="flex items-center gap-3">
          <span className="text-xl">{festival.emoji}</span>
          <div>
            <h1 className="text-sm font-bold text-white">Symmetry Challenge</h1>
            <p className="text-xs text-white/40">{festival.name} · {chosenAxes}-axis mirror · 5 min</p>
          </div>
        </div>
        {started && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">{tiles.length} tiles</span>
            {/* Compact timer */}
            <div className="relative w-14 h-14">
              <svg viewBox="0 0 60 60" width={56} height={56}>
                <circle cx={30} cy={30} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4} />
                <circle cx={30} cy={30} r={R} fill="none" stroke={timerClr} strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray={`${CIRC * pct} ${CIRC}`}
                  strokeDashoffset={CIRC * 0.25}
                  style={{ transition: "stroke-dasharray 1s linear", filter: `drop-shadow(0 0 5px ${timerClr}66)` }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold tabular-nums" style={{ color: timerClr }}>{mins}:{secs}</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-44 flex-shrink-0 flex flex-col gap-3 p-3 border-r border-white/8 overflow-y-auto">
          {/* Live stats when active */}
          {started && (
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "Tiles",   value: tiles.length,              color: "#00BCD4" },
                { label: "Shapes",  value: new Set(tiles.map(t=>t.shapeId)).size, color: "#FF9800" },
                { label: "Colours", value: new Set(tiles.map(t=>t.color)).size,   color: "#E91E63" },
                { label: "Streak",  value: streak,                    color: "#4CAF50" },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-2 text-center">
                  <div className="text-base font-bold tabular-nums" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          <CanvasToolbar />

          {/* End early button */}
          {started && phase === GAME_PHASES.ACTIVE && (
            <button onClick={endGame}
              className="w-full py-2 rounded-xl text-xs font-bold text-white/60
                         border border-white/15 hover:border-white/30 hover:text-white transition-all">
              Finish early
            </button>
          )}
        </aside>

        {/* Canvas */}
        <main className="flex-1 flex items-center justify-center p-4 min-w-0 relative">
          {!started ? (
            <AxisPickerCard festival={festival} onStart={handleStart} />
          ) : (
            <>
              <div className="w-full max-w-[min(100%,calc(100vh-140px))] aspect-square"
                style={{ filter: `drop-shadow(0 0 40px ${festival.glowColor})` }}>
                <RangolicCanvas glowColor={festival.glowColor} />
              </div>

              {/* Milestone flash */}
              <AnimatePresence>
                {milestone && (
                  <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
                    initial={{ opacity: 0, y: 16, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0,  scale: 1 }}
                    exit={{   opacity: 0, y: -16, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  >
                    <div className="bg-black/70 backdrop-blur-sm border border-white/20
                                    rounded-2xl px-6 py-3 text-center"
                         style={{ boxShadow: `0 0 24px ${festival.glowColor}` }}>
                      <p className="text-base font-bold text-white">{milestone}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </main>

        {/* Right sidebar */}
        <aside className="w-48 flex-shrink-0 flex flex-col gap-3 p-3 border-l border-white/8 overflow-y-auto">
          <TilePicker />
          <ColorPalette festivalColors={festival.palette} />
          {/* Milestone tracker */}
          {started && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Goals</p>
              <div className="space-y-1.5">
                {MILESTONES.map(m => (
                  <div key={m.tiles} className="flex items-center gap-2">
                    <span className={`text-sm ${hitMilestones.has(m.tiles) ? "" : "opacity-30"}`}>
                      {hitMilestones.has(m.tiles) ? "✓" : "○"}
                    </span>
                    <span className={`text-xs ${hitMilestones.has(m.tiles) ? "text-white/70" : "text-white/25"}`}>
                      {m.tiles} tiles · +{m.xpBonus}XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {showBadge && (
        <FestivalBadge festival={festival} score={finalScore}
          onClose={() => { setShowBadge(false); clear(); setStarted(false); }} />
      )}
    </div>
  );
}

// ── Axis picker start screen ──────────────────────────────────────────────────
function AxisPickerCard({ festival, onStart }) {
  const [chosen, setChosen] = useState(8);
  const options = [
    { axes: 4,  label: "4-axis",  icon: "✚", desc: "Classic lotus" },
    { axes: 6,  label: "6-axis",  icon: "✶", desc: "Star of David" },
    { axes: 8,  label: "8-axis",  icon: "✳", desc: "Diya pattern"  },
    { axes: 12, label: "12-axis", icon: "❊", desc: "Pookalam"      },
  ];
  return (
    <div className="text-center max-w-sm w-full">
      <div className="text-7xl mb-4">{festival.emoji}</div>
      <h2 className="text-2xl font-bold text-white mb-1">Symmetry Challenge</h2>
      <p className="text-white/40 text-sm mb-6">
        Every tile you place is mirrored in real time.<br/>
        You have 5 minutes — make it beautiful.
      </p>

      <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Choose symmetry</p>
      <div className="grid grid-cols-2 gap-2 mb-6">
        {options.map(o => (
          <button key={o.axes} onClick={() => setChosen(o.axes)}
            className={`p-3 rounded-2xl border text-left transition-all
              ${chosen === o.axes
                ? "border-saffron/60 bg-saffron/15"
                : "border-white/10 bg-white/5 hover:bg-white/10"}`}>
            <div className="text-2xl mb-1">{o.icon}</div>
            <div className="text-sm font-bold text-white">{o.label}</div>
            <div className="text-xs text-white/40">{o.desc}</div>
          </button>
        ))}
      </div>

      <button onClick={() => onStart(chosen)}
        className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all active:scale-95"
        style={{
          background: `linear-gradient(135deg,${festival.accentColor},${festival.accentColor}88)`,
          boxShadow:  `0 8px 32px ${festival.glowColor}`,
        }}>
        Start Challenge ✳
      </button>
    </div>
  );
}
