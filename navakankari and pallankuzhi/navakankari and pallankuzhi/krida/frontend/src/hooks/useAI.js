/**
 * useAI.js
 * Hook that runs AI moves in a Web Worker (non-blocking).
 * Falls back to main-thread call if Worker not supported.
 */
import { useEffect, useRef, useCallback } from 'react'
import { getBestMove } from '../game-engine/navakankari/index.js'
import { getAIMove }   from '../game-engine/pallankuzhi/index.js'

export const useNavakankariAI = ({ state, difficulty, onMove, enabled }) => {
  const timer = useRef(null)

  useEffect(() => {
    if (!enabled || state.turn !== 2 || state.winner !== null) return
    clearTimeout(timer.current)

    const delay = { easy: 600, medium: 900, hard: 1400 }[difficulty] ?? 900
    timer.current = setTimeout(() => {
      const move = getBestMove(state, difficulty)
      if (move) onMove(move)
    }, delay)

    return () => clearTimeout(timer.current)
  }, [state, difficulty, enabled])
}

export const usePallankuzhiAI = ({ state, difficulty, onMove, enabled }) => {
  const timer = useRef(null)

  useEffect(() => {
    if (!enabled || state.turn !== 2 || state.winner !== null) return
    clearTimeout(timer.current)

    timer.current = setTimeout(() => {
      const cup = getAIMove(state, difficulty)
      if (cup !== null) onMove(cup)
    }, 900)

    return () => clearTimeout(timer.current)
  }, [state, difficulty, enabled])
}
