import { configureStore } from '@reduxjs/toolkit'
import playerReducer      from './playerSlice.js'
import gameReducer        from './gameSlice.js'
import leaderboardReducer from './leaderboardSlice.js'

export const store = configureStore({
  reducer: {
    player:      playerReducer,
    game:        gameReducer,
    leaderboard: leaderboardReducer,
  },
})
