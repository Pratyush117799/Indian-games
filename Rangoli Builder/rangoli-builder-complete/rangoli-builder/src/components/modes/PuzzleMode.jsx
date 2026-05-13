// src/components/modes/PuzzleMode.jsx
import { useEffect, useState } from "react";
import { useNavigate }          from "react-router-dom";
import RangolicCanvas  from "../canvas/RangolicCanvas";
import CanvasToolbar   from "../canvas/CanvasToolbar";
import TilePicker      from "../tiles/TilePicker";
import ColorPalette    from "../tiles/ColorPalette";
import CountdownTimer  from "../timer/CountdownTimer";
import FestivalBadge   from "../ui/FestivalBadge";
import useCanvasStore  from "../../store/canvasStore";
import useGameStore    from "../../store/gameStore";
import { getFestival } from "../../data/festivals";
import { GAME_MODES, GAME_PHASES } from "../../utils/constants";
import { calculateScore }          from "../../utils/scoreCalculator";
import usePuzzleValidator          from "../../hooks/usePuzzleValidator";
import { exportCanvasSVG }         from "../../utils/svgExporter";
import { patternAPI, gameAPI }     from "../../utils/apiClient";

// ── Accuracy ring component ────────────────────────────────────────────────
function AccuracyRing({ pct, color }) {
  const R = 26, C = 2 * Math.PI * R;
  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg viewBox="0 0 60 60" width={64} height={64}>
        <circle cx={30} cy={30} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
        <circle cx={30} cy={30} r={R} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${(pct/100)*C} ${C}`}
          strokeDashoffset={C * 0.25}
          style={{ transition: "stroke-dasharray 0.4s ease", filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{pct}%</span>
      </div>
    </div>
  );
}

export default function PuzzleMode({ festivalId = "diwali", patternId = null }) {
  const navigate  = useNavigate();
  const festival  = getFestival(festivalId);
  const { setMode, setFestival, setPattern, setTimeLimit,
          startGame, finishGame, phase, timeLeft, timeLimit,
          streak }  = useGameStore();
  const { tiles, loadPattern, clear } = useCanvasStore();
  const validator = usePuzzleValidator();

  const [started,     setStarted]     = useState(false);
  const [targetData,  setTargetData]  = useState(null);
  const [showBadge,   setShowBadge]   = useState(false);
  const [finalScore,  setFinalScore]  = useState(0);
  const [loadErr,     setLoadErr]     = useState("");
  const [feedbacks,   setFeedbacks]   = useState([]); // "correct"/"wrong" flash messages

  // ── Load pattern ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!patternId) return;
    patternAPI.get(patternId)
      .then(({ data }) => {
        setTargetData(data);
        setPattern(data);
        setTimeLimit(data.estimatedTime || 600);
        // Pre-load the "revealed" portion (tiles NOT in hiddenTileIndices)
        const shown = data.tiles.filter((_, i) => !data.hiddenTileIndices?.includes(i));
        loadPattern(shown);
      })
      .catch(() => setLoadErr("Could not load pattern"));
  }, [patternId]);

  const handleStart = () => {
    setMode(GAME_MODES.PUZZLE);
    setFestival(festivalId);
    startGame();
    setStarted(true);
  };

  // Auto-finish when accuracy hits 100%
  useEffect(() => {
    if (validator.accuracy >= 100 && started && phase === GAME_PHASES.ACTIVE) {
      handleFinish(true);
    }
  }, [validator.accuracy]);

  // Timer expired
  useEffect(() => {
    if (phase === GAME_PHASES.FINISHED && started) doFinish();
  }, [phase]);

  const handleFinish = (completed = false) => {
    const result = calculateScore({
      accuracy:  validator.accuracy,
      timeLeft,
      totalTime: timeLimit,
      streak,
      completed,
    });
    setFinalScore(result.total);
    finishGame(result.total);
    doFinish(result.total);
  };

  const doFinish = async (score) => {
    setShowBadge(true);
    try {
      await gameAPI.submit({
        mode: "puzzle", festival: festivalId, patternId,
        tiles, timeLeft, totalTime: timeLimit,
        bestStreak: streak, tilesPlaced: tiles.length,
        completed: validator.accuracy >= 100,
      });
    } catch { /* non-critical */ }
  };

  const accuracyColor = validator.accuracy >= 80 ? "#4CAF50"
                       : validator.accuracy >= 50 ? "#FF9800"
                       : "#EF4444";

  if (loadErr) return (
    <div className="min-h-screen flex items-center justify-center bg-rangoli-bg">
      <div className="text-center">
        <p className="text-red-400 mb-4">{loadErr}</p>
        <button onClick={() => navigate("/")} className="text-saffron hover:underline">← Home</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg,#0F0A1E,#1a0a2e)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/8">
        <div className="flex items-center gap-3">
          <span className="text-xl">{festival.emoji}</span>
          <div>
            <h1 className="text-sm font-bold text-white">{targetData?.title || festival.name + " Puzzle"}</h1>
            <p className="text-xs text-white/40">Puzzle Mode · Complete the pattern</p>
          </div>
        </div>
        {started && (
          <div className="flex items-center gap-4">
            <AccuracyRing pct={validator.accuracy} color={accuracyColor} />
            <div className="text-right">
              <p className="text-xs text-white/40">Matched</p>
              <p className="text-sm font-bold text-white">
                {validator.matched}/{validator.total}
              </p>
            </div>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-44 flex-shrink-0 flex flex-col gap-3 p-3 border-r border-white/8 overflow-y-auto">
          {started && <CountdownTimer />}

          {/* Accuracy bar */}
          {started && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <AccuracyRing pct={validator.accuracy} color={accuracyColor} />
              <p className="text-xs text-white/40 mt-1">Accuracy</p>
              <p className="text-xs text-white/30 mt-0.5">
                {validator.matched}/{validator.total} tiles
              </p>
            </div>
          )}

          <CanvasToolbar onExport={() => exportCanvasSVG(`puzzle-${festivalId}.svg`)} />

          {started && (
            <button onClick={() => handleFinish(false)}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white
                         bg-green-600 hover:bg-green-500 transition-all active:scale-95">
              ✓ Submit
            </button>
          )}
        </aside>

        {/* Canvas */}
        <main className="flex-1 flex items-center justify-center p-4 min-w-0 relative">
          {!started ? (
            <PuzzleStartCard
              festival={festival}
              pattern={targetData}
              onStart={handleStart}
            />
          ) : (
            <>
              <div className="w-full max-w-[min(100%,calc(100vh-140px))] aspect-square"
                   style={{ filter: `drop-shadow(0 0 40px ${festival.glowColor})` }}>
                <RangolicCanvas glowColor={festival.glowColor} />
              </div>
              {/* Floating hint: tap revealed tiles to see target shape */}
              {validator.accuracy < 10 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2
                                bg-black/60 backdrop-blur-sm border border-white/15
                                rounded-xl px-4 py-2 text-xs text-white/60 pointer-events-none">
                  💡 Place tiles to match the hidden pattern — use symmetry!
                </div>
              )}
            </>
          )}
        </main>

        {/* Right sidebar */}
        <aside className="w-48 flex-shrink-0 flex flex-col gap-3 p-3 border-l border-white/8 overflow-y-auto">
          <TilePicker />
          <ColorPalette festivalColors={festival.palette} />

          {/* Hint box */}
          {started && targetData && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Hint</p>
              <p className="text-xs text-white/60 leading-relaxed">
                {targetData.symmetryAxes}-axis symmetry.
                Place a tile and {targetData.symmetryAxes} copies appear instantly.
              </p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {festival.palette.slice(0, 4).map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-white/20"
                       style={{ background: c }} title={c} />
                ))}
                <span className="text-xs text-white/30 self-center ml-1">use these</span>
              </div>
            </div>
          )}
        </aside>
      </div>

      {showBadge && (
        <FestivalBadge
          festival={festival}
          score={finalScore}
          onClose={() => { setShowBadge(false); clear(); setStarted(false); navigate("/"); }}
        />
      )}
    </div>
  );
}

function PuzzleStartCard({ festival, pattern, onStart }) {
  return (
    <div className="text-center max-w-xs">
      <div className="text-7xl mb-4">{festival.emoji}</div>
      <h2 className="text-2xl font-bold text-white mb-1">
        {pattern?.title || "Festival Puzzle"}
      </h2>
      <p className="text-white/40 text-sm mb-6">{festival.tagline}</p>
      <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left space-y-2">
        <Row label="Tiles to place" value={pattern ? `${Math.round(pattern.tiles?.length * 0.5)} hidden` : "—"} />
        <Row label="Symmetry"       value={`${pattern?.symmetryAxes || 8}-axis`} />
        <Row label="Hint"           value="Use the revealed tiles as guides" />
      </div>
      <button onClick={onStart}
        className="w-full py-4 rounded-2xl font-bold text-white text-lg active:scale-95"
        style={{ background: `linear-gradient(135deg,${festival.accentColor},${festival.accentColor}88)`,
                 boxShadow: `0 8px 32px ${festival.glowColor}` }}>
        Start Puzzle 🧩
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/40">{label}</span>
      <span className="text-white/80 font-medium">{value}</span>
    </div>
  );
}
