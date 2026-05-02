/**
 * useXP.js
 * Awards XP after game events and syncs to backend.
 */
import { useDispatch } from 'react-redux'
import { addXP } from '../store/playerSlice.js'
import api from '../services/api.js'

const XP_TABLE = {
  win_easy:   5,
  win_medium: 20,
  win_hard:   40,
  win_ranked: 60,
  daily:      15,
  streak:     10,
}

export const useXP = () => {
  const dispatch = useDispatch()

  const award = async (event) => {
    const pts = XP_TABLE[event] ?? 0
    if (!pts) return
    dispatch(addXP(pts))
    try {
      await api.post('/xp', { event, pts })
    } catch {}
  }

  return { award }
}
