// components/ui/ScoreHUD.jsx
import useGameStore from "../../store/gameStore";

export default function ScoreHUD() {
  const { score, accuracy, streak, bestStreak, tilesPlaced, mode } = useGameStore();

  const stats = [
    { label: "Score",     value: score.toLocaleString(), color: "#FFD700" },
    { label: "Accuracy",  value: `${accuracy}%`,         color: "#4CAF50" },
    { label: "Streak",    value: streak,                  color: "#FF6B00" },
    { label: "Tiles",     value: tilesPlaced,             color: "#00BCD4" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map(s => (
        <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl px-3 py-2 text-center">
          <div className="text-lg font-bold tabular-nums" style={{ color: s.color }}>
            {s.value}
          </div>
          <div className="text-xs text-white/40">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
