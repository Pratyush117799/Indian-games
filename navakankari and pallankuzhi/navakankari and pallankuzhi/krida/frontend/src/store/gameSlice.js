import { createSlice } from '@reduxjs/toolkit'

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    activeGame:  null,   // 'navakankari' | 'pallankuzhi' | null
    mode:        'ai',   // 'ai' | 'ranked' | 'friendly' | 'daily'
    difficulty:  'medium',
    roomId:      null,   // for online PvP
    soundEnabled: true,
  },
  reducers: {
    setActiveGame:  (s, { payload }) => { s.activeGame = payload },
    setMode:        (s, { payload }) => { s.mode = payload },
    setDifficulty:  (s, { payload }) => { s.difficulty = payload },
    setRoomId:      (s, { payload }) => { s.roomId = payload },
    toggleSound:    (s)              => { s.soundEnabled = !s.soundEnabled },
  },
})

export const { setActiveGame, setMode, setDifficulty, setRoomId, toggleSound } = gameSlice.actions
export default gameSlice.reducer
