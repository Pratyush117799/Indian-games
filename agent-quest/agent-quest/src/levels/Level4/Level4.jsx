import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AgentChat from '@components/agent/AgentChat'
import LoopVisualizer from '@components/agent/LoopVisualizer'
import MemoryInspector from '@components/agent/MemoryInspector'
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

const MEMORY_TASKS = [
  "Remember: my name is Arjun and my favourite number is 42",
  "What did I tell you earlier? Recall my name and number.",
  "Save a note: 'AI agents need memory to be truly useful'",
  "Read the note I just saved — what does it say?",
]

export default function Level4({ level }) {
  const [phase,    setPhase]    = useState('play')
  const [attempts, setAttempts] = useState(0)

  const { run, loading }   = useDeepSeek()
  const { addMemory, memoryEntries } = useAgentStore()
  const { showMascot }     = useGameStore()

  // Build memory context for system prompt
  const memoryContext = memoryEntries.length > 0
    ? `\n\nYOUR STORED MEMORIES:\n${memoryEntries.map((e, i) => `[MEM_${i}]: ${e.value}`).join('\n')}`
    : '\n\nYOUR MEMORY: empty — you remember nothing yet.'

  const systemPrompt = `You are NOVA, an AI agent with a memory system.
${memoryContext}

RULES:
- When the user asks you to "remember" something, acknowledge you've stored it
- When asked to recall, ALWAYS look in your memories above first
- Be explicit: "I recall from memory that..." or "I have stored: ..."
- If memory is empty and asked to recall, admit you don't remember
- For file operations, use read_file/write_file tools
- Show the user how memory transforms a stateless LLM into a persistent agent!`

  const handleSend = async (msg) => {
    // Extract memory-worthy content
    const memoryPatterns = [
      /my name is ([^.!?]+)/i,
      /remember[: ]+([^.!?]+)/i,
      /save[: ]+([^.!?]+)/i,
      /favourite (?:number|color|thing) is ([^.!?]+)/i,
    ]
    for (const pat of memoryPatterns) {
      const match = msg.match(pat)
      if (match) {
        addMemory('user_fact', `User said: "${msg.trim()}"`)
        break
      }
    }

    setAttempts(a => a + 1)
    await run({ task: msg, systemPrompt })

    if (attempts === 0) {
      setTimeout(() => {
        showMascot(MASCOT_DIALOGUES.level4.memoryEnabled.text, 'happy')
      }, 1500)
    }

    // If recalling, show mascot
    if (/recall|remember|what did i|earlier/i.test(msg) && memoryEntries.length > 0) {
      setTimeout(() => {
        showMascot(MASCOT_DIALOGUES.level4.memoryRecalled.text, 'celebrate')
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left: Memory Inspector + concept */}
        <div className="space-y-4">
          <MemoryInspector />

          <GlowCard color="amber" animate>
            <div className="space-y-3">
              <CyberBadge label="MEMORY TYPES" color="amber" />
              {[
                { name: 'Context Window', desc: 'Short-term: current conversation. Limited by tokens.', icon: '⚡' },
                { name: 'Key-Value Store', desc: 'Fast recall by key. This level uses this!', icon: '🗝️' },
                { name: 'Vector DB (RAG)', desc: 'Semantic search over embeddings. Long-term.', icon: '🧬' },
              ].map(({ name, desc, icon }) => (
                <div key={name} className="flex gap-2 items-start">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <div className="font-display text-xs text-cyber-amber tracking-wide">{name}</div>
                    <div className="font-mono text-[10px] text-cyber-muted leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          <div className="border border-cyber-amber/30 bg-cyber-amber/5 clip-cyber p-3">
            <span className="font-display text-[10px] text-cyber-amber tracking-widest block mb-1">
              💡 NOVA SAYS
            </span>
            <p className="font-body text-xs text-cyber-text/70 italic leading-relaxed">
              {level.hinglishTip}
            </p>
          </div>
        </div>

        {/* Center: Loop vis */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {phase === 'play' ? (
              <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="h-72">
                  <LoopVisualizer color="amber" />
                </div>

                {/* Memory tasks */}
                <GlowCard color="amber" animate padding={false}>
                  <div className="px-4 py-2 border-b border-cyber-border">
                    <span className="font-display text-xs text-cyber-muted tracking-widest">
                      MEMORY TASKS — do these in order!
                    </span>
                  </div>
                  <div className="p-3 space-y-2">
                    {MEMORY_TASKS.map((task, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ x: 3 }}
                        onClick={() => handleSend(task)}
                        className="w-full text-left font-mono text-xs text-cyber-amber/80 hover:text-cyber-amber
                          border border-cyber-border hover:border-cyber-amber/40
                          px-3 py-2 clip-cyber-sm transition-all"
                      >
                        <span className="text-cyber-muted mr-2">{i + 1}.</span>{task}
                      </motion.button>
                    ))}
                  </div>
                </GlowCard>

                {/* Tools */}
                <ToolBox />
              </motion.div>
            ) : (
              <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                <GlowCard color="amber">
                  <div className="mb-4">
                    <CyberBadge label="KNOWLEDGE CHECK" color="amber" />
                    <h2 className="font-display text-lg text-cyber-amber mt-2 tracking-wide">
                      Agent Memory — Quiz
                    </h2>
                  </div>
                  <QuizPanel levelId={4} onComplete={handleQuizComplete} />
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
              placeholder="Tell NOVA something to remember..."
              color="amber"
            />
          </div>
          {attempts >= 2 && phase === 'play' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <NeonButton variant="amber" size="md" className="w-full" onClick={() => setPhase('quiz')}>
                TAKE THE QUIZ →
              </NeonButton>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
