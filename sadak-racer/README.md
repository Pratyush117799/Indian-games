# 🏎️ Sadak Racer — Indian City Racing

> 5 Indian city tracks · 2 game modes · Traffic dodging · Police chases · 60fps Canvas

---

## Quick Start

```bash
# One command — PostgreSQL + backend + frontend
docker compose up

# Game  →  http://localhost:5173
# API   →  http://localhost:3001
```

**Local dev (no Docker):**
```bash
# DB
psql -U postgres -c "CREATE USER sadak_user WITH PASSWORD 'sadak_secret';"
psql -U postgres -c "CREATE DATABASE sadak_racer OWNER sadak_user;"
psql -U sadak_user -d sadak_racer -f database/migrations/001_initial.sql

# Backend
cd backend && cp .env.example .env && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

---

## Project Structure (42 files)

```
sadak-racer/
├── docker-compose.yml
├── database/
│   └── migrations/001_initial.sql
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── middleware/errorHandler.js
│   ├── routes/
│   │   ├── players.js
│   │   └── leaderboard.js
│   └── services/
│       ├── playerService.js
│       └── leaderboardService.js
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx               ← Screen router
        ├── main.jsx
        ├── styles/main.css
        ├── game/
        │   ├── constants.js      ← All game constants
        │   ├── engine/
        │   │   ├── GameLoop.js   ← rAF 60fps fixed-step loop
        │   │   ├── InputManager.js ← Keyboard + touch
        │   │   └── Physics.js    ← Player movement, collision, damage
        │   ├── maps/
        │   │   ├── mumbai.js     ← Marine Drive (night, sea)
        │   │   ├── maps.js       ← Delhi, Himalaya, Rajasthan, Chennai
        │   │   └── index.js
        │   ├── systems/
        │   │   ├── TrafficSystem.js  ← Spawn, move, collide (9 vehicle types)
        │   │   ├── PoliceSystem.js   ← Pursuit AI, siren, wanted levels
        │   │   ├── AISystem.js       ← 3 rival racers with overtaking AI
        │   │   └── ParticleSystem.js ← Crash, spark, dust, nitro, sand
        │   └── renderers/
        │       ├── BackgroundRenderer.js ← 5 parallax city themes
        │       ├── VehicleRenderer.js    ← All 9 vehicle types drawn in canvas
        │       ├── HUDRenderer.js        ← Speedometer, damage, nitro, position
        │       └── TopDownRenderer.js    ← Bird's eye mode renderer
        ├── hooks/
        │   ├── useRaceGame.js    ← Full game loop integration hook
        │   └── usePlayerProfile.js ← localStorage + backend sync
        └── components/
            ├── ui/GameCanvas.jsx
            └── screens/
                ├── MainMenu.jsx
                ├── MapSelect.jsx
                ├── ModeSelect.jsx
                ├── RaceResult.jsx
                ├── LeaderboardScreen.jsx
                └── SettingsScreen.jsx
```

---

## Gameplay

### Controls
| Key | Action |
|-----|--------|
| `↑` / `W` | Accelerate |
| `↓` / `S` | Brake |
| `←` / `A` | Lane left |
| `→` / `D` | Lane right |
| `Space`   | Nitro boost |
| `P` / `Esc` | Pause |
| Double-tap | Nitro (touch) |
| Swipe | Steer (touch) |

### Maps (5000m each)

| Map | Setting | Max Speed | Traffic | Special |
|-----|---------|-----------|---------|---------|
| 🌃 Mumbai | Marine Drive, night | 190 km/h | Heavy | Potholes, street lamps |
| 🏛️ Delhi | Ring Road, smog | 220 km/h | Chaos | Smog haze, cycle rickshaws |
| 🏔️ Himalaya | Mountain highway | 150 km/h | Light | Rock falls, tight lanes, truck convoys |
| 🌅 Rajasthan | Desert highway | 260 km/h | Sparse | Camels, sandstorm, open road |
| 🏖️ Chennai | ECR coastal | 240 km/h | Moderate | Palm trees, sea breeze, auto-rickshaws |

### Vehicles (9 types)
Car · Taxi · Auto-Rickshaw · Bus · Truck · Bike · Cycle · Camel · Police

### Game Modes
- **Side-Scroll** — classic Road Rash perspective, parallax backgrounds
- **Top-Down** — bird's eye view, unlocked by completing all 5 maps

### Scoring
- `+10` per 100m travelled
- `+50` per near miss (pass within 60px)
- `+300` escaping police pursuit
- Speed bonus: `+0.5 × speed` per second above 100 km/h

### Unlock Progression
```
Mumbai → Delhi → Himalaya → Rajasthan → Chennai → Top-Down Mode
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Rendering | HTML5 Canvas 2D (900×600, 60fps) |
| Frontend | React 18 + Vite 5 |
| Game loop | Fixed-step rAF (1/60s physics) |
| Backend | Node.js 20 + Express 4 |
| Database | PostgreSQL 16 |
| Deploy | Docker Compose |

---

## API

```
POST /api/players              Register / login player
GET  /api/players/:id          Get profile + progress
POST /api/players/:id/race     Submit race result + update progress
GET  /api/leaderboard          Global top 50 players
GET  /api/leaderboard/:mapId   Per-map leaderboard (?mode=side|topdown)
POST /api/leaderboard/submit   Submit race to leaderboard
```
