import { deepseekChat, extractText, extractToolCalls, hasToolCall } from './deepseek'
import { TOOL_EXECUTORS } from './tools'

const MAX_ITERATIONS = 10

/**
 * Run the full agentic loop for a given task.
 *
 * @param {object} opts
 * @param {string}   opts.apiKey         DeepSeek API key
 * @param {string}   opts.task           The user's task / goal
 * @param {array}    opts.tools          Tool definitions (OpenAI schema format)
 * @param {string}   opts.systemPrompt   System prompt for the agent
 * @param {function} opts.onStep         Callback fired on each loop step: (step) => void
 *                                       step = { type, content, toolName?, toolInput?, toolResult? }
 * @param {function} opts.onDone         Callback fired with the final answer
 * @param {function} opts.onError        Callback fired on error
 */
export async function runAgentLoop({ apiKey, task, tools = [], systemPrompt, onStep, onDone, onError }) {
  const messages = [{ role: 'user', content: task }]
  let iteration = 0

  try {
    while (iteration < MAX_ITERATIONS) {
      iteration++

      // ── THINK ──
      onStep?.({ type: 'thought', content: `[Iteration ${iteration}] Thinking...` })

      const response = await deepseekChat({ apiKey, messages, tools, systemPrompt })
      const assistantMsg = response.choices[0].message

      // Always push assistant reply into history
      messages.push(assistantMsg)

      if (hasToolCall(response)) {
        // ── ACT ──
        const toolCalls = extractToolCalls(response)

        for (const tc of toolCalls) {
          const name  = tc.function.name
          const input = JSON.parse(tc.function.arguments || '{}')

          onStep?.({ type: 'tool_call', content: `Calling tool: ${name}`, toolName: name, toolInput: input })

          // Execute the tool locally
          const executor = TOOL_EXECUTORS[name]
          let result
          if (executor) {
            result = await executor(input)
          } else {
            result = `[Tool "${name}" not found]`
          }

          onStep?.({ type: 'observation', content: `Tool result: ${JSON.stringify(result)}`, toolName: name, toolResult: result })

          // Feed result back to model
          messages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: typeof result === 'string' ? result : JSON.stringify(result),
          })
        }

        // Continue loop
        continue
      }

      // ── ANSWER ──
      const finalAnswer = extractText(response)
      onStep?.({ type: 'answer', content: finalAnswer })
      onDone?.(finalAnswer)
      return finalAnswer
    }

    // Exceeded iterations
    const fallback = 'Max iterations reached. The agent could not complete the task.'
    onStep?.({ type: 'answer', content: fallback })
    onDone?.(fallback)

  } catch (err) {
    onError?.(err.message)
  }
}

/**
 * Single-shot (non-agentic) call — used in Level 1 to demonstrate the limitation.
 */
export async function runSingleShot({ apiKey, message, systemPrompt }) {
  return deepseekChat({
    apiKey,
    messages: [{ role: 'user', content: message }],
    systemPrompt,
  })
}
