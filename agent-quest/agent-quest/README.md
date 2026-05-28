# 🤖 AgentQuest

> Learn to build AI agents through a cyberpunk interactive game.

AgentQuest is a 5-level game where you progressively build real AI agents — 
from a bare LLM to a full multi-agent swarm — powered by real DeepSeek API calls.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`, enter your DeepSeek API key, and start playing.

## 📦 Stack

- **React 18** + **Vite**
- **Tailwind CSS** — cyberpunk design tokens
- **Framer Motion** — animations
- **Zustand** — state management (persisted to localStorage)
- **Monaco Editor** — in-game code editor
- **DeepSeek API** — real LLM + tool calling

## 🎮 Levels

| Level | Concept | Key Feature |
|-------|---------|-------------|
| 1 | LLM Basics | Raw LLM, no tools — see the limits |
| 2 | Tool Calling | Equip tools, function calling |
| 3 | Agent Loop | ReAct pattern, loop visualizer |
| 4 | Memory | Short/long-term, memory inspector |
| 5 | Multi-Agent | Orchestrator + swarm, node graph |

## 🚀 Deploy

### Vercel (recommended)
```bash
npm i -g vercel
vercel
```

### GitHub Pages
1. Push to `main` branch
2. Go to repo Settings → Pages → Source: GitHub Actions
3. Set `VITE_BASE_URL` variable to `/your-repo-name/`
4. The workflow in `.github/workflows/deploy.yml` handles the rest

## 🔑 API Key

Get a free DeepSeek API key at [platform.deepseek.com](https://platform.deepseek.com).
Your key is stored only in your browser's `localStorage` — never sent to any server.

## 📁 Structure

```
src/
├── components/
│   ├── agent/        # AgentChat, LoopVisualizer, ToolBox, MemoryInspector
│   ├── layout/       # GameShell, HUD
│   ├── mascot/       # NOVA character + dialogue
│   ├── quiz/         # QuizPanel
│   └── ui/           # NeonButton, GlowCard, XPBar, TerminalText, CyberBadge
├── data/             # levels, quizzes, blueprints, mascot dialogues
├── hooks/            # useDeepSeek, useXP
├── levels/           # Level1–5 components
├── lib/              # deepseek client, agent runner, tools
├── pages/            # Landing, Onboarding, WorldMap, GamePage, BlueprintVault
└── store/            # usePlayerStore, useGameStore, useAgentStore
```
