import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AgentChat from '@components/agent/AgentChat'
import LoopVisualizer from '@components/agent/LoopVisualizer'
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

const MULTI_STEP_TASKS = [
  "Search for today's weather, then calculate the temperature in Fahrenheit if it's 34°C",
  "Get the current time, calculate how many minutes until midnight",
  "Search for what an AI agent is, then write the definition to agent_def.txt",
  "Calculate 15% of 8500 and also get the current timestamp",
]

export default function Level3({ level }) {
  const [phase,    setPhase]    = useState('play')
  const [attempts, setAttempts] = useState(0)
  const { run, loading }   = useDeepSeek()
  const { loopSteps }      = useAgentStore()
  const { showMascot }     = useGameStore()

  const systemPrompt = `You are NOVA, an advanced AI agent running in a LOOP.
You MUST reason step by step using the ReAct pattern:
1. THINK about what you need to do
2. CALL a tool if needed
3. OBSERVE the result
4. Repeat until you have a complete answer

Always use multiple tool calls for complex tasks — don't stop at one.
Be explicit about your reasoning: "I need to first... then I will..."
This is a learning game — show the user exactly how multi-step reasoning works!`

  const handleSend = async (msg) => {
    setAttempts(a => a + 1)
    await run({ task: msg, systemPrompt })

    if (attempts === 0) {
      setTimeout(() => {
        showMascot(MASCOT_DIALOGUES.level3.loopRunning.text, 'excited')
      }, 1000)
    }
  }

  const handleQuizComplete = (passed) => {
    if (passed) setPhase('complete')
    else setPhase('play')
  }

  if (phase === 'complete') return <LevelComplete level={level} />

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left col: Tools + concept */}
        <div className="space-y-4">
          <GlowCard color="pink" animate padding={false}>
            <div className="px-4 py-2 border-b border-cyber-border">
              <CyberBadge label="TOOLS" color="pink" />
            </div>
            <div className="p-2">
              <ToolBox />
            </div>
          </GlowCard>

          <GlowCard color="pink" animate>
            <div className="space-y-3">
              <CyberBadge label="REACT LOOP" color="pink" />
              <div className="relative">
                {/* Animated loop diagram */}
                {['💭 THINK', '🔧 ACT', '👁️ OBSERVE'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-cyber-pink"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                    />
                    <span className="font-display text-xs text-cyber-pink tracking-wide">{step}</span>
                  </div>
                ))}
                <div className="ml-1 font-mono text-xs text-cyber-muted mt-2">
                  ↺ until ANSWER found
                </div>
              </div>
              <p className="font-body text-xs text-cyber-text/70 leading-relaxed border-t border-cyber-border pt-2">
                Max iterations: <span className="text-cyber-pink">10</span> — prevents infinite loops
              </p>
            </div>
          </GlowCard>

          <div className="border border-cyber-pink/30 bg-cyber-pink/5 clip-cyber p-3">
            <span className="font-display text-[10px] text-cyber-pink tracking-widest block mb-1">
              💡 NOVA SAYS
            </span>
            <p className="font-body text-xs text-cyber-text/70 italic leading-relaxed">
              {level.hinglishTip}
            </p>
          </div>
        </div>

        {/* Center: Loop visualizer */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {phase === 'play' ? (
              <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full space-y-4">
                <div className="h-96">
                  <LoopVisualizer color="pink" />
                </div>

                {/* Multi-step tasks */}
                <GlowCard color="pink" animate padding={false}>
                  <div className="px-4 py-2 border-b border-cyber-border">
                    <span className="font-display text-xs text-cyber-muted tracking-widest">MULTI-STEP TASKS</span>
                  </div>
                  <div className="p-3 space-y-2">
                    {MULTI_STEP_TASKS.map((task, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ x: 3 }}
                        onClick={() => handleSend(task)}
                        className="w-full text-left font-mono text-xs text-cyber-pink/80 hover:text-cyber-pink
                          border border-cyber-border hover:border-cyber-pink/40
                          px-3 py-2 clip-cyber-sm transition-all"
                      >
                        → {task}
                      </motion.button>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            ) : (
              <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                <GlowCard color="pink">
                  <div className="mb-4">
                    <CyberBadge label="KNOWLEDGE CHECK" color="pink" />
                    <h2 className="font-display text-lg text-cyber-pink mt-2 tracking-wide">
                      The Agent Loop — Quiz
                    </h2>
                  </div>
                  <QuizPanel levelId={3} onComplete={handleQuizComplete} />
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Chat */}
        <div className="space-y-4">
          <div className="h-96">
            <AgentChat
              onSend={handleSend}
              loading={loading}
              placeholder="Give NOVA a multi-step task..."
              color="pink"
            />
          </div>

          {attempts >= 1 && phase === 'play' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <NeonButton
                variant="pink"
                size="md"
                className="w-full"
                onClick={() => setPhase('quiz')}
              >
                TAKE THE QUIZ →
              </NeonButton>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
