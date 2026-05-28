export const QUIZZES = {
  1: {
    levelId: 1,
    title: 'LLM Basics Check',
    questions: [
      {
        id: 'q1-1',
        text: 'What does LLM stand for?',
        options: ['Large Language Model', 'Logical Learning Machine', 'Linear Logic Matrix', 'Layered Learning Module'],
        answer: 0,
        explanation: 'LLM = Large Language Model. These are neural networks trained on vast text data to predict and generate language.',
      },
      {
        id: 'q1-2',
        text: 'Why couldn\'t NOVA answer "what\'s today\'s date?" without a tool?',
        options: [
          'She was too slow',
          'LLMs have a training cutoff and no real-time awareness',
          'The question was too hard',
          'DeepSeek doesn\'t support date questions',
        ],
        answer: 1,
        explanation: 'LLMs are frozen at their training cutoff. They have no live clock or internet access — that\'s what tools fix!',
      },
      {
        id: 'q1-3',
        text: 'What is a "hallucination" in AI?',
        options: [
          'The AI having visual experiences',
          'When an AI confidently generates false information',
          'A type of prompt injection',
          'When the model runs too slowly',
        ],
        answer: 1,
        explanation: 'Hallucination = the model generates plausible-sounding but factually wrong answers. A known weakness of LLMs.',
      },
    ],
  },
  2: {
    levelId: 2,
    title: 'Tool Calling Decoded',
    questions: [
      {
        id: 'q2-1',
        text: 'What is "function calling" in the context of AI agents?',
        options: [
          'Calling JavaScript functions',
          'The model requesting to run a predefined external function',
          'A type of recursive prompt',
          'Calling another AI model',
        ],
        answer: 1,
        explanation: 'Function calling lets the LLM emit a structured request to run a real-world function — like a web search or database query.',
      },
      {
        id: 'q2-2',
        text: 'In what format do AI tools typically define their parameters?',
        options: ['XML', 'CSV', 'JSON Schema', 'YAML'],
        answer: 2,
        explanation: 'Tools are described using JSON Schema, which tells the LLM what parameters to pass and what types they should be.',
      },
      {
        id: 'q2-3',
        text: 'What happens after an agent calls a tool?',
        options: [
          'The conversation ends',
          'The tool result is returned to the agent as a new message',
          'A new agent is created',
          'The model is retrained',
        ],
        answer: 1,
        explanation: 'The tool result is fed back into the conversation as a "tool" role message, so the agent can use it in its next response.',
      },
    ],
  },
  3: {
    levelId: 3,
    title: 'The Loop Explained',
    questions: [
      {
        id: 'q3-1',
        text: 'What does "ReAct" stand for in agentic AI?',
        options: ['Real Action', 'Reasoning + Acting', 'Recursive Active Tasks', 'React.js for Agents'],
        answer: 1,
        explanation: 'ReAct = Reasoning + Acting. The agent interleaves its thoughts (reasoning) with tool calls (acting) to solve problems step by step.',
      },
      {
        id: 'q3-2',
        text: 'In the agent loop, what is an "observation"?',
        options: [
          'The agent watching a video',
          'The result returned from a tool call',
          'The user\'s initial message',
          'A debug log',
        ],
        answer: 1,
        explanation: 'After the agent calls a tool, it receives the tool\'s output — called an "observation" — which it uses to reason about the next step.',
      },
      {
        id: 'q3-3',
        text: 'Why do agent loops have a max iteration limit?',
        options: [
          'To save API credits only',
          'To prevent infinite loops and runaway costs',
          'It\'s a hardware constraint',
          'Loops are unlimited in practice',
        ],
        answer: 1,
        explanation: 'Without a limit, a confused agent could loop forever. A max iteration guard prevents infinite loops and excessive API usage.',
      },
    ],
  },
  4: {
    levelId: 4,
    title: 'Memory Matters',
    questions: [
      {
        id: 'q4-1',
        text: 'What limits an agent\'s "short-term memory"?',
        options: ['RAM', 'The context window (token limit)', 'The tool count', 'Network speed'],
        answer: 1,
        explanation: 'Short-term memory = the context window. Every model has a token limit — once it\'s full, old context falls off.',
      },
      {
        id: 'q4-2',
        text: 'What is RAG?',
        options: [
          'Random Agent Generation',
          'Retrieval Augmented Generation — fetching relevant docs to ground the model',
          'Recursive Action Graph',
          'Real-time Agent Guidance',
        ],
        answer: 1,
        explanation: 'RAG lets an agent retrieve relevant documents from a database and include them in its context — a key technique for long-term memory.',
      },
      {
        id: 'q4-3',
        text: 'Which of these is a "long-term" memory strategy?',
        options: [
          'Putting everything in the system prompt',
          'Increasing max_tokens',
          'Storing summaries in a vector database and retrieving them',
          'Using a faster model',
        ],
        answer: 2,
        explanation: 'Vector databases let agents store and semantically retrieve memories across sessions — true long-term memory beyond the context window.',
      },
    ],
  },
  5: {
    levelId: 5,
    title: 'The Swarm Test',
    questions: [
      {
        id: 'q5-1',
        text: 'In a multi-agent system, what is an "orchestrator"?',
        options: [
          'A music tool for agents',
          'The agent that breaks down goals and delegates to specialist sub-agents',
          'The agent with the most tools',
          'The user interface layer',
        ],
        answer: 1,
        explanation: 'The orchestrator is like a project manager — it receives the big goal, plans sub-tasks, and routes them to the right specialist agents.',
      },
      {
        id: 'q5-2',
        text: 'What is a key advantage of multi-agent systems?',
        options: [
          'They\'re cheaper than single agents',
          'Parallelism — multiple agents work simultaneously on different sub-tasks',
          'They need no prompts',
          'They have unlimited memory',
        ],
        answer: 1,
        explanation: 'Parallelism is the superpower. While Agent A researches, Agent B writes code and Agent C drafts documentation — all at once.',
      },
      {
        id: 'q5-3',
        text: 'What is "agent communication" in a swarm?',
        options: [
          'Agents talking to humans only',
          'Structured message passing between agents to share results and context',
          'A type of prompt chaining',
          'A real-time voice system',
        ],
        answer: 1,
        explanation: 'Agents communicate by passing structured messages — one agent\'s output becomes another agent\'s input, forming a pipeline.',
      },
    ],
  },
}
