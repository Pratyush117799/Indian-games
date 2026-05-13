// src/hooks/useTimer.js
import { useEffect, useRef, useCallback } from "react";
import useGameStore from "../store/gameStore";
import { GAME_PHASES } from "../utils/constants";

export default function useTimer({ onExpire, onWarn, warnAt = 60 } = {}) {
  const { timeLeft, timeLimit, timerActive, phase, tick } = useGameStore();
  const intervalRef  = useRef(null);
  const warnFiredRef = useRef(false);

  useEffect(() => {
    if (timerActive && phase === GAME_PHASES.ACTIVE) {
      intervalRef.current = setInterval(() => tick(), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive, phase]);

  // Warn callback
  useEffect(() => {
    if (timeLeft <= warnAt && timeLeft > 0 && !warnFiredRef.current) {
      warnFiredRef.current = true;
      onWarn?.();
    }
    if (timeLeft <= 0 && phase === GAME_PHASES.ACTIVE) {
      onExpire?.();
    }
  }, [timeLeft]);

  // Reset warn flag when game restarts
  useEffect(() => {
    if (phase === GAME_PHASES.ACTIVE) warnFiredRef.current = false;
  }, [phase]);

  const pct       = timeLimit > 0 ? timeLeft / timeLimit : 1;
  const isWarning = timeLeft <= 60 && timeLeft > 0;
  const isDanger  = timeLeft <= 20 && timeLeft > 0;

  const fmt = useCallback((s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  }, []);

  return {
    timeLeft,
    timeLimit,
    pct,
    isWarning,
    isDanger,
    formatted: fmt(timeLeft),
    timerActive,
  };
}
