# Krida — Ancient Indian Games Platform

> Two games. Thousands of years. One board at a time.

**Navakankari** (नव कंकड़ी) and **Pallankuzhi** (பல்லாங்குழி) — playable online with AI opponents, player identity tags, XP progression, and real-time multiplayer.

---

## Project Structure

```
krida/
├── frontend/                 # React 18 + Vite SPA
│   ├── public/               # Static assets, PWA manifest
│   └── src/
│       ├── portals/          # Three portals: hub, navakankari, pallankuzhi
│       ├── components/       # Shared + game-specific React components
│       ├── game-engine/      # Pure JS game logic (no React)
│       │   ├── navakankari/  # boardGeometry, gameState, minimax AI
│       │   └── pallankuzhi/  # gameState, AI counter
│       ├── store/            # Redux Toolkit slices
│       ├── hooks/            # useAI, useGameSocket, useXP
│       ├── services/         # api.js, socket.js, soundEngine.js, tagGenerator.js
│       └── styles/           # Per-portal CSS + global design system
│
├── backend/                  # Node.js + Express + Socket.io
│   └── src/
│       ├── api/routes/       # players, games, leaderboard, xp
│       ├── api/middleware/   # auth (tag-based), validate (Zod)
│       ├── websocket/        # Socket.io game room manager
│       ├── game-engine/      # Server-side move validation (mirrors frontend)
│       ├── services/         # tagGenerator, notifyService
│       └── config/           # db.js (PostgreSQL pool)
│
└── database/
    ├── migrations/           # 001-006 SQL migration files
    ├── seeds/                # Achievement definitions, challenge data
    └── schemas/              # schema.dbml (dbdiagram.io compatible)
```

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 2. Install
```bash
cd krida
npm install              # installs root + all workspaces
```

### 3. Environment
```bash
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET
```

### 4. Database
```bash
psql -U postgres -c "CREATE DATABASE krida;"
psql krida < database/migrations/001_players.sql
psql krida < database/migrations/002_games.sql
psql krida < database/migrations/003_moves.sql
psql krida < database/migrations/004_xp_log.sql
psql krida < database/migrations/005_achievements.sql
psql krida < database/migrations/006_daily_challenges.sql
```

### 5. Run
```bash
npm run dev              # starts both frontend (5173) + backend (3001)
```

---

## Game Engines

### Navakankari
- **boardGeometry.js** — 24 nodes, adjacency list, 16 mill lines, edge pairs
- **gameState.js** — pure state machine: place / move / fly / remove / win-check
- **minimax.js** — alpha-beta pruning, depth 1/3/6, transposition table cache
  - Heuristic: piece count + mill threats + mobility + high-value node bonus

### Pallankuzhi
- **gameState.js** — clockwise sow order per player, 4-seed capture rule, win detection
- **aiCounter.js** — greedy look-ahead: scores captures + setup threats + seed advantage

---

## Player Identity

Every player receives a unique tag on first visit — no login required:
- Format: `#CulturalName-NNNN` (e.g. `#Arjun-4291`)
- Stored in `localStorage` + `players` DB table
- Used as auth header `X-Player-Tag` on all API calls
- Ranks: Pebble → Stone → Warrior → Scholar → Sage → Grandmaster

---

## Tech Stack

| Layer    | Technology                                  |
|----------|---------------------------------------------|
| Frontend | React 18, Vite, Redux Toolkit, Framer Motion |
| Styling  | Vanilla CSS (custom design system, no Tailwind) |
| Realtime | Socket.io (PvP rooms, spectator mode)       |
| Backend  | Node.js, Express 4, Zod validation          |
| Database | PostgreSQL 14, raw SQL (no ORM)             |
| Auth     | Tag-based (no password), JWT for sessions   |
| PWA      | Workbox, Web Push API                       |
| AI       | Alpha-beta minimax (Navakankari), greedy look-ahead (Pallankuzhi) |

---

## Deployment

- **Frontend** → Cloudflare Pages (`npm run build` → `frontend/dist/`)
- **Backend**  → Railway or Render (set `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`)
- **Database** → Supabase (managed PostgreSQL, free tier)

---

## Multiplayer Architecture

### Socket Events (full reference)

#### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `mm:join` | `{ gameType }` | Join ranked matchmaking queue |
| `mm:leave` | `{ gameType }` | Leave queue |
| `room:create` | `{ gameType }` | Create private room (returns 6-char code) |
| `room:join` | `{ roomId }` | Join private room by code |
| `game:move` | `{ move }` | Send a move (server validates before relaying) |
| `game:over` | `{ winner }` | Report game outcome |
| `game:resign` | `{}` | Forfeit the game |
| `game:rematch` | `{}` | Request rematch (both must send to trigger) |
| `ping` | `{}` | Heartbeat |

#### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `mm:queued` | `{ position, gameType }` | In queue, position N |
| `mm:matched` | `{ roomId, slot, opponentTag, gameType }` | Opponent found |
| `room:created` | `{ roomId, gameType }` | Private room ready |
| `room:joined` | `{ roomId, slot, opponentTag, gameType }` | Joined room |
| `room:error` | `{ msg }` | Room error (full, not found, etc.) |
| `game:start` | `{ roomId, gameType, initialState, isRematch }` | Game begins |
| `game:move` | `{ move, slot }` | Opponent's validated move |
| `game:invalid` | `{ reason }` | Your move was rejected |
| `game:state` | `{ state }` | Authoritative state resync |
| `game:over` | `{ winner }` | Game ended |
| `game:resign` | `{ slot }` | A player resigned |
| `game:rematch` | `{ slot }` | Opponent wants rematch |
| `opponent:left` | `{}` | Opponent disconnected |
| `pong` | `{}` | Heartbeat reply |

### Move Validation Flow
```
Human clicks node
       ↓
Frontend validates locally (instant feedback)
       ↓
Frontend sends game:move → Server
       ↓
Server validates with game-engine/[game]/validator.js
       ↓
  [ok]  →  Server relays move to opponent
            Opponent's frontend applies move locally
  [fail] → Server sends game:invalid + game:state resync
```

### Matchmaking
- Queue is in-memory (per server process)
- First-come, first-served pairing
- For production: use Redis pub/sub for multi-instance matchmaking
- Room TTL: 72 hours (for async games)

### Reconnection
- Socket.io connection state recovery enabled (2-min window)
- Client: 5 reconnection attempts with 1s delay
- On reconnect, server restores room membership via socket ID
