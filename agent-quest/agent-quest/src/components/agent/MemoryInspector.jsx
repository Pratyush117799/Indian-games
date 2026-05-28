import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAgentStore } from '@store/useAgentStore'
import NeonButton from '@components/ui/NeonButton'

export default function MemoryInspector() {
  const { memoryEntries, memoryEnabled, clearMemory } = useAgentStore()

  return (
    <div className="bg-cyber-surface border border-cyber-amber/40 clip-cyber overflow-hidden">
      <div className="px-4 py-2 border-b border-cyber-amber/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${memoryEnabled ? 'bg-cyber-amber' : 'bg-cyber-muted'}`}
            animate={memoryEnabled ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-display text-xs tracking-widest text-cyber-muted">
            MEMORY STORE · {memoryEntries.length} ENTRIES
          </span>
        </div>
        {memoryEntries.length > 0 && (
          <button
            onClick={clearMemory}
            className="font-display text-[10px] text-cyber-pink hover:text-cyber-pink/70
              tracking-widest transition-colors"
          >
            CLEAR
          </button>
        )}
      </div>

      <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
        {memoryEntries.length === 0 ? (
          <p className="font-mono text-xs text-cyber-muted text-center py-3">
            // Memory empty — agent will forget everything
          </p>
        ) : (
          <AnimatePresence initial={false}>
            {memoryEntries.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border border-cyber-amber/20 bg-cyber-amber/5 clip-cyber-sm p-2"
              >
                <div className="flex items-start gap-2">
                  <span className="font-display text-[10px] text-cyber-amber tracking-widest shrink-0">
                    MEM_{String(i).padStart(2, '0')}
                  </span>
                  <p className="font-mono text-[10px] text-cyber-text/70 break-words leading-relaxed">
                    {entry.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
