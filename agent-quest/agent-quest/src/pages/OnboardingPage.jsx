import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import NeonButton from '@components/ui/NeonButton'
import TerminalText from '@components/ui/TerminalText'
import Mascot from '@components/mascot/Mascot'
import { usePlayerStore } from '@store/usePlayerStore'
import { validateApiKey } from '@lib/deepseek'

export default function OnboardingPage() {
  const navigate   = useNavigate()
  const { setApiKey, setPlayerName } = usePlayerStore()

  const [name,     setName]     = useState('')
  const [key,      setKey]      = useState('')
  const [step,     setStep]     = useState(1)   // 1 = name, 2 = api key
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [mood,     setMood]     = useState('happy')

  const handleName = () => {
    if (!name.trim()) { setError('Enter your operator name!'); return }
    setPlayerName(name.trim())
    setError('')
    setStep(2)
    setMood('excited')
  }

  const handleKey = async () => {
    if (!key.trim()) { setError('Paste your DeepSeek API key above!'); return }
    setLoading(true)
    setError('')
    setMood('thinking')

    const { valid, error: apiError } = await validateApiKey(key.trim())

    if (valid) {
      setApiKey(key.trim())
      setMood('celebrate')
      setTimeout(() => navigate('/map'), 800)
    } else {
      setError(`Key validation failed: ${apiError}`)
      setMood('warning')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cyber-bg bg-cyber-grid bg-grid-40 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* NOVA + speech */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center mb-8 gap-4"
        >
          <Mascot mood={mood} size="lg" />
          <div className="bg-cyber-surface border border-cyber-cyan/40 clip-cyber p-4 w-full">
            <TerminalText
              key={step}
              text={
                step === 1
                  ? "Namaste, Operator! Before we begin — what should I call you?"
                  : `Nice to meet you, ${name}! Now I need your DeepSeek API key to activate. Get a free key at platform.deepseek.com — no credit card needed!`
              }
              speed={25}
              color="cyan"
              prefix="NOVA > "
            />
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-cyber-surface border border-cyber-border clip-cyber p-6 space-y-4"
        >
          <div className="font-display text-xs text-cyber-muted tracking-widest mb-4">
            {step === 1 ? '// STEP 1: OPERATOR IDENTIFICATION' : '// STEP 2: API AUTHORIZATION'}
          </div>

          {step === 1 ? (
            <>
              <div>
                <label className="font-display text-xs text-cyber-cyan tracking-widest block mb-2">
                  OPERATOR CALLSIGN
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleName()}
                  placeholder="e.g. CodeAlchemist"
                  maxLength={20}
                  className="w-full bg-cyber-bg border border-cyber-border text-cyber-text
                    font-mono text-sm px-4 py-3 focus:outline-none focus:border-cyber-cyan
                    transition-colors clip-cyber-sm"
                />
              </div>
              {error && <p className="text-cyber-pink font-mono text-xs">{error}</p>}
              <NeonButton variant="cyan" size="lg" className="w-full" onClick={handleName}>
                CONFIRM IDENTITY
              </NeonButton>
            </>
          ) : (
            <>
              <div>
                <label className="font-display text-xs text-cyber-cyan tracking-widest block mb-2">
                  DEEPSEEK API KEY
                </label>
                <input
                  type="password"
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleKey()}
                  placeholder="sk-..."
                  className="w-full bg-cyber-bg border border-cyber-border text-cyber-text
                    font-mono text-sm px-4 py-3 focus:outline-none focus:border-cyber-cyan
                    transition-colors clip-cyber-sm"
                />
              </div>
              <p className="font-mono text-xs text-cyber-muted">
                🔒 Stored locally in your browser. Never sent to any server.
              </p>
              {error && <p className="text-cyber-pink font-mono text-xs">{error}</p>}
              <div className="flex gap-3">
                <NeonButton variant="ghost" size="md" onClick={() => setStep(1)}>
                  BACK
                </NeonButton>
                <NeonButton variant="cyan" size="lg" className="flex-1"
                  onClick={handleKey} loading={loading}>
                  AUTHORIZE
                </NeonButton>
              </div>
              <a
                href="https://platform.deepseek.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center font-mono text-xs text-cyber-purple hover:text-cyber-cyan transition-colors"
              >
                → Get free API key at platform.deepseek.com
              </a>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
