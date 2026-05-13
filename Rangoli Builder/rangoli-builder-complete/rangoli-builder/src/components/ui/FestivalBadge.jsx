// components/ui/FestivalBadge.jsx
export default function FestivalBadge({ festival, score, onClose }) {
  if (!festival) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="relative bg-gradient-to-br from-white/10 to-white/5
                   border border-white/20 rounded-3xl p-10 max-w-sm w-full mx-4
                   text-center shadow-2xl"
        style={{ boxShadow: `0 0 60px ${festival.glowColor || "rgba(232,93,4,0.4)"}` }}
      >
        {/* Emoji */}
        <div className="text-7xl mb-3" style={{ filter: "drop-shadow(0 0 20px rgba(255,200,0,0.6))" }}>
          {festival.emoji}
        </div>

        <p className="text-sm text-white/50 uppercase tracking-widest mb-1">
          {festival.tagline}
        </p>
        <h2 className="text-3xl font-bold text-white mb-1">{festival.name}</h2>
        <p className="text-sm text-white/40 font-display italic mb-6">{festival.hindiName}</p>

        {/* Score */}
        <div
          className="text-5xl font-bold mb-2 tabular-nums"
          style={{ color: festival.accentColor || "#FFD700", textShadow: "0 0 20px currentColor" }}
        >
          {score.toLocaleString()}
        </div>
        <p className="text-white/40 text-sm mb-8">points earned</p>

        {/* Stars */}
        <div className="flex justify-center gap-1 mb-8">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className="text-2xl transition-all"
              style={{
                color: i < Math.ceil(score / 2000) ? "#FFD700" : "rgba(255,255,255,0.15)",
                filter: i < Math.ceil(score / 2000) ? "drop-shadow(0 0 6px #FFD700)" : "none",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl font-bold text-white text-lg transition-all
                     active:scale-95 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${festival.accentColor || "#E85D04"}, ${festival.accentColor || "#FF6B00"}88)`,
          }}
        >
          Continue 🎨
        </button>
      </div>
    </div>
  );
}
