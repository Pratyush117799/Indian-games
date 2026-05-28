/**
 * Tool definitions in OpenAI / DeepSeek function-calling format.
 * Each tool has a schema (sent to the LLM) and a local executor (run in browser).
 */

// ── Schemas (sent to the model) ────────────────────────────────────────────

export const TOOL_SCHEMAS = {
  get_current_time: {
    type: 'function',
    function: {
      name: 'get_current_time',
      description: 'Returns the current date and time.',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },

  calculator: {
    type: 'function',
    function: {
      name: 'calculator',
      description: 'Evaluate a mathematical expression and return the numeric result.',
      parameters: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: 'A valid mathematical expression, e.g. "2 + 2 * 10"',
          },
        },
        required: ['expression'],
      },
    },
  },

  web_search: {
    type: 'function',
    function: {
      name: 'web_search',
      description: 'Search the web for current information on a given query. Returns a mock result for the learning game.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query string.',
          },
        },
        required: ['query'],
      },
    },
  },

  read_file: {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Read the contents of a named file from the agent\'s virtual filesystem.',
      parameters: {
        type: 'object',
        properties: {
          filename: {
            type: 'string',
            description: 'The name of the file to read.',
          },
        },
        required: ['filename'],
      },
    },
  },

  write_file: {
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Write content to a file in the agent\'s virtual filesystem.',
      parameters: {
        type: 'object',
        properties: {
          filename: { type: 'string' },
          content:  { type: 'string' },
        },
        required: ['filename', 'content'],
      },
    },
  },

  send_message: {
    type: 'function',
    function: {
      name: 'send_message',
      description: 'Send a message to another agent in a multi-agent system.',
      parameters: {
        type: 'object',
        properties: {
          agent_id: { type: 'string', description: 'Target agent ID' },
          message:  { type: 'string', description: 'Message content' },
        },
        required: ['agent_id', 'message'],
      },
    },
  },
}

// ── Local executors (run in the browser) ───────────────────────────────────

// Virtual filesystem for the game
const virtualFS = {}

export const TOOL_EXECUTORS = {
  get_current_time: async () => {
    return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  },

  calculator: async ({ expression }) => {
    try {
      // Safe eval using Function (not direct eval)
      // Only allows numbers and operators
      const sanitized = expression.replace(/[^0-9+\-*/().% ]/g, '')
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${sanitized})`)()
      return { result, expression }
    } catch {
      return { error: 'Invalid expression' }
    }
  },

  web_search: async ({ query }) => {
    // Mock results for the learning game
    const mockResults = {
      weather: 'Today in Delhi: 34°C, partly cloudy. Humidity 65%.',
      default: `Mock search result for "${query}": This is a simulated web search result used for learning. In a real agent, this would return live web data.`,
    }
    const key = Object.keys(mockResults).find(k => query.toLowerCase().includes(k))
    return { query, result: mockResults[key] || mockResults.default }
  },

  read_file: async ({ filename }) => {
    const content = virtualFS[filename]
    if (!content) return { error: `File "${filename}" not found in virtual filesystem.` }
    return { filename, content }
  },

  write_file: async ({ filename, content }) => {
    virtualFS[filename] = content
    return { success: true, filename, bytes: content.length }
  },

  send_message: async ({ agent_id, message }) => {
    return { sent: true, agent_id, message, timestamp: new Date().toISOString() }
  },
}

/**
 * Get tool schemas by ID for a given level's toolbox.
 */
export function getToolSchemas(toolIds) {
  return toolIds.map(id => TOOL_SCHEMAS[id]).filter(Boolean)
}
