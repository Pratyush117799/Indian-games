// src/components/modes/FestivalMode.jsx
import { useEffect, useState } from "react";
import RangolicCanvas  from "../canvas/RangolicCanvas";
import CanvasToolbar   from "../canvas/CanvasToolbar";
import TilePicker      from "../tiles/TilePicker";
import ColorPalette    from "../tiles/ColorPalette";
import CountdownTimer  from "../timer/CountdownTimer";
import ScoreHUD        from "../ui/ScoreHUD";
import FestivalBadge   from "../ui/FestivalBadge";
import XPToast, { showXPToast } from "../ui/XPToast";
import useCanvasStore  from "../../store/canvasStore";
import useGameStore    from "../../store/gameStore";
import { getFestival } from "../../data/festivals";
import { GAME_MODES, GAME_PHASES } from "../../utils/constants";
import { calculateScore, calculateXP } from "../../utils/scoreCalculator";
import { gameAPI }     from "../../utils/apiClient";
import { exportCanvasSVG } from "../../utils/svgExporter";

export default function FestivalMode({ festivalId = "diwali", difficulty = "easy" }) {
  const festival = getFestival(festivalId);
  const diff     = festival.difficulties.find(d => d.id === difficulty) || festival.difficulties[0];

  const {
    setMode, setFestival, setTimeLimit, startGame, finishGame,
    phase, timeLeft, timeLimit, streak, tilesPlaced, updateScore,
  } = useGameStore();

  const { tiles, clear } = useCanvasStore();
  const [showBadge,  setShowBadge]  = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [started,    setStarted]    = useState(false);
  const [submitted,  setSubmitted]  = useState(false);

  useEffect(() => {
    setMode(GAME_MODES.FESTIVAL);
    setFestival(festivalId);
    setTimeLimit(diff.timeMin * 60);
    clear();
  }, [festivalId, difficulty]);

  // Live score update while playing
  useEffect(() => {
    if (phase !== GAME_PHASES.ACTIVE) return;
    const result = calculateScore({
      accuracy:  Math.min(100, tiles.length * 2),
      timeLeft,
      totalTime: timeLimit,
      streak,
      completed: false,
    });
    updateScore(result.total);
  }, [tiles.length, timeLeft, phase]);

  // Game ended (timer ran out)
  useEffect(() => {
    if (phase === GAME_PHASES.FINISHED && started && !submitted) {
      doFinish();
    }
  }, [phase]);

  const doFinish = async () => {
    setSubmitted(true);
    const completed = tiles.length >= 20;
    const result = calculateScore({
      accuracy:  Math.min(100, tiles.length * 2),
      timeLeft:  useGameStore.getState().timeLeft,
      totalTime: timeLimit,
      streak,
      completed,
    });
    const xp = calculateXP({ score: result.total, mode: "festival", festival: festivalId });

    setFinalScore(result.total);
    finishGame(result.total);
    showXPToast(xp, `${festival.name} complete!`);
    setShowBadge(true);

    // Submit to backend (non-blocking)
    try {
      await gameAPI.submit({
        mode:        "festival",
        festival:    festivalId,
        difficulty,
        tiles,
        timeLeft:    useGameStore.getState().timeLeft,
        totalTime:   timeLimit,
        bestStreak:  streak,
        tilesPlaced: tiles.length,
        completed,
      });
    } catch { /* backend offline — silently skip */ }
  };

  return (
    <div className="min-h-screen flex flex-col"
         style={{ background: "linear-gradient(135deg,#0F0A1E,#1a0a2e)" }}>
      <XPToast />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{festival.emoji}</span>
          <div>
            <h1 className="text-base font-bold text-white">{festival.name}</h1>
            <p className="text-xs text-white/40">{diff.label} · {diff.timeMin}–{diff.timeMax} min</p>
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ fontSize: 14, color: i < diff.stars ? festival.accentColor : "rgba(255,255,255,0.15)" }}>★</span>
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-44 flex-shrink-0 p-3 flex flex-col gap-3 border-r border-white/8 overflow-y-auto">
          {started && phase === GAME_PHASES.ACTIVE && (
            <>
              <CountdownTimer />
              <ScoreHUD />
              <div className="border-t border-white/10" />
            </>
          )}
          <CanvasToolbar onExport={() => exportCanvasSVG(`${festivalId}-rangoli.svg`)} />
          {started && phase === GAME_PHASES.ACTIVE && (
            <button onClick={doFinish}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white
                         bg-green-600 hover:bg-green-500 transition-all active:scale-95">
              ✓ Finish Early
            </button>
          )}
        </aside>

        {/* Canvas */}
        <main className="flex-1 flex items-center justify-center p-4 min-w-0">
          {!started ? (
            <StartCard festival={festival} diff={diff} onStart={() => { startGame(); setStarted(true); }} />
          ) : (
            <div className="w-full max-w-[min(100%,calc(100vh-140px))] aspect-square"
                 style={{ filter: `drop-shadow(0 0 40px ${festival.glowColor})` }}>
              <RangolicCanvas glowColor={festival.glowColor} />
            </div>
          )}
        </main>

        {/* Right sidebar */}
        <aside className="w-48 flex-shrink-0 p-3 flex flex-col gap-3 border-l border-white/8 overflow-y-auto">
          <TilePicker />
          <ColorPalette festivalColors={festival.palette} />
        </aside>
      </div>

      {showBadge && (
        <FestivalBadge
          festival={festival}
          score={finalScore}
          onClose={() => { setShowBadge(false); clear(); setStarted(false); setSubmitted(false); }}
        />
      )}
    </div>
  );
}

function StartCard({ festival, diff, onStart }) {
  return (
    <div className="text-center max-w-xs">
      <div className="text-8xl mb-4" style={{ filter: "drop-shadow(0 0 30px rgba(255,200,0,0.5))" }}>
        {festival.emoji}
      </div>
      <h2 className="text-2xl font-bold text-white mb-1">{festival.name} Rangoli</h2>
      <p className="text-white/50 text-sm mb-2">{festival.style}</p>
      <p className="text-white/30 text-xs mb-6 font-display italic">{festival.hindiName}</p>
      <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left space-y-2">
        {[
          ["Difficulty",  diff.label],
          ["Time limit",  `${diff.timeMin}–${diff.timeMax} min`],
          ["Symmetry",    "8-axis (adjustable)"],
          ["Scoring",     "Accuracy + Speed + Streak"],
        ].map(([l, v]) => (
          <div key={l} className="flex items-center justify-between text-sm">
            <span className="text-white/40">{l}</span>
            <span className="text-white/80 font-medium">{v}</span>
          </div>
        ))}
      </div>
      <button onClick={onStart}
        className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all active:scale-95 shadow-xl"
        style={{
          background: `linear-gradient(135deg,${festival.accentColor},${festival.accentColor}88)`,
          boxShadow:  `0 8px 32px ${festival.glowColor}`,
        }}>
        Start Building 🎨
      </button>
    </div>
  );
}
