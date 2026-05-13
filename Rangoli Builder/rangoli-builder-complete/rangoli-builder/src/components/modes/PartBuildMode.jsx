// src/components/modes/PartBuildMode.jsx
/**
 * Part-Build Mechanic — for large/Expert rangoli (Diwali Expert, Navratri Hard, Onam Hard).
 *
 * How it works:
 *   1. Player sees the FULL target rangoli for 5 seconds ("Preview" phase)
 *   2. Canvas clears — player builds Part 1 within a sub-timer
 *   3. Part 1 submitted → brief show of combined progress → build Part 2
 *   4. Repeat for all parts
 *   5. Final score = average accuracy × speed multiplier
 */
import { useEffect, useState, useCallback } from "react";
import RangolicCanvas  from "../canvas/RangolicCanvas";
import CanvasToolbar   from "../canvas/CanvasToolbar";
import TilePicker      from "../tiles/TilePicker";
import ColorPalette    from "../tiles/ColorPalette";
import FestivalBadge   from "../ui/FestivalBadge";
import useCanvasStore  from "../../store/canvasStore";
import useGameStore    from "../../store/gameStore";
import { getFestival } from "../../data/festivals";
import { GAME_PHASES } from "../../utils/constants";
import { calculateScore } from "../../utils/scoreCalculator";

const PREVIEW_SECONDS = 5;

export default function PartBuildMode({ festivalId = "diwali", difficulty = "expert",
                                        parts = 3, timePerPart = 300 }) {
  const festival = getFestival(festivalId);
  const diff     = festival.difficulties.find(d => d.id === difficulty) || festival.difficulties.at(-1);

  const { startGame, finishGame, setTimeLimit, phase } = useGameStore();
  const { tiles, clear, loadPattern }                  = useCanvasStore();

  const [stage,       setStage]       = useState("idle");    // idle|preview|building|interlude|done
  const [currentPart, setCurrentPart] = useState(1);
  const [previewLeft, setPreviewLeft] = useState(PREVIEW_SECONDS);
  const [partTimer,   setPartTimer]   = useState(timePerPart);
  const [partTimerId, setPartTimerId] = useState(null);
  const [scores,      setScores]      = useState([]);        // accuracy per part
  const [allTiles,    setAllTiles]    = useState([]);        // accumulated tiles across parts
  const [showBadge,   setShowBadge]   = useState(false);
  const [finalScore,  setFinalScore]  = useState(0);

  // ── Preview countdown ──────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== "preview") return;
    if (previewLeft <= 0) {
      setStage("building");
      clear();
      startPartTimer();
      return;
    }
    const id = setTimeout(() => setPreviewLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [stage, previewLeft]);

  // ── Start part timer ───────────────────────────────────────────────────
  const startPartTimer = useCallback(() => {
    setPartTimer(timePerPart);
    const id = setInterval(() => {
      setPartTimer(t => {
        if (t <= 1) {
          clearInterval(id);
          submitPart(true); // forced submit on timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setPartTimerId(id);
  }, [timePerPart]);

  const submitPart = useCallback((timeout = false) => {
    clearInterval(partTimerId);
    const currentTiles = useCanvasStore.getState().tiles;
    const accuracy = Math.min(100, currentTiles.length * 3); // simplified
    setScores(s => [...s, accuracy]);
    setAllTiles(prev => [...prev, ...currentTiles]);

    if (currentPart >= parts) {
      endGame([...scores, accuracy]);
    } else {
      setStage("interlude");
      // Show combined progress for 3s then move to next part
      loadPattern([...allTiles, ...currentTiles]); // show all placed so far
      setTimeout(() => {
        setCurrentPart(p => p + 1);
        clear();
        setStage("building");
        startPartTimer();
      }, 3000);
    }
  }, [partTimerId, currentPart, parts, scores, allTiles]);

  const endGame = (allScores) => {
    const avgAccuracy = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    const result = calculateScore({
      accuracy:  Math.round(avgAccuracy),
      timeLeft:  partTimer,
      totalTime: timePerPart,
      streak:    0,
      completed: currentPart >= parts,
    });
    setFinalScore(result.total);
    finishGame(result.total);
    setStage("done");
    setShowBadge(true);
  };

  const handleBegin = () => {
    setStage("preview");
    setPreviewLeft(PREVIEW_SECONDS);
    startGame();
  };

  const partPct = timePerPart > 0 ? partTimer / timePerPart : 1;
  const timerColor = partTimer <= 30 ? "#EF4444" : partTimer <= 60 ? "#F59E0B" : "#E85D04";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg,#0F0A1E,#1a0a2e)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/8">
        <div className="flex items-center gap-3">
          <span className="text-xl">{festival.emoji}</span>
          <div>
            <h1 className="text-sm font-bold text-white">{festival.name} — {diff?.label}</h1>
            <p className="text-xs text-white/40">
              Part {currentPart} of {parts}
              {stage === "preview" && " · Memorise!"}
              {stage === "building" && " · Build now!"}
              {stage === "interlude" && " · Nice! Next part loading…"}
            </p>
          </div>
        </div>

        {/* Part progress dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: parts }, (_, i) => (
            <div key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i < currentPart - 1 ? "bg-green-500" :
                i === currentPart - 1 ? "bg-saffron scale-125" :
                "bg-white/15"
              }`}
            />
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <aside className="w-44 flex-shrink-0 flex flex-col gap-3 p-3 border-r border-white/8 overflow-y-auto">

          {/* Part timer */}
          {stage === "building" && (
            <div className="flex flex-col items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-3">
              <svg viewBox="0 0 64 64" width={72} height={72}>
                <circle cx={32} cy={32} r={27} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
                <circle cx={32} cy={32} r={27} fill="none" stroke={timerColor} strokeWidth={5}
                  strokeDasharray={`${partPct * 2 * Math.PI * 27} ${2 * Math.PI * 27}`}
                  strokeDashoffset={2 * Math.PI * 27 * 0.25}
                  style={{ transition: "stroke-dasharray 1s linear", filter: `drop-shadow(0 0 5px ${timerColor}88)` }}
                />
              </svg>
              <span className="text-lg font-bold tabular-nums" style={{ color: timerColor }}>
                {String(Math.floor(partTimer/60)).padStart(2,"0")}:{String(partTimer%60).padStart(2,"0")}
              </span>
              <p className="text-xs text-white/40">Part {currentPart} timer</p>
            </div>
          )}

          {/* Preview countdown overlay */}
          {stage === "preview" && (
            <div className="flex flex-col items-center justify-center bg-amber-500/10
                            border border-amber-500/30 rounded-2xl p-4 text-center">
              <p className="text-3xl font-black text-amber-400">{previewLeft}</p>
              <p className="text-xs text-amber-400/70 mt-1">Memorise!</p>
            </div>
          )}

          <CanvasToolbar />

          {stage === "building" && (
            <button onClick={() => submitPart(false)}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white
                         bg-green-600 hover:bg-green-500 transition-all active:scale-95">
              Submit Part {currentPart} ✓
            </button>
          )}
        </aside>

        {/* Canvas */}
        <main className="flex-1 flex items-center justify-center p-4 min-w-0">
          {stage === "idle" ? (
            <StartCard festival={festival} diff={diff} parts={parts}
                       timePerPart={timePerPart} onStart={handleBegin} />
          ) : (
            <div className="w-full max-w-[min(100%,calc(100vh-140px))] aspect-square relative"
                 style={{ filter: `drop-shadow(0 0 40px ${festival.glowColor})` }}>
              <RangolicCanvas glowColor={festival.glowColor} readonly={stage === "preview" || stage === "interlude"} />

              {/* Preview overlay */}
              {stage === "preview" && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
                     style={{ background: "rgba(0,0,0,0.15)", backdropFilter: "blur(0.5px)" }}>
                  <div className="text-center">
                    <p className="text-4xl font-black text-amber-400" style={{ textShadow: "0 0 20px #F59E0B" }}>
                      {previewLeft}
                    </p>
                    <p className="text-white/60 text-sm mt-1">Memorise the pattern!</p>
                  </div>
                </div>
              )}

              {/* Interlude overlay */}
              {stage === "interlude" && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
                     style={{ background: "rgba(0,0,0,0.4)" }}>
                  <div className="text-center">
                    <p className="text-3xl mb-2">✨</p>
                    <p className="text-white font-bold">Part {currentPart - 1} done!</p>
                    <p className="text-white/50 text-sm">Loading Part {currentPart}…</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right sidebar */}
        <aside className="w-48 flex-shrink-0 flex flex-col gap-3 p-3 border-l border-white/8 overflow-y-auto">
          <TilePicker />
          <ColorPalette festivalColors={festival.palette} />
          {/* Parts score summary */}
          {scores.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Part Scores</p>
              {scores.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/50">Part {i + 1}</span>
                  <span className="font-bold" style={{ color: s >= 70 ? "#4CAF50" : "#FF9800" }}>
                    {s}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {showBadge && (
        <FestivalBadge
          festival={festival}
          score={finalScore}
          onClose={() => { setShowBadge(false); clear(); }}
        />
      )}
    </div>
  );
}

function StartCard({ festival, diff, parts, timePerPart, onStart }) {
  return (
    <div className="text-center max-w-xs">
      <div className="text-7xl mb-3">{festival.emoji}</div>
      <h2 className="text-2xl font-bold text-white mb-1">{festival.name}</h2>
      <p className="text-white/40 text-sm mb-6">{diff?.label} · Part Build Challenge</p>
      <div className="bg-white/5 rounded-2xl p-4 mb-6 space-y-2">
        {[
          ["Parts",        `${parts} sequential sections`],
          ["Time / Part",  `${Math.round(timePerPart/60)} minutes each`],
          ["Preview",      `${PREVIEW_SECONDS}s to memorise each part`],
          ["Scoring",      "Average accuracy × speed"],
        ].map(([l, v]) => (
          <div key={l} className="flex items-center justify-between text-sm">
            <span className="text-white/40">{l}</span>
            <span className="text-white/80 font-medium">{v}</span>
          </div>
        ))}
      </div>
      <button onClick={onStart}
        className="w-full py-4 rounded-2xl font-bold text-white text-lg active:scale-95"
        style={{ background: `linear-gradient(135deg,${festival.accentColor},${festival.accentColor}88)`,
                 boxShadow: `0 8px 32px ${festival.glowColor}` }}>
        Begin Challenge 🏆
      </button>
    </div>
  );
}
