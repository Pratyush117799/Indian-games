// src/pages/GameRoom.jsx
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate }           from "react-router-dom";
import { ArrowLeft, CheckCircle, Circle, Crown } from "lucide-react";
import RangolicCanvas  from "../components/canvas/RangolicCanvas";
import CanvasToolbar   from "../components/canvas/CanvasToolbar";
import TilePicker      from "../components/tiles/TilePicker";
import ColorPalette    from "../components/tiles/ColorPalette";
import CountdownTimer  from "../components/timer/CountdownTimer";
import ScoreHUD        from "../components/ui/ScoreHUD";
import FestivalBadge   from "../components/ui/FestivalBadge";
import useSocket       from "../hooks/useSocket";
import useRoomStore    from "../store/roomStore";
import useCanvasStore  from "../store/canvasStore";
import useGameStore    from "../store/gameStore";
import { getFestival } from "../data/festivals";
import { GAME_PHASES } from "../utils/constants";

const QUICK_EMOJIS = ["👏","🔥","😍","🥳","💪","🌸"];
const MY_ID = () => localStorage.getItem("userId") || "guest";

export default function GameRoom() {
  const { roomCode }                  = useParams();
  const navigate                      = useNavigate();
  const { emit, on }                  = useSocket();
  const { room, players, messages, phase, countdown,
          results, setRoom, setPhase, setCountdown,
          addMessage, updatePlayerScore, setResults, reset } = useRoomStore();
  const { tiles, placeTile }          = useCanvasStore();
  const { startGame, finishGame, setTimeLimit, phase: gamePhase } = useGameStore();

  const [showBadge, setShowBadge]     = useState(false);
  const [chatInput, setChatInput]     = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const festival = room ? getFestival(room.festival) : getFestival("diwali");
  const isHost   = room?.hostId === MY_ID() || room?.hostId?._id === MY_ID();

  // ── Socket subscriptions ─────────────────────────────────────────────────
  useEffect(() => {
    // Join on mount
    emit("room:join", { roomCode });

    const subs = [
      on("room:updated",      (r)  => setRoom(r, MY_ID())),
      on("room:starting",     ({ countdown: c }) => setCountdown(c)),
      on("game:start",        ({ room: r }) => {
        setRoom(r, MY_ID());
        setTimeLimit(r.timeLimit || 600);
        startGame();
        setGameStarted(true);
        setCountdown(null);
        // Tell server to start the authoritative timer
        if (isHost) emit("game:start_timer", { roomCode });
      }),
      on("game:tick",         ({ timeLeft }) => useGameStore.setState({ timeLeft })),
      on("tile:placed",       ({ userId, tile }) => {
        if (userId !== MY_ID()) {
          // Render opponent's tile on our canvas (greyed out)
          useCanvasStore.getState().loadPattern([
            ...useCanvasStore.getState().tiles,
            { ...tile, color: tile.color + "88" }, // semi-transparent for opponent
          ]);
        }
      }),
      on("game:score_update", ({ userId, score }) => updatePlayerScore(userId, score)),
      on("game:player_finished", ({ username, rank }) => {
        addMessage({ userId: "system", username: "System",
                     message: `🏁 ${username} finished! (Rank #${rank})`, timestamp: Date.now() });
      }),
      on("game:ended",        ({ results }) => {
        setResults(results);
        finishGame(results.find(r => r.userId === MY_ID())?.score || 0);
        setShowBadge(true);
      }),
      on("chat:message",      (msg) => addMessage(msg)),
      on("chat:react",        ({ username, emoji }) =>
        addMessage({ userId: "system", username, message: `${emoji}`, timestamp: Date.now() })),
    ];

    return () => {
      subs.forEach(off => off());
      emit("room:leave", { roomCode });
      reset();
    };
  }, [roomCode]);

  // Sync my tile placements to opponent in real time
  const prevTileCount = useState(0);
  useEffect(() => {
    if (!gameStarted || tiles.length === 0) return;
    const latest = tiles.at(-1);
    if (latest) emit("tile:place", { roomCode, tile: latest });
  }, [tiles.length]);

  const handleReady = () => emit("room:ready", { roomCode });

  const handleFinish = () => {
    emit("game:finish", {
      roomCode,
      accuracy:    Math.min(100, tiles.length * 2),
      tilesPlaced: tiles.length,
      score:       useGameStore.getState().score,
    });
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    emit("chat:message", { roomCode, message: chatInput.trim() });
    setChatInput("");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg,#0F0A1E,#1a0a2e)" }}>
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-5 py-3 border-b border-white/8">
        <button onClick={() => navigate("/lobby")} className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </button>
        <span className="text-xl">{festival.emoji}</span>
        <div>
          <p className="text-sm font-bold text-white leading-none">{festival.name}</p>
          <p className="text-xs text-white/40 leading-none mt-0.5">
            {room?.mode || "headtohead"} · Room {roomCode}
          </p>
        </div>
        {/* Countdown badge */}
        {countdown !== null && (
          <div className="ml-auto text-4xl font-black"
               style={{ color: "#E85D04", textShadow: "0 0 20px #E85D04" }}>
            {countdown}
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left sidebar ────────────────────────────────────────── */}
        <aside className="w-44 flex-shrink-0 flex flex-col gap-3 p-3 border-r border-white/8 overflow-y-auto">
          {gameStarted && <CountdownTimer />}
          {gameStarted && <ScoreHUD />}
          <CanvasToolbar />
          {gameStarted && (
            <button
              onClick={handleFinish}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-white
                         bg-green-600 hover:bg-green-500 transition-all active:scale-95"
            >
              ✓ Finish
            </button>
          )}
        </aside>

        {/* ── Canvas ──────────────────────────────────────────────── */}
        <main className="flex-1 flex items-center justify-center p-4 min-w-0">
          {!gameStarted ? (
            <WaitingRoom
              players={players} isHost={isHost} roomCode={roomCode}
              room={room} festival={festival} onReady={handleReady}
            />
          ) : (
            <div className="w-full max-w-[min(100%,calc(100vh-160px))] aspect-square"
                 style={{ filter: `drop-shadow(0 0 40px ${festival.glowColor})` }}>
              <RangolicCanvas glowColor={festival.glowColor} />
            </div>
          )}
        </main>

        {/* ── Right sidebar: tile picker + chat ───────────────────── */}
        <aside className="w-48 flex-shrink-0 flex flex-col gap-2 p-3 border-l border-white/8 overflow-y-auto">
          <TilePicker />
          <ColorPalette festivalColors={festival.palette} />
          <ChatPanel
            messages={messages} input={chatInput}
            onInput={setChatInput} onSend={sendChat}
            onEmoji={(e) => emit("chat:react", { roomCode, emoji: e })}
          />
        </aside>
      </div>

      {/* End-game badge */}
      {showBadge && results && (
        <ResultsModal
          festival={festival} results={results} myId={MY_ID()}
          onClose={() => { setShowBadge(false); navigate("/"); }}
        />
      )}
    </div>
  );
}

// ── Waiting room before game starts ──────────────────────────────────────────
function WaitingRoom({ players, isHost, roomCode, room, festival, onReady }) {
  const myId = MY_ID();
  return (
    <div className="text-center max-w-sm w-full">
      <div className="text-6xl mb-3">{festival.emoji}</div>
      <h2 className="text-xl font-bold text-white mb-1">{festival.name}</h2>
      <p className="text-white/40 text-sm mb-1">{room?.mode} · {room?.difficulty}</p>
      <p className="text-xs font-mono text-white/30 mb-6">Room: <span className="text-saffron font-bold">{roomCode}</span></p>

      <div className="space-y-2 mb-6">
        {players.map(p => (
          <div key={p.userId?.toString()}
               className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
            {room?.hostId === p.userId?.toString() && <Crown size={14} className="text-gold-light flex-shrink-0" />}
            <span className="flex-1 text-sm text-white text-left">{p.username}</span>
            {p.ready
              ? <CheckCircle size={16} className="text-green-400" />
              : <Circle      size={16} className="text-white/20" />}
          </div>
        ))}
        {Array.from({ length: Math.max(0, (room?.maxPlayers || 2) - players.length) }, (_, i) => (
          <div key={`empty-${i}`}
               className="flex items-center justify-center bg-white/3 border border-white/8
                          border-dashed rounded-xl px-4 py-3 text-white/20 text-sm">
            Waiting for player…
          </div>
        ))}
      </div>

      <button
        onClick={onReady}
        className="w-full py-3 rounded-2xl font-bold text-white transition-all active:scale-95"
        style={{ background: `linear-gradient(135deg, ${festival.accentColor}, ${festival.accentColor}88)` }}
      >
        {players.find(p => p.userId?.toString() === myId)?.ready ? "✓ Ready!" : "Ready?"}
      </button>
      <p className="text-white/25 text-xs mt-3">Game starts when all players are ready</p>
    </div>
  );
}

// ── Chat panel ────────────────────────────────────────────────────────────────
function ChatPanel({ messages, input, onInput, onSend, onEmoji }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col gap-2">
      <p className="text-xs text-white/40 uppercase tracking-widest">Chat</p>
      <div className="h-28 overflow-y-auto space-y-1 text-xs">
        {messages.slice(-30).map((m, i) => (
          <p key={i} className="text-white/60 leading-snug">
            <span className="text-white/40">{m.username}: </span>
            {m.message}
          </p>
        ))}
        {messages.length === 0 && <p className="text-white/20 text-center mt-6">No messages yet</p>}
      </div>
      <div className="flex gap-1 flex-wrap">
        {QUICK_EMOJIS.map(e => (
          <button key={e} onClick={() => onEmoji(e)} className="text-base hover:scale-125 transition-transform">{e}</button>
        ))}
      </div>
      <div className="flex gap-1">
        <input
          value={input} onChange={e => onInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSend()}
          placeholder="Message…"
          className="flex-1 bg-white/8 border border-white/10 rounded-lg px-2 py-1.5
                     text-xs text-white placeholder-white/30 focus:outline-none"
        />
        <button onClick={onSend} className="px-2 py-1 text-xs bg-saffron/30 rounded-lg text-saffron hover:bg-saffron/50">↑</button>
      </div>
    </div>
  );
}

// ── End-game results modal ────────────────────────────────────────────────────
function ResultsModal({ festival, results, myId, onClose }) {
  const myResult = results.find(r => r.userId === myId);
  const iWon     = myResult?.rank === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white/8 border border-white/15 rounded-3xl p-8 max-w-sm w-full mx-4 text-center"
           style={{ boxShadow: `0 0 60px ${festival.glowColor}` }}>
        <div className="text-5xl mb-3">{iWon ? "🏆" : festival.emoji}</div>
        <h2 className="text-2xl font-bold text-white mb-1">
          {iWon ? "You Won!" : "Game Over"}
        </h2>
        <p className="text-white/40 text-sm mb-6">{festival.name} · {festival.tagline}</p>

        <div className="space-y-2 mb-6">
          {results.map((r, i) => (
            <div key={r.userId}
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl
                   ${r.userId === myId ? "bg-white/15 border border-white/20" : "bg-white/5"}`}>
              <span className="text-lg w-7 text-center">
                {["🥇","🥈","🥉","4️⃣"][i] || `${i+1}`}
              </span>
              <span className="flex-1 text-sm text-white text-left">{r.username}</span>
              <span className="text-sm font-bold tabular-nums" style={{ color: festival.accentColor }}>
                {(r.score || 0).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <button onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
          style={{ background: festival.accentColor }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
