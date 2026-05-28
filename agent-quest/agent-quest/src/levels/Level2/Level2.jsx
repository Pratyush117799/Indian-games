import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AgentChat from '@components/agent/AgentChat'
import ToolBox from '@components/agent/ToolBox'
import GlowCard from '@components/ui/GlowCard'
import NeonButton from '@components/ui/NeonButton'
import CyberBadge from '@components/ui/CyberBadge'
import QuizPanel from '@components/quiz/QuizPanel'
import LevelComplete from '@components/agent/LevelComplete'
import { useDeepSeek } from '@hooks/useDeepSeek'
import { useAgentStore } from '@store/useAgentStore'
import { useGameStore } from '@store/useGameStore'
import { MASCOT_DIALOGUES } from '@data/mascotDialogues'

const CHALLENGE_TASKS = [
  "What time is it right now in India?",
  "What is 17 × 23 + 144?",
  "Search the web: what is an AI agent?",
  "What time is it and calculate 2^10?",
]

export default function Level2({ level }) {
  const [phase,    setPhase]    = useState('play')
  const [attempts, setAttempts] = useState(0)
  const { run, loading }   = useDeepSeek()
  const { equippedTools }  = useAgentStore()
  const { showMascot }     = useGameStore()

  const systemPrompt = `You are NOVA, a tool-equipped AI assistant. 
You have access to tools and MUST use them when needed — never guess or make up answers.
When asked about time, ALWAYS use get_current_time.
When asked about math, ALWAYS use calculator.  
When asked to search, ALWAYS use web_search.
Be enthusiastic about using your tools — you're showing the user how function calling works!
Keep responses concise and explain which tool you used and why.`

  const handleSend = async (msg) => {
    if (equippedTools.length === 0) {
      showMascot("Equip some tools first! Click the toggles on the left — then ask me something! 🔧", 'warning')
      return
    }
    setAttempts(a => a + 1)
    await run({ task: msg, systemPrompt })

    if (attempts === 0) {
      setTimeout(() => {
        showMascot(
          MASCOT_DIALOGUES.level2.toolUsed('function calling').text,
          'excited'
        )
      }, 2000)
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

        {/* Left: Toolbox + concept */}
        <div className="space-y-4">
          {/* Toolbox */}
          <GlowCard color="purple" animate padding={false}>
            <div className="px-4 py-2 border-b border-cyber-border">
              <CyberBadge label="EQUIP TOOLS" color="purple" />
            </div>
            <div className="p-2">
              <ToolBox />
            </div>
          </GlowCard>

          {/* Concept */}
          <GlowCard color="purple" animate>
            <div className="space-y-3">
              <CyberBadge label="HOW IT WORKS" color="purple" />
              <div className="space-y-3 font-mono text-xs text-cyber-text/70">
                {[
                  { step: '1', text: 'You describe a tool using JSON Schema', color: 'text-cyber-purple' },
                  { step: '2', text: 'Model decides WHEN to call which tool', color: 'text-cyber-cyan' },
                  { step: '3', text: 'Model emits a structured tool_call', color: 'text-cyber-amber' },
                  { step: '4', text: 'You run it locally & return the result', color: 'text-cyber-green' },
                  { step: '5', text: 'Model uses result in its final answer', color: 'text-cyber-pink' },
                ].map(({ step, text, color }) => (
                  <div key={step} className="flex gap-3 items-start">
                    <span className={`${color} font-display tracking-widest shrink-0`}>{step}.</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlowCard>

          {/* Hinglish tip */}
          <div className="border border-cyber-purple/30 bg-cyber-purple/5 clip-cyber p-3">
            <span className="font-display text-[10px] text-cyber-purple tracking-widest block mb-1">
              💡 NOVA SAYS
            </span>
            <p className="font-body text-xs text-cyber-text/70 italic leading-relaxed">
              {level.hinglishTip}
            </p>
          </div>
        </div>

        {/* Right: Architecture + Chat */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {phase === 'play' ? (
              <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

                {/* Architecture */}
                <GlowCard color="purple" animate padding={false}>
                  <div className="px-4 py-3 border-b border-cyber-border">
                    <span className="font-display text-xs text-cyber-muted tracking-widest">
                      ARCHITECTURE: LEVEL 2
                    </span>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <div className="flex items-center gap-2 min-w-max mx-auto w-fit flex-wrap gap-y-3">
                      {[
                        { label: 'USER',       color: 'border-cyber-border  text-cyber-text' },
                        { label: '→' },
                        { label: 'LLM',        color: 'border-cyber-purple text-cyber-purple shadow-neon-purple' },
                        { label: '→\ntool_call' },
                        { label: 'EXECUTOR',   color: 'border-cyber-amber text-cyber-amber' },
                        { label: '→\nresult' },
                        { label: 'LLM',        color: 'border-cyber-purple text-cyber-purple shadow-neon-purple' },
                        { label: '→' },
                        { label: 'ANSWER',     color: 'border-cyber-green text-cyber-green' },
                      ].map((n, i) => (
                        !n.color ? (
                          <div key={i} className="text-center font-mono text-[10px] text-cyber-muted whitespace-pre-line leading-tight">
                            {n.label}
                          </div>
                        ) : (
                          <div key={i} className={`border px-3 py-2 clip-cyber-sm font-display text-xs tracking-widest ${n.color}`}>
                            {n.label}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </GlowCard>

                {/* Challenge tasks */}
                <GlowCard color="purple" animate padding={false}>
                  <div className="px-4 py-2 border-b border-cyber-border">
                    <span className="font-display text-xs text-cyber-muted tracking-widest">CHALLENGE TASKS</span>
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-2">
                    {CHALLENGE_TASKS.map((task, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleSend(task)}
                        className="text-left font-mono text-xs text-cyber-purple/80 hover:text-cyber-purple
                          border border-cyber-border hover:border-cyber-purple/40
                          px-3 py-2 clip-cyber-sm transition-all"
                      >
                        {task}
                      </motion.button>
                    ))}
                  </div>
                </GlowCard>

                {/* Chat */}
                <div className="h-72">
                  <AgentChat
                    onSend={handleSend}
                    loading={loading}
                    placeholder="Equip tools, then ask NOVA something..."
                    color="purple"
                  />
                </div>

                {equippedTools.length > 0 && attempts >= 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-end"
                  >
                    <NeonButton variant="purple" size="md" onClick={() => setPhase('quiz')}>
                      TAKE THE QUIZ →
                    </NeonButton>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                <GlowCard color="purple">
                  <div className="mb-4">
                    <CyberBadge label="KNOWLEDGE CHECK" color="purple" />
                    <h2 className="font-display text-lg text-cyber-purple mt-2 tracking-wide">
                      Tool Calling — Quiz
                    </h2>
                  </div>
                  <QuizPanel levelId={2} onComplete={handleQuizComplete} />
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
