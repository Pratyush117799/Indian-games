import { useState, useCallback } from 'react'
import { usePlayerStore } from '@store/usePlayerStore'
import { useAgentStore } from '@store/useAgentStore'
import { runAgentLoop, runSingleShot } from '@lib/agentRunner'
import { getToolSchemas } from '@lib/tools'

export function useDeepSeek() {
  const apiKey       = usePlayerStore(s => s.apiKey)
  const equippedTools = useAgentStore(s => s.equippedTools)
  const loopEnabled  = useAgentStore(s => s.loopEnabled)
  const { addLoopStep, clearLoop, setRunning } = useAgentStore()

  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [response, setResponse] = useState(null)

  const run = useCallback(async ({ task, systemPrompt } = {}) => {
    if (!apiKey) { setError('No API key set. Please enter your DeepSeek API key.'); return }

    setLoading(true)
    setError(null)
    setResponse(null)
    clearLoop()
    setRunning(true)

    const tools = getToolSchemas(equippedTools)

    if (loopEnabled && tools.length > 0) {
      await runAgentLoop({
        apiKey,
        task,
        tools,
        systemPrompt,
        onStep: (step) => {
          addLoopStep(step)
        },
        onDone: (answer) => {
          setResponse(answer)
          setLoading(false)
          setRunning(false)
        },
        onError: (msg) => {
          setError(msg)
          setLoading(false)
          setRunning(false)
        },
      })
    } else {
      // Single-shot mode (Level 1 / no loop)
      try {
        const res = await runSingleShot({ apiKey, message: task, systemPrompt })
        const text = res?.choices?.[0]?.message?.content || ''
        addLoopStep({ type: 'answer', content: text })
        setResponse(text)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
        setRunning(false)
      }
    }
  }, [apiKey, equippedTools, loopEnabled])

  return { run, loading, error, response }
}
