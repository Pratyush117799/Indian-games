import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NeonButton from '@components/ui/NeonButton'
import { useAgentStore } from '@store/useAgentStore'

export default function AgentChat({ onSend, loading, placeholder = 'Send a message to NOVA...', color = 'cyan' }) {
  const [input, setInput]   = useState('')
  const [messages, setMessages] = useState([])
  const loopSteps  = useAgentStore(s => s.loopSteps)
  const bottomRef  = useRef(null)

  // Build display messages from loop steps
  useEffect(() => {
    if (loopSteps.length === 0) return
    const last = loopSteps[loopSteps.length - 1]
    if (last.type === 'answer') {
      setMessages(prev => [...prev, { role: 'nova', text: last.content }])
    }
  }, [loopSteps])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || loading) return
    const msg = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    onSend(msg)
  }

  return (
    <div className="flex flex-col h-full bg-cyber-surface border border-cyber-border clip-cyber overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b border-cyber-border flex items-center gap-2">
        <motion.div
          className={`w-2 h-2 rounded-full bg-cyber-${color}`}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="font-display text-xs tracking-widest text-cyber-muted">NOVA TERMINAL</span>
        {loading && (
          <span className="ml-auto font-mono text-xs text-cyber-amber animate-pulse">PROCESSING...</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <p className="font-mono text-xs text-cyber-muted text-center mt-8">
            // No messages yet. Send a task to NOVA.
          </p>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] px-4 py-2.5 clip-cyber-sm text-sm font-body leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-text'
                  : `bg-cyber-${color}/10 border border-cyber-${color}/40 text-cyber-text`
                }`}
              >
                {msg.role === 'nova' && (
                  <span className={`font-display text-xs text-cyber-${color} tracking-widest block mb-1`}>
                    NOVA
                  </span>
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className={`px-4 py-2.5 clip-cyber-sm border border-cyber-${color}/30 bg-cyber-${color}/5`}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full bg-cyber-${color}`}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-cyber-border flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={placeholder}
          disabled={loading}
          className={`flex-1 bg-cyber-bg border border-cyber-border text-cyber-text
            font-mono text-sm px-3 py-2 focus:outline-none focus:border-cyber-${color}
            transition-colors clip-cyber-sm disabled:opacity-40`}
        />
        <NeonButton
          variant={color}
          size="sm"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          loading={loading}
        >
          SEND
        </NeonButton>
      </div>
    </div>
  )
}
