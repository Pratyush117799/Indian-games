import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import LandingPage     from '@pages/LandingPage'
import OnboardingPage  from '@pages/OnboardingPage'
import WorldMap        from '@pages/WorldMap'
import GamePage        from '@pages/GamePage'
import BlueprintVault  from '@pages/BlueprintVault'

import { usePlayerStore } from '@store/usePlayerStore'

// Guard: redirect to onboarding if no API key set
function RequireKey({ children }) {
  const apiKey = usePlayerStore(s => s.apiKey)
  if (!apiKey) return <Navigate to="/onboarding" replace />
  return children
}

export default function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#080e1a',
            color: '#c8e0ff',
            border: '1px solid #0d1f3c',
            fontFamily: '"Exo 2", sans-serif',
          },
        }}
      />

      <Routes>
        <Route path="/"            element={<LandingPage />} />
        <Route path="/onboarding"  element={<OnboardingPage />} />

        <Route path="/map"         element={
          <RequireKey><WorldMap /></RequireKey>
        } />
        <Route path="/level/:id"   element={
          <RequireKey><GamePage /></RequireKey>
        } />
        <Route path="/vault"       element={
          <RequireKey><BlueprintVault /></RequireKey>
        } />

        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
