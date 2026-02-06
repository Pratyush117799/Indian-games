## Spice Route – Product & UI Plan

### Vision

- **Spice Route** is a web-based board game where children (10+) become young merchants sailing from **Kerala to Rome** along ancient spice routes.
- The experience should feel like a mix of:
  - **Storybook** (illustrated, narrative-driven),
  - **Adventure map** (exploration, discovery),
  - **Strategy game** (routes, resources, risk).

### Core Properties

- **Audience**: Kids 10+, families, educators.
- **Themes**: Ancient Indian trade, geography, weather & monsoons, economics, cultural exchange.
- **Pillars**:
  - Learn through **play and discovery**, not lectures.
  - Strong **emotional bond** with ship, avatar, ports, and spices.
  - Premium, cozy **board-game aesthetic**.

### Major Features (High Level)

- **Game Lobby**
  - Play Online / Play with Friends / Play vs AI / Practice Routes.
  - Merchant profile, titles (e.g. “Pepper Prince”, “Monsoon Master”), ship preview.
- **World Map**
  - Parchment-style map with **trade routes** and 50+ ports.
  - Zoom/pan, port tooltips (culture, spices, risk).
- **Spice Cards & Collection**
  - Collectible cards (art + facts) with rarities.
- **Weather & Event Cards**
  - Monsoons, storms, pirate attacks, special demand, etc.
- **Ship & Avatar Customization**
  - Cosmetic upgrades (sails, flags, lanterns) that evolve with progress.
- **Educational Layer**
  - Tooltips, short stories, geography facts, trade math overlays.
- **Onboarding & Tutorial**
  - First 5 minutes: story intro + guided first route.

### Frontend Implementation Plan (Current Scope)

#### Phase 1 – Visual Shell (this repo)

- [x] Set up **React + TypeScript + Vite + Tailwind** in `spice-route`.
- [x] Implement core layout:
  - `NavBar` with “Harbor” (Lobby) and “World Map” views.
  - `LobbyScreen` with four main play mode cards and profile sidebar.
  - `WorldMap` with sample ports (Muziris, Calicut, Aden, Alexandria, Rome).
- [ ] Add responsive layout tweaks for tablet/phone.
- [ ] Add basic accessibility (focus states, aria labels, reduced-motion support).

#### Phase 2 – Game Systems (planned)

- [ ] Design data model for **ports, routes, ships, players**.
- [ ] Implement route planning on map (click origin + destination).
- [ ] Add resource system for **spices, coins, cargo capacity**.
- [ ] Implement simple AI merchant for offline play.

#### Phase 3 – Education & Story

- [ ] Create content JSON for:
  - Ports (history, culture, spices).
  - Spices (facts, values, rarity).
  - Weather/events (monsoons, empires, navy power).
- [ ] Build **Spice Card** and **Event Card** components.
- [ ] Add “Learn” section / journal with unlocked stories.

#### Phase 4 – Multiplayer (later)

- [ ] Design online lobby flow (rooms, matchmaking).
- [ ] Implement real-time sync via websockets.
- [ ] Add fair scoring and leaderboards (optional).

### Files & Modules (Current)

- `src/App.tsx`
  - Root switch between **Lobby** and **World Map** views.
- `src/components/layout/NavBar.tsx`
  - Top navigation bar with brand and simple tab switching.
- `src/components/lobby/LobbyScreen.tsx`
  - Harbor lobby: play mode selection + basic profile panel.
- `src/components/map/WorldMap.tsx`
  - Stylized parchment map, sample ports, hover tooltip with risk & spices.
- `src/index.css`
  - Tailwind base + custom parchment, sea background, ship bob animation.

### Next Concrete Tasks

- [ ] Make lobby cards clickable stubs for future modes (show small modals).
- [ ] Add keyboard navigation and proper `aria-label`s to map ports.
- [ ] Add simple “Spice Card” mock component and mount it in a debug panel.
- [ ] Draft content structure for ports and spices (`data/ports.json`, `data/spices.json`).

