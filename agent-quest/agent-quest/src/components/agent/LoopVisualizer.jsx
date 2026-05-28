import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAgentStore } from '@store/useAgentStore'

const STEP_STYLES = {
  thought:   { color: 'cyber-purple', icon: '💭', label: 'THOUGHT'     },
  tool_call: { color: 'cyber-amber',  icon: '🔧', label: 'TOOL CALL'   },
  observation:{ color: 'cyber-cyan', icon: '👁️', label: 'OBSERVATION' },
  answer:    { color: 'cyber-green',  icon: '✅', label: 'ANSWER'      },
}

function StepCard({ step, index }) {
  const style = STEP_STYLES[step.type] || STEP_STYLES.thought

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`border border-${style.color}/40 bg-${style.color}/5 clip-cyber-sm p-3 space-y-1`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm">{style.icon}</span>
        <span className={`font-display text-xs text-${style.color} tracking-widest`}>
          {style.label}
        </span>
        {step.toolName && (
          <span className="font-mono text-xs text-cyber-muted ml-auto">
            {step.toolName}()
          </span>
        )}
      </div>

      <p className="font-mono text-xs text-cyber-text/80 leading-relaxed break-words">
        {typeof step.content === 'string'
          ? step.content.slice(0, 300) + (step.content.length > 300 ? '...' : '')
          : JSON.stringify(step.content).slice(0, 300)
        }
      </p>

      {step.toolInput && (
        <div className="mt-1 p-2 bg-cyber-bg rounded border border-cyber-border">
          <span className="font-display text-[10px] text-cyber-muted tracking-widest block mb-1">INPUT</span>
          <pre className="font-mono text-[10px] text-cyber-amber overflow-x-auto">
            {JSON.stringify(step.toolInput, null, 2)}
          </pre>
        </div>
      )}

      {step.toolResult && (
        <div className="mt-1 p-2 bg-cyber-bg rounded border border-cyber-border">
          <span className="font-display text-[10px] text-cyber-muted tracking-widest block mb-1">RESULT</span>
          <pre className="font-mono text-[10px] text-cyber-cyan overflow-x-auto">
            {typeof step.toolResult === 'string'
              ? step.toolResult
              : JSON.stringify(step.toolResult, null, 2)
            }
          </pre>
        </div>
      )}
    </motion.div>
  )
}

export default function LoopVisualizer({ color = 'pink' }) {
  const { loopSteps, isRunning } = useAgentStore()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [loopSteps])

  return (
    <div className="flex flex-col h-full bg-cyber-surface border border-cyber-border clip-cyber overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b border-cyber-border flex items-center gap-2">
        <motion.div
          className={`w-2 h-2 rounded-full bg-cyber-${color}`}
          animate={isRunning ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
          transition={{ duration: 0.6, repeat: isRunning ? Infinity : 0 }}
        />
        <span className="font-display text-xs tracking-widest text-cyber-muted">AGENT LOOP TRACE</span>
        {loopSteps.length > 0 && (
          <span className="ml-auto font-mono text-xs text-cyber-muted">
            {loopSteps.length} steps
          </span>
        )}
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {loopSteps.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="text-4xl opacity-30">🔄</div>
            <p className="font-mono text-xs text-cyber-muted">
              // Loop trace will appear here
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {loopSteps.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </AnimatePresence>

        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`border border-cyber-${color}/30 clip-cyber-sm p-3 flex items-center gap-2`}
          >
            <motion.div
              className={`w-3 h-3 border-2 border-cyber-${color} border-t-transparent rounded-full`}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <span className={`font-display text-xs text-cyber-${color} tracking-widest`}>
              THINKING...
            </span>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
