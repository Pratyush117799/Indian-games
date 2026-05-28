import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlowCard from '@components/ui/GlowCard'
import NeonButton from '@components/ui/NeonButton'
import CyberBadge from '@components/ui/CyberBadge'
import LoopVisualizer from '@components/agent/LoopVisualizer'
import QuizPanel from '@components/quiz/QuizPanel'
import LevelComplete from '@components/agent/LevelComplete'
import { usePlayerStore } from '@store/usePlayerStore'
import { useAgentStore } from '@store/useAgentStore'
import { useGameStore } from '@store/useGameStore'
import { deepseekChat, extractText } from '@lib/deepseek'
import { MASCOT_DIALOGUES } from '@data/mascotDialogues'

const AGENTS = [
  { id: 'orchestrator', role: 'Orchestrator', icon: '🎯', color: 'green',  desc: 'Breaks goals into sub-tasks' },
  { id: 'researcher',   role: 'Researcher',   icon: '🔍', color: 'cyan',   desc: 'Searches for information' },
  { id: 'coder',        role: 'Coder',        icon: '💻', color: 'purple', desc: 'Writes and runs code' },
  { id: 'writer',       role: 'Writer',       icon: '✍️', color: 'pink',  desc: 'Synthesises final output' },
]

const SWARM_TASKS = [
  "Research what LLM agents are, summarise, and save to report.txt",
  "Analyse the number 42: is it prime? What are its factors? Write findings to analysis.txt",
  "Research the ReAct pattern, write a 3-step guide, save to react_guide.txt",
]

export default function Level5({ level }) {
  const [phase,        setPhase]        = useState('play')
  const [running,      setRunning]      = useState(false)
  const [agentLogs,    setAgentLogs]    = useState({})   // { agentId: [lines] }
  const [activeAgent,  setActiveAgent]  = useState(null)
  const [task,         setTask]         = useState('')
  const [finalAnswer,  setFinalAnswer]  = useState('')

  const apiKey = usePlayerStore(s => s.apiKey)
  const { addLoopStep, clearLoop } = useAgentStore()
  const { showMascot } = useGameStore()

  const appendLog = (agentId, line) => {
    setAgentLogs(prev => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), line],
    }))
  }

  const runSwarm = async (userTask) => {
    if (!userTask.trim() || running) return
    setRunning(true)
    setAgentLogs({})
    setFinalAnswer('')
    clearLoop()
    showMascot(MASCOT_DIALOGUES.level5.orchestrating.text, 'thinking')

    try {
      // ─── ORCHESTRATOR: decompose ───
      setActiveAgent('orchestrator')
      appendLog('orchestrator', `📥 Received task: "${userTask}"`)
      appendLog('orchestrator', '🧠 Decomposing into sub-tasks...')
      addLoopStep({ type: 'thought', content: `[Orchestrator] Decomposing: ${userTask}` })

      const orchRes = await deepseekChat({
        apiKey,
        systemPrompt: `You are an Orchestrator AI. Given a task, break it into exactly 3 sub-tasks for:
1. A Researcher agent (gather info)
2. A Coder agent (process/compute)  
3. A Writer agent (synthesise & write)
Respond ONLY with JSON: { "research": "...", "code": "...", "write": "..." }`,
        messages: [{ role: 'user', content: userTask }],
      })

      let plan = { research: `Research: ${userTask}`, code: `Compute facts about: ${userTask}`, write: `Write summary of: ${userTask}` }
      try {
        const text = extractText(orchRes).replace(/```json|```/g, '').trim()
        plan = JSON.parse(text)
      } catch (_) {}

      appendLog('orchestrator', `✅ Plan ready → Research: "${plan.research.slice(0, 50)}..."`)
      addLoopStep({ type: 'tool_call', content: '[Orchestrator] Delegating to sub-agents', toolName: 'delegate' })

      // ─── RESEARCHER ───
      setActiveAgent('researcher')
      appendLog('researcher', `🔍 Task: "${plan.research}"`)
      addLoopStep({ type: 'thought', content: `[Researcher] ${plan.research}` })

      const researchRes = await deepseekChat({
        apiKey,
        systemPrompt: 'You are a Researcher AI. Search and summarise information concisely (3-4 sentences).',
        messages: [{ role: 'user', content: plan.research }],
      })
      const researchResult = extractText(researchRes)
      appendLog('researcher', `📄 Found: "${researchResult.slice(0, 80)}..."`)
      addLoopStep({ type: 'observation', content: `[Researcher] ${researchResult.slice(0, 120)}` })

      // ─── CODER ───
      setActiveAgent('coder')
      appendLog('coder', `💻 Task: "${plan.code}"`)
      addLoopStep({ type: 'thought', content: `[Coder] ${plan.code}` })

      const coderRes = await deepseekChat({
        apiKey,
        systemPrompt: 'You are a Coder AI. Process the task technically. If computation is needed, do it. Return a concise technical result.',
        messages: [{ role: 'user', content: `${plan.code}\n\nContext from research: ${researchResult}` }],
      })
      const coderResult = extractText(coderRes)
      appendLog('coder', `✅ Done: "${coderResult.slice(0, 80)}..."`)
      addLoopStep({ type: 'observation', content: `[Coder] ${coderResult.slice(0, 120)}` })

      // ─── WRITER ───
      setActiveAgent('writer')
      appendLog('writer', `✍️ Synthesising final output...`)
      addLoopStep({ type: 'thought', content: '[Writer] Synthesising all results' })

      const writerRes = await deepseekChat({
        apiKey,
        systemPrompt: 'You are a Writer AI. Synthesise research and technical results into a polished, well-structured final answer. Be comprehensive but concise.',
        messages: [{
          role: 'user',
          content: `Original task: ${userTask}\n\nResearch findings:\n${researchResult}\n\nTechnical analysis:\n${coderResult}\n\nWrite task: ${plan.write}`,
        }],
      })
      const finalResult = extractText(writerRes)
      appendLog('writer', '✅ Final report ready!')
      addLoopStep({ type: 'answer', content: finalResult })
      setFinalAnswer(finalResult)

      setActiveAgent(null)
      showMascot(MASCOT_DIALOGUES.level5.swarmComplete.text, 'celebrate')

    } catch (err) {
      appendLog('orchestrator', `❌ Error: ${err.message}`)
    } finally {
      setRunning(false)
      setActiveAgent(null)
    }
  }

  const handleQuizComplete = (passed) => {
    if (passed) setPhase('complete')
    else setPhase('play')
  }

  if (phase === 'complete') return <LevelComplete level={level} />

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      {phase === 'play' ? (
        <>
          {/* Task input */}
          <GlowCard color="green" animate padding={false}>
            <div className="px-4 py-3 border-b border-cyber-border">
              <CyberBadge label="SWARM MISSION" color="green" />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={task}
                  onChange={e => setTask(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runSwarm(task)}
                  placeholder="Give the swarm a complex task..."
                  disabled={running}
                  className="flex-1 bg-cyber-bg border border-cyber-border text-cyber-text
                    font-mono text-sm px-4 py-2.5 focus:outline-none focus:border-cyber-green
                    transition-colors clip-cyber-sm disabled:opacity-40"
                />
                <NeonButton
                  variant="green"
                  size="md"
                  onClick={() => runSwarm(task)}
                  disabled={running || !task.trim()}
                  loading={running}
                >
                  DEPLOY SWARM
                </NeonButton>
              </div>
              <div className="flex flex-wrap gap-2">
                {SWARM_TASKS.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => { setTask(t); runSwarm(t) }}
                    disabled={running}
                    className="font-mono text-xs text-cyber-green/70 hover:text-cyber-green
                      border border-cyber-border hover:border-cyber-green/40
                      px-3 py-1.5 clip-cyber-sm transition-all disabled:opacity-40"
                  >
                    → {t.slice(0, 45)}...
                  </button>
                ))}
              </div>
            </div>
          </GlowCard>

          {/* Agent node graph */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {AGENTS.map((agent) => {
              const logs    = agentLogs[agent.id] || []
              const isActive = activeAgent === agent.id

              return (
                <motion.div
                  key={agent.id}
                  animate={isActive ? {
                    boxShadow: [`0 0 0px transparent`, `0 0 20px var(--cyber-${agent.color})`, `0 0 0px transparent`]
                  } : {}}
                  transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                >
                  <GlowCard color={agent.color} animate={false} padding={false} className="h-full">
                    <div className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{agent.icon}</span>
                        {isActive && (
                          <motion.div
                            className={`w-2 h-2 rounded-full bg-cyber-${agent.color}`}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <div>
                        <div className={`font-display text-xs text-cyber-${agent.color} tracking-widest`}>
                          {agent.role}
                        </div>
                        <div className="font-mono text-[10px] text-cyber-muted">{agent.desc}</div>
                      </div>

                      {/* Logs */}
                      <div className="space-y-1 max-h-28 overflow-y-auto">
                        <AnimatePresence>
                          {logs.map((log, i) => (
                            <motion.p
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="font-mono text-[10px] text-cyber-text/60 leading-relaxed"
                            >
                              {log}
                            </motion.p>
                          ))}
                        </AnimatePresence>
                        {logs.length === 0 && (
                          <p className="font-mono text-[10px] text-cyber-muted">// Idle</p>
                        )}
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              )
            })}
          </div>

          {/* Loop trace + final answer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <LoopVisualizer color="green" />
            </div>

            <GlowCard color="green" animate padding={false}>
              <div className="px-4 py-2 border-b border-cyber-border">
                <span className="font-display text-xs text-cyber-muted tracking-widest">FINAL ANSWER</span>
              </div>
              <div className="p-4 h-52 overflow-y-auto">
                {finalAnswer ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="font-body text-sm text-cyber-text/80 leading-relaxed whitespace-pre-wrap">
                      {finalAnswer}
                    </p>
                  </motion.div>
                ) : (
                  <p className="font-mono text-xs text-cyber-muted text-center mt-8">
                    // Swarm output will appear here
                  </p>
                )}
              </div>
            </GlowCard>
          </div>

          {finalAnswer && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
              <NeonButton variant="green" size="md" onClick={() => setPhase('quiz')}>
                TAKE THE FINAL QUIZ →
              </NeonButton>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <GlowCard color="green">
            <div className="mb-4">
              <CyberBadge label="FINAL KNOWLEDGE CHECK" color="green" />
              <h2 className="font-display text-lg text-cyber-green mt-2 tracking-wide">
                Multi-Agent Systems — Final Quiz
              </h2>
            </div>
            <QuizPanel levelId={5} onComplete={handleQuizComplete} />
          </GlowCard>
        </motion.div>
      )}
    </div>
  )
}
