import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AgentChat from '@components/agent/AgentChat'
import GlowCard from '@components/ui/GlowCard'
import NeonButton from '@components/ui/NeonButton'
import CyberBadge from '@components/ui/CyberBadge'
import TerminalText from '@components/ui/TerminalText'
import QuizPanel from '@components/quiz/QuizPanel'
import LevelComplete from '@components/agent/LevelComplete'
import { useDeepSeek } from '@hooks/useDeepSeek'
import { useGameStore } from '@store/useGameStore'
import { MASCOT_DIALOGUES } from '@data/mascotDialogues'

const CHALLENGE_TASKS = [
  "What is today's exact date and time?",
  "What happened in the news today?",
  "What's the current Bitcoin price?",
  "Who won yesterday's cricket match?",
]

export default function Level1({ level }) {
  const [phase,    setPhase]    = useState('play')   // 'play' | 'quiz' | 'complete'
  const [attempts, setAttempts] = useState(0)
  const { run, loading } = useDeepSeek()
  const { showMascot } = useGameStore()

  const systemPrompt = `You are NOVA, a helpful AI assistant. You are a raw language model 
with NO tools, NO real-time internet access, and NO knowledge of events after your training cutoff.
When asked about current time, current events, live prices, or today's news — be honest that 
you don't have access to this information. Don't make up dates or facts.
Keep responses concise (2-3 sentences max). You speak in a slightly robotic but friendly tone.`

  const handleSend = async (msg) => {
    setAttempts(a => a + 1)
    await run({ task: msg, systemPrompt })

    // After first attempt, NOVA explains why she failed
    if (attempts === 0) {
      setTimeout(() => {
        showMascot(
          MASCOT_DIALOGUES.level1.afterFail.text,
          MASCOT_DIALOGUES.level1.afterFail.mood
        )
      }, 1500)
    }
  }

  const handleQuizComplete = (passed) => {
    if (passed) setPhase('complete')
    else setPhase('play')
  }

  if (phase === 'complete') return <LevelComplete level={level} />

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Concept panel */}
        <div className="space-y-4">
          <GlowCard color="cyan" animate>
            <div className="space-y-3">
              <CyberBadge label="CONCEPT" color="cyan" />
              <h2 className="font-display text-lg text-cyber-cyan glow-cyan tracking-wide">
                What is an LLM?
              </h2>
              <p className="font-body text-sm text-cyber-text/80 leading-relaxed">
                A <span className="text-cyber-cyan font-semibold">Large Language Model</span> is a 
                neural network trained on massive text data. It predicts the next token — that's all.
              </p>
              <div className="space-y-2 pt-2 border-t border-cyber-border">
                {[
                  { icon: '✅', text: 'Knows facts from training data' },
                  { icon: '✅', text: 'Generates fluent text' },
                  { icon: '✅', text: 'Reasons & summarises' },
                  { icon: '❌', text: 'No real-time awareness' },
                  { icon: '❌', text: 'No tools or external access' },
                  { icon: '❌', text: 'Can hallucinate confidently' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 font-mono text-xs text-cyber-text/70">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlowCard>

          {/* Challenge tasks */}
          <GlowCard color="cyan" animate>
            <div className="space-y-3">
              <CyberBadge label="CHALLENGE" color="pink" />
              <p className="font-body text-sm text-cyber-text/70 leading-relaxed">
                Try these tasks — watch NOVA struggle without tools:
              </p>
              <div className="space-y-2">
                {CHALLENGE_TASKS.map((task, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ x: 4 }}
                    onClick={() => handleSend(task)}
                    className="w-full text-left font-mono text-xs text-cyber-cyan/80
                      hover:text-cyber-cyan border border-cyber-border hover:border-cyber-cyan/40
                      px-3 py-2 clip-cyber-sm transition-all"
                  >
                    → {task}
                  </motion.button>
                ))}
              </div>
            </div>
          </GlowCard>

          {/* Hinglish tip */}
          <div className="border border-cyber-purple/30 bg-cyber-purple/5 clip-cyber p-3">
            <span className="font-display text-[10px] text-cyber-purple tracking-widest block mb-1">
              💡 NOVA SAYS (HINGLISH)
            </span>
            <p className="font-body text-xs text-cyber-text/70 italic leading-relaxed">
              {level.hinglishTip}
            </p>
          </div>
        </div>

        {/* Center: Chat */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {phase === 'play' ? (
              <motion.div
                key="play"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Architecture diagram */}
                <GlowCard color="cyan" animate padding={false}>
                  <div className="px-4 py-3 border-b border-cyber-border">
                    <span className="font-display text-xs text-cyber-muted tracking-widest">
                      ARCHITECTURE: LEVEL 1
                    </span>
                  </div>
                  <div className="p-4 flex items-center justify-center gap-4 flex-wrap">
                    {[
                      { label: 'USER', color: 'text-cyber-text', bg: 'border-cyber-border' },
                      { label: '→', color: 'text-cyber-muted', bg: 'border-transparent' },
                      { label: 'LLM', color: 'text-cyber-cyan', bg: 'border-cyber-cyan/50', glow: true },
                      { label: '→', color: 'text-cyber-muted', bg: 'border-transparent' },
                      { label: 'REPLY', color: 'text-cyber-text', bg: 'border-cyber-border' },
                    ].map((node, i) => (
                      node.label === '→' ? (
                        <span key={i} className="font-mono text-cyber-muted">→</span>
                      ) : (
                        <div key={i} className={`border ${node.bg} px-4 py-2 clip-cyber-sm
                          font-display text-xs tracking-widest ${node.color}
                          ${node.glow ? 'shadow-neon-cyan' : ''}`}>
                          {node.label}
                        </div>
                      )
                    ))}
                  </div>
                  <div className="px-4 pb-3">
                    <TerminalText
                      text="No tools. No loop. No memory. Just prompt → LLM → completion."
                      speed={30} color="cyan" prefix="// "
                    />
                  </div>
                </GlowCard>

                {/* Chat */}
                <div className="h-80">
                  <AgentChat
                    onSend={handleSend}
                    loading={loading}
                    placeholder="Ask NOVA something she can't know..."
                    color="cyan"
                  />
                </div>

                {/* Proceed to quiz */}
                {attempts >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <NeonButton
                      variant="cyan"
                      size="md"
                      onClick={() => setPhase('quiz')}
                    >
                      TAKE THE QUIZ →
                    </NeonButton>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <GlowCard color="cyan">
                  <div className="mb-4">
                    <CyberBadge label="KNOWLEDGE CHECK" color="cyan" />
                    <h2 className="font-display text-lg text-cyber-cyan mt-2 tracking-wide">
                      {level.title} — Quiz
                    </h2>
                  </div>
                  <QuizPanel levelId={1} onComplete={handleQuizComplete} />
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
