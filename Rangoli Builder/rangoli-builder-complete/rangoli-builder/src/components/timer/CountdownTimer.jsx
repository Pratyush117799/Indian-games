// components/timer/CountdownTimer.jsx
import { useEffect, useRef } from "react";
import useGameStore from "../../store/gameStore";
import { GAME_PHASES } from "../../utils/constants";

export default function CountdownTimer() {
  const { timeLeft, timeLimit, timerActive, phase, tick, finishGame } = useGameStore();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerActive && phase === GAME_PHASES.ACTIVE) {
      intervalRef.current = setInterval(() => tick(), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive, phase, tick]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const pct  = timeLimit > 0 ? timeLeft / timeLimit : 1;
  const isWarning = timeLeft > 0 && timeLeft <= 60;
  const isDanger  = timeLeft > 0 && timeLeft <= 20;

  // SVG ring
  const RADIUS = 28;
  const CIRCUM = 2 * Math.PI * RADIUS;
  const dash   = CIRCUM * pct;

  const color = isDanger ? "#EF4444" : isWarning ? "#F59E0B" : "#E85D04";

  return (
    <div className={`flex flex-col items-center gap-1 ${isWarning ? "animate-pulse" : ""}`}>
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 72 72" width={80} height={80}>
          {/* Track */}
          <circle cx={36} cy={36} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
          {/* Progress ring */}
          <circle
            cx={36} cy={36} r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${CIRCUM}`}
            strokeDashoffset={CIRCUM * 0.25} // start at 12 o'clock
            style={{
              transition: "stroke-dasharray 1s linear, stroke 0.3s",
              filter: `drop-shadow(0 0 6px ${color}88)`,
            }}
          />
        </svg>
        {/* Time label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-lg font-bold leading-none tabular-nums"
            style={{ color, textShadow: isDanger ? `0 0 12px ${color}` : "none" }}
          >
            {mins}:{secs}
          </span>
        </div>
      </div>
      <p className="text-xs text-white/40">
        {isDanger ? "⚠️ Hurry!" : isWarning ? "⏰ Almost!" : "Time left"}
      </p>
    </div>
  );
}
