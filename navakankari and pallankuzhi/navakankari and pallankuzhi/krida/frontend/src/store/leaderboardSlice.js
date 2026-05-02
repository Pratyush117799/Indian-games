import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api.js'

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetch',
  async (game) => {
    const { data } = await api.get(`/leaderboard/${game}?limit=20`)
    return { game, entries: data }
  }
)

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: { navakankari: [], pallankuzhi: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLeaderboard.fulfilled, (s, { payload }) => {
      s[payload.game] = payload.entries
    })
  },
})

export default leaderboardSlice.reducer
