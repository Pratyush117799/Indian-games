import { create } from 'zustand'

export const useAgentStore = create((set, get) => ({
  // ── Equipped tools ──
  equippedTools: [],    // list of tool IDs currently in the agent's toolbox
  availableTools: [],   // tools unlocked for current level

  // ── Memory ──
  memoryEnabled: false,
  memoryEntries: [],    // [{ key, value, timestamp }]

  // ── Agent loop ──
  loopEnabled: false,
  loopSteps: [],        // [{ type: 'thought'|'tool_call'|'observation'|'answer', content, timestamp }]
  isRunning: false,
  stepIndex: 0,         // for step-through mode

  // ── Multi-agent ──
  agents: [],           // [{ id, role, status, messages }]
  orchestratorEnabled: false,

  // ── Actions ──
  setAvailableTools: (tools) => set({ availableTools: tools }),
  equipTool:   (id) => {
    const current = get().equippedTools
    if (!current.includes(id)) set({ equippedTools: [...current, id] })
  },
  unequipTool: (id) => set({ equippedTools: get().equippedTools.filter(t => t !== id) }),

  enableMemory:  () => set({ memoryEnabled: true }),
  disableMemory: () => set({ memoryEnabled: false }),
  addMemory:     (key, value) => set({
    memoryEntries: [...get().memoryEntries, { key, value, timestamp: Date.now() }]
  }),
  clearMemory:   () => set({ memoryEntries: [] }),

  enableLoop:  () => set({ loopEnabled: true }),
  disableLoop: () => set({ loopEnabled: false }),
  setRunning:  (v) => set({ isRunning: v }),

  addLoopStep: (step) => set({
    loopSteps: [...get().loopSteps, { ...step, timestamp: Date.now() }]
  }),
  clearLoop: () => set({ loopSteps: [], stepIndex: 0, isRunning: false }),
  nextStep:  () => set({ stepIndex: get().stepIndex + 1 }),

  enableOrchestrator: () => set({ orchestratorEnabled: true }),
  setAgents: (agents)  => set({ agents }),
  updateAgent: (id, patch) => set({
    agents: get().agents.map(a => a.id === id ? { ...a, ...patch } : a)
  }),

  resetAgent: () => set({
    equippedTools: [], loopSteps: [], memoryEntries: [],
    isRunning: false, stepIndex: 0, agents: [],
    loopEnabled: false, memoryEnabled: false, orchestratorEnabled: false,
  }),
}))
