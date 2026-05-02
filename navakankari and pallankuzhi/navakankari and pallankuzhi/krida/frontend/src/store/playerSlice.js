import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { generateTagId } from '../services/tagGenerator.js'
import api from '../services/api.js'

const LS_KEY = 'krida_player'

export const initPlayer = createAsyncThunk('player/init', async () => {
  const stored = localStorage.getItem(LS_KEY)
  if (stored) return JSON.parse(stored)

  // First visit — generate tag and register with backend
  const tagId = generateTagId()
  try {
    const { data } = await api.post('/players', { tagId })
    localStorage.setItem(LS_KEY, JSON.stringify(data))
    return data
  } catch {
    const local = { tagId, xp: 0, rank: 'Pebble', streak: 0 }
    localStorage.setItem(LS_KEY, JSON.stringify(local))
    return local
  }
})

const playerSlice = createSlice({
  name: 'player',
  initialState: { data: null, status: 'idle' },
  reducers: {
    addXP: (state, { payload }) => {
      if (state.data) state.data.xp = (state.data.xp ?? 0) + payload
    },
    updateStreak: (state, { payload }) => {
      if (state.data) state.data.streak = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initPlayer.pending,   (s) => { s.status = 'loading' })
      .addCase(initPlayer.fulfilled, (s, { payload }) => { s.data = payload; s.status = 'ready' })
      .addCase(initPlayer.rejected,  (s) => { s.status = 'error' })
  },
})

export const { addXP, updateStreak } = playerSlice.actions
export default playerSlice.reducer
