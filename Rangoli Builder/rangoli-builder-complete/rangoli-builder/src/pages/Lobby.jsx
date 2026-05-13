// src/pages/Lobby.jsx
import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { ArrowLeft, Plus, LogIn, Users, Wifi, WifiOff } from "lucide-react";
import useSocket      from "../hooks/useSocket";
import useRoomStore   from "../store/roomStore";
import { FESTIVALS }  from "../data/festivals";

export default function Lobby() {
  const navigate          = useNavigate();
  const { emit, on, connected } = useSocket();
  const { setRoom, reset }      = useRoomStore();

  const [rooms,     setRooms]     = useState([]);
  const [joinCode,  setJoinCode]  = useState("");
  const [creating,  setCreating]  = useState(false);
  const [error,     setError]     = useState("");

  // Create room form state
  const [newRoom, setNewRoom] = useState({
    festival:   "diwali",
    mode:       "headtohead",
    difficulty: "easy",
    timeLimit:  600,
    maxPlayers: 2,
  });

  // Subscribe to socket events
  useEffect(() => {
    const offList    = on("room:list",    setRooms);
    const offCreated = on("room:created", ({ roomCode, room }) => {
      // Derive a userId from localStorage (or "guest")
      const uid = localStorage.getItem("userId") || "guest";
      setRoom(room, uid);
      navigate(`/room/${roomCode}`);
    });
    const offUpdated = on("room:updated", (room) => {
      const uid = localStorage.getItem("userId") || "guest";
      setRoom(room, uid);
      navigate(`/room/${room.roomCode}`);
    });
    const offError = on("room:error", ({ message }) => setError(message));

    // Browse on mount
    if (connected) emit("room:browse");

    return () => { offList(); offCreated(); offUpdated(); offError(); };
  }, [connected]);

  const handleCreate = () => {
    setError("");
    emit("room:create", newRoom);
  };

  const handleJoin = () => {
    if (joinCode.length < 4) return setError("Enter a valid room code");
    setError("");
    emit("room:join", { roomCode: joinCode.toUpperCase() });
  };

  const festival = (id) => FESTIVALS.find(f => f.id === id);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#0F0A1E,#1a0a2e)" }}>
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/8">
        <button onClick={() => navigate("/")} className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-white">Multiplayer Lobby</h1>
        <div className={`ml-auto flex items-center gap-1.5 text-xs ${connected ? "text-green-400" : "text-red-400"}`}>
          {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
          {connected ? "Connected" : "Disconnected"}
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Left: Create or Join ─────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Join by code */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-3 flex items-center gap-2">
              <LogIn size={16} className="text-saffron-light" /> Join a Room
            </h2>
            <div className="flex gap-2">
              <input
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="ROOM CODE"
                className="flex-1 bg-white/8 border border-white/15 rounded-xl px-4 py-2.5
                           text-white placeholder-white/30 text-sm font-mono tracking-widest
                           focus:outline-none focus:border-saffron/50"
              />
              <button
                onClick={handleJoin}
                disabled={!connected}
                className="px-5 py-2.5 bg-saffron hover:bg-saffron-dark text-white font-bold
                           rounded-xl transition-all active:scale-95 disabled:opacity-40"
              >
                Join
              </button>
            </div>
          </div>

          {/* Create room */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <button
              onClick={() => setCreating(v => !v)}
              className="w-full flex items-center justify-between font-bold text-white mb-1"
            >
              <span className="flex items-center gap-2">
                <Plus size={16} className="text-teal-light" /> Create a Room
              </span>
              <span className="text-white/30 text-sm">{creating ? "▲" : "▼"}</span>
            </button>

            {creating && (
              <div className="mt-4 space-y-3">
                <Select label="Festival" value={newRoom.festival}
                  onChange={v => setNewRoom(r => ({ ...r, festival: v }))}
                  options={FESTIVALS.map(f => ({ value: f.id, label: `${f.emoji} ${f.name}` }))} />

                <Select label="Mode" value={newRoom.mode}
                  onChange={v => setNewRoom(r => ({ ...r, mode: v }))}
                  options={[
                    { value: "headtohead",  label: "⚔️  Head-to-Head (race)" },
                    { value: "scoreattack", label: "🏆  Score Attack" },
                    { value: "coop",        label: "🤝  Co-op Build" },
                  ]} />

                <Select label="Difficulty" value={newRoom.difficulty}
                  onChange={v => setNewRoom(r => ({ ...r, difficulty: v }))}
                  options={[
                    { value: "easy",   label: "Easy ★" },
                    { value: "medium", label: "Medium ★★★" },
                    { value: "hard",   label: "Hard ★★★★★" },
                  ]} />

                <div>
                  <label className="text-xs text-white/40 mb-1 block">
                    Timer: {newRoom.timeLimit / 60} min
                  </label>
                  <input type="range" min={180} max={1200} step={60}
                    value={newRoom.timeLimit}
                    onChange={e => setNewRoom(r => ({ ...r, timeLimit: +e.target.value }))}
                    className="w-full accent-orange-500"
                  />
                </div>

                <button
                  onClick={handleCreate}
                  disabled={!connected}
                  className="w-full py-3 bg-teal hover:bg-teal-light text-white font-bold
                             rounded-xl transition-all active:scale-95 disabled:opacity-40"
                >
                  Create Room
                </button>
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20
                          rounded-xl px-4 py-2">{error}</p>
          )}
        </div>

        {/* ── Right: Open rooms ────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Users size={16} className="text-gold-light" /> Open Rooms
            </h2>
            <button onClick={() => emit("room:browse")} className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Refresh
            </button>
          </div>

          {rooms.length === 0 ? (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-8 text-center">
              <p className="text-white/30 text-sm">No open rooms yet</p>
              <p className="text-white/20 text-xs mt-1">Create one above!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rooms.map(r => {
                const fest = festival(r.festival);
                return (
                  <div key={r.roomCode}
                    className="flex items-center gap-3 bg-white/5 border border-white/10
                               rounded-xl px-4 py-3 hover:border-white/20 transition-all">
                    <span className="text-xl">{fest?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{r.roomCode}</p>
                      <p className="text-xs text-white/40 truncate">
                        {fest?.name} · {r.mode} · {r.difficulty}
                      </p>
                    </div>
                    <span className="text-xs text-white/30">
                      {r.players?.length}/{r.maxPlayers}
                    </span>
                    <button
                      onClick={() => { setJoinCode(r.roomCode); emit("room:join", { roomCode: r.roomCode }); }}
                      className="px-3 py-1.5 bg-saffron/20 hover:bg-saffron/40 text-saffron
                                 text-xs font-bold rounded-lg transition-all"
                    >
                      Join
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs text-white/40 mb-1 block">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white/8 border border-white/15 rounded-xl px-3 py-2.5
                   text-white text-sm focus:outline-none focus:border-saffron/50"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
