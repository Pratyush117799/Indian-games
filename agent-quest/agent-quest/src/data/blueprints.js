export const BLUEPRINTS = [
  {
    id: 'bare-llm',
    name: 'The Bare LLM',
    level: 1,
    rarity: 'Common',
    color: 'cyan',
    icon: '🤖',
    description: 'A raw language model with no tools, no loop, no memory. The foundation of everything. Simple but powerful — it knows the world from its training data.',
    code: `// The Bare LLM — Level 1
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${API_KEY}\`
  },
  body: JSON.stringify({
    model: 'deepseek-v4-flash',
    messages: [{ role: 'user', content: userMessage }],
  })
})

const data = await response.json()
const reply = data.choices[0].message.content`,
    stats: { tools: 0, memory: false, loop: false, agents: 1 },
  },
  {
    id: 'equipped-agent',
    name: 'The Equipped Agent',
    level: 2,
    rarity: 'Uncommon',
    color: 'purple',
    icon: '🔧',
    description: 'An LLM armed with function-calling tools. Can query real-time data, do calculations, and interact with external systems. Tools are the agent\'s hands.',
    code: `// The Equipped Agent — Level 2
const tools = [{
  type: 'function',
  function: {
    name: 'get_current_time',
    description: 'Returns the current time',
    parameters: { type: 'object', properties: {} }
  }
}]

const response = await deepseekChat({ messages, tools })
const toolCall = response.choices[0].message.tool_calls?.[0]

if (toolCall) {
  const result = await executeLocally(toolCall.function.name)
  // Feed result back to model...
}`,
    stats: { tools: 3, memory: false, loop: false, agents: 1 },
  },
  {
    id: 'react-agent',
    name: 'The ReAct Agent',
    level: 3,
    rarity: 'Rare',
    color: 'pink',
    icon: '🔄',
    description: 'Think. Act. Observe. Repeat. The agentic loop is the heartbeat of every autonomous AI system. The agent reasons and acts iteratively until the task is complete.',
    code: `// The ReAct Agent — Level 3
while (iterations < MAX) {
  // THINK
  const response = await deepseekChat({ messages, tools })
  
  if (hasToolCall(response)) {
    // ACT
    const result = await executeTool(response)
    
    // OBSERVE — feed result back
    messages.push({ role: 'tool', content: result })
    iterations++
    continue
  }
  
  // ANSWER — loop complete
  return extractText(response)
}`,
    stats: { tools: 5, memory: false, loop: true, agents: 1 },
  },
  {
    id: 'memory-agent',
    name: 'The Memory Agent',
    level: 4,
    rarity: 'Epic',
    color: 'amber',
    icon: '🧠',
    description: 'Remembers the past. Plans the future. Memory transforms an agent from a stateless responder into a persistent entity that learns across interactions.',
    code: `// The Memory Agent — Level 4
// Store a memory
memoryStore.set(key, value)

// Retrieve relevant memories
const relevant = await memoryStore.search(query)

// Include in system prompt
const systemPrompt = \`
  You are NOVA. 
  Your memories: \${relevant.join('\\n')}
  Use these to answer the user.
\`

// Run the loop with memory-augmented prompt
await runAgentLoop({ systemPrompt, tools, task })`,
    stats: { tools: 5, memory: true, loop: true, agents: 1 },
  },
  {
    id: 'agent-swarm',
    name: 'The Agent Swarm',
    level: 5,
    rarity: 'Legendary',
    color: 'green',
    icon: '🕸️',
    description: 'The pinnacle. Multiple specialized agents working in parallel under an orchestrator. Researcher, Coder, Writer — a full AI team tackling complex goals together.',
    code: `// The Agent Swarm — Level 5
const orchestrator = new Agent({ role: 'orchestrator' })
const researcher   = new Agent({ role: 'researcher', tools: [web_search] })
const coder        = new Agent({ role: 'coder',      tools: [read_file, write_file] })
const writer       = new Agent({ role: 'writer' })

// Orchestrator decomposes the goal
const plan = await orchestrator.plan(bigGoal)

// Run sub-agents in parallel
const results = await Promise.all([
  researcher.run(plan.researchTask),
  coder.run(plan.codeTask),
])

// Writer synthesizes the final output
return writer.run({ task: plan.writeTask, context: results })`,
    stats: { tools: 5, memory: true, loop: true, agents: 4 },
  },
]

export const RARITY_COLORS = {
  Common:    { color: '#00f5ff', label: 'Common' },
  Uncommon:  { color: '#bd00ff', label: 'Uncommon' },
  Rare:      { color: '#ff0090', label: 'Rare' },
  Epic:      { color: '#ffaa00', label: 'Epic' },
  Legendary: { color: '#00ff88', label: 'Legendary' },
}
