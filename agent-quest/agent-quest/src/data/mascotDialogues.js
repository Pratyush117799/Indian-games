/**
 * NOVA's dialogue lines.
 * mood: 'idle' | 'happy' | 'thinking' | 'excited' | 'warning' | 'celebrate'
 */
export const MASCOT_DIALOGUES = {
  // ── Global ──
  greeting: {
    text: "Namaste, Operator! I'm NOVA — your Neural Operations & Verification Agent. Ready to level up? 🚀",
    mood: 'excited',
  },
  onboarding: {
    text: "I need your DeepSeek API key to power up. Don't worry — it stays in your browser, koi server pe nahi jaata!",
    mood: 'thinking',
  },
  xpGained: (amount) => ({
    text: `+${amount} XP gained! Bahut badhiya! Keep going, Operator! ⚡`,
    mood: 'celebrate',
  }),
  levelComplete: (levelName) => ({
    text: `Level "${levelName}" complete! Blueprint unlocked. You're getting dangerous... 😏`,
    mood: 'celebrate',
  }),
  quizStart: {
    text: "Quiz time! Let's see if the concepts stuck. Darr mat — you've got this!",
    mood: 'thinking',
  },
  quizPass: {
    text: "Perfect score? Waah! You really understand this stuff. I'm impressed, Operator! 🏆",
    mood: 'celebrate',
  },
  quizFail: {
    text: "Oof, close! Review the concepts and try again. Failure = learning in disguise. 💪",
    mood: 'happy',
  },
  hintUsed: {
    text: "Hint used! Koi baat nahi — everyone needs a nudge sometimes. 😊",
    mood: 'happy',
  },

  // ── Level 1: Just a Chatbot ──
  level1: {
    intro: {
      text: "Right now I'm just a language model — trained on data, frozen in time. Try asking me today's date. Watch what happens...",
      mood: 'idle',
    },
    afterFail: {
      text: "See? I guessed! I have no real-time awareness. I need *tools* to know things beyond my training. That's your next mission.",
      mood: 'thinking',
    },
    challenge: {
      text: "Your challenge: prove my limitations. Ask me something I can't know — like live data or current events.",
      mood: 'happy',
    },
  },

  // ── Level 2: Arm the Agent ──
  level2: {
    intro: {
      text: "Now we're talking! You can give me tools — like superpowers. Drag them into my toolbox and watch me use function calling!",
      mood: 'excited',
    },
    toolEquipped: (toolName) => ({
      text: `Tool "${toolName}" equipped! Ab main yeh kaam kar sakti hoon! Try asking me something that uses it.`,
      mood: 'happy',
    }),
    toolUsed: (toolName) => ({
      text: `I just called the "${toolName}" tool! See how I sent a structured request and got a real result back?`,
      mood: 'excited',
    }),
  },

  // ── Level 3: The Loop ──
  level3: {
    intro: {
      text: "One tool call isn't enough for complex tasks. Enable my agent loop and watch me think → act → observe → repeat!",
      mood: 'thinking',
    },
    loopRunning: {
      text: "Loop activated! Watch each step in the visualizer — every iteration I get closer to the answer. Yeh magic nahi, logic hai!",
      mood: 'excited',
    },
    maxIterations: {
      text: "Whoa — I hit the iteration limit! That's why we need guards. Warna main aur tokens kha jaati! 😅",
      mood: 'warning',
    },
  },

  // ── Level 4: Memory ──
  level4: {
    intro: {
      text: "Without memory, I forget *everything* between conversations. Like a goldfish! Add a memory module to fix that.",
      mood: 'idle',
    },
    memoryEnabled: {
      text: "Memory chip installed! Now I can remember things across our conversation. Tell me something important — I'll store it!",
      mood: 'happy',
    },
    memoryRecalled: {
      text: "I remembered that from earlier! Dekha — memory kaam kar raha hai! This is how real AI assistants work.",
      mood: 'celebrate',
    },
  },

  // ── Level 5: Multi-Agent ──
  level5: {
    intro: {
      text: "The final frontier! One agent has limits. But a *team* of agents? Practically unstoppable. Build the swarm, Operator!",
      mood: 'excited',
    },
    orchestrating: {
      text: "Orchestrator thinking... I'm breaking the goal into sub-tasks and routing them to the right specialist. Team coordination in action!",
      mood: 'thinking',
    },
    swarmComplete: {
      text: "THE SWARM DID IT! Researcher → Coder → Writer, all working together. Yeh hai real-world AI architecture! 🌟",
      mood: 'celebrate',
    },
  },
}
