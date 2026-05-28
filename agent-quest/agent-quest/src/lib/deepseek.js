const DEEPSEEK_BASE = 'https://api.deepseek.com/v1'

/**
 * Core chat completion call to DeepSeek.
 * Mirrors the OpenAI API format.
 */
export async function deepseekChat({ apiKey, messages, tools, systemPrompt, model = 'deepseek-v4-flash' }) {
  const body = {
    model,
    messages: [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages,
    ],
    ...(tools?.length ? { tools, tool_choice: 'auto' } : {}),
    temperature: 0.7,
    max_tokens: 1024,
  }

  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }))
    throw new Error(err?.error?.message || `DeepSeek API error: ${res.status}`)
  }

  return res.json()
}

/**
 * Validate that a key works by sending a tiny test message.
 */
export async function validateApiKey(apiKey) {
  try {
    await deepseekChat({
      apiKey,
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'deepseek-v4-flash',
    })
    return { valid: true }
  } catch (err) {
    return { valid: false, error: err.message }
  }
}

/**
 * Extract the assistant's text reply from a completion response.
 */
export function extractText(response) {
  return response?.choices?.[0]?.message?.content || ''
}

/**
 * Extract any tool calls from a completion response.
 */
export function extractToolCalls(response) {
  return response?.choices?.[0]?.message?.tool_calls || []
}

/**
 * Check if the model wants to call a tool.
 */
export function hasToolCall(response) {
  return extractToolCalls(response).length > 0
}
