// src/components/ui/DifficultyStars.jsx
export default function DifficultyStars({ stars = 1, max = 5, color = "#FFD700", size = 14 }) {
  return (
    <div className="flex gap-0.5 items-center">
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 14 14">
          <polygon
            points="7,1 8.8,5.3 13.4,5.6 10,8.6 11,13.1 7,10.6 3,13.1 4,8.6 0.6,5.6 5.2,5.3"
            fill={i < stars ? color : "rgba(255,255,255,0.12)"}
            style={{ filter: i < stars ? `drop-shadow(0 0 3px ${color}88)` : "none" }}
          />
        </svg>
      ))}
    </div>
  );
}
