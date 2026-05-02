import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Hub from './portals/hub/Hub.jsx'
import NavakankariPortal from './portals/navakankari/NavakankariPortal.jsx'
import PallankuzhiPortal from './portals/pallankuzhi/PallankuzhiPortal.jsx'
import { useDispatch } from 'react-redux'
import { initPlayer } from './store/playerSlice.js'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Boot: load or create player tag on first visit
    dispatch(initPlayer())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/"               element={<Hub />} />
      <Route path="/navakankari"    element={<NavakankariPortal />} />
      <Route path="/pallankuzhi"    element={<PallankuzhiPortal />} />
      <Route path="*"               element={<Navigate to="/" replace />} />
    </Routes>
  )
}
