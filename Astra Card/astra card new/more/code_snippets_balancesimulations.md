# ASTRA: Weapons of the Gods – Code Snippets, Balance Simulations, and Additional Prompts

This document delivers on your request with **three comprehensive sections**: 
1. **TypeScript code snippets** (focusing on a robust ability resolver, plus supporting mechanics like combat resolution and deployment).
2. **Balance simulations** (conceptual framework + executable pseudo-code/TypeScript for Monte Carlo testing).
3. **Additional refined prompts** (new UI/VFX prompts tied to mechanics integration, e.g., ability triggers).

All content builds directly on prior designs: 200-card JSON database, Classic/Clash modes, mythological counters, and digital prototype (React + Phaser + Vite). Code is production-ready, modular, and typed for your existing `types.ts`/`ClashEngine.ts`.

## 1. TypeScript Code Snippets: Ability Resolver & Core Mechanics

### Core Assumptions & Setup
- Use your existing `Weapon` interface (extended slightly for runtime).
- Game state interfaces for Classic (`ClassicGameState`) and Clash (`ClashGameState`).
- Ability system: Keyword-based (e.g., "Eternal", "Stun") for extensibility. Resolver is event-driven.

```typescript
// types.ts (extended from prior)
export interface Weapon {
  id: number;
  name: string;
  power: number;
  mantraCost: number;
  element: string; // e.g., "Divine/Fire"
  tier: "Supreme" | "Celestial" | "Elemental" | "Conventional";
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic";
  description: string;
  ability?: string; // e.g., "Eternal - returns to hand if destroyed" or keyword list
  counters: string[];
  counteredBy: string[];
}

// Split ability into keywords for parsing
export type AbilityKeyword = "Eternal" | "Stun" | "Return" | "Curse" | "Unstoppable" | "Cataclysm";

// Event types
export type GameEvent = "onPlay" | "onClash" | "onDestroy" | "onHit" | "onTurnEnd";