# Rangoli Builder — Complete Setup & Deployment Guide

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20+ | https://nodejs.org |
| npm | 9+ | bundled with Node |
| MongoDB | Atlas (free tier) | https://mongodb.com/atlas |
| Git | any | https://git-scm.com |
| Docker (optional) | 24+ | https://docker.com |

---

## Local Development Setup

### Step 1 — Clone and install

```bash
git clone <your-repo-url>
cd rangoli-builder

# Frontend dependencies
npm install

# Backend dependencies
cd backend && npm install && cd ..
```

### Step 2 — MongoDB Atlas (free tier)

1. Go to https://mongodb.com/atlas → Create free account
2. Create a free M0 cluster (any region)
3. Database Access → Add user → username + password (save these)
4. Network Access → Add IP → "Allow from anywhere" (0.0.0.0/0) for dev
5. Clusters → Connect → Drivers → Copy the connection string
   - Looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

### Step 3 — Environment files

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
```
Then edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster0.xxxxx.mongodb.net/rangoli-builder
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
JWT_REFRESH_SECRET=<run the same command again for a different value>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

**Frontend** (`frontend root .env`):
```bash
cp .env.example .env
```
`.env` contents (defaults work for local dev):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 4 — Seed the database

```bash
cd backend && npm run seed
```
This creates 50 official rangoli patterns across all 8 festivals.

### Step 5 — Run

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# ✅ MongoDB connected
# 🎨 Rangoli Builder API running on port 5000
```

**Terminal 2 — Frontend:**
```bash
npm run dev
# ➜ Local:   http://localhost:5173
```

Open **http://localhost:5173** — the game is live.

---

## Docker Compose (full stack, one command)

```bash
# 1. Set up env files (same as Step 3 above)
cp .env.example .env
cp backend/.env.example backend/.env
# Edit backend/.env with your MONGO_URI and JWT secrets

# 2. Start everything
docker-compose up --build

# Services:
# Frontend  → http://localhost:5173
# Backend   → http://localhost:5000
# MongoDB   → localhost:27017 (local container, no Atlas needed)
```

For Docker, use this MONGO_URI in `backend/.env`:
```env
MONGO_URI=mongodb://mongo:27017/rangoli-builder
```

---

## Production Deployment

### Frontend → Vercel (recommended, free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Root directory: . (the project root)
# - Framework: Vite
# - Build command: npm run build
# - Output dir: dist

# Set environment variables in Vercel dashboard:
# VITE_API_URL     = https://your-backend.railway.app/api
# VITE_SOCKET_URL  = https://your-backend.railway.app
```

Or connect GitHub repo → Vercel auto-deploys on every push to main.

### Backend → Railway (recommended, $5/month or free trial)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Deploy
cd backend
railway up

# Set environment variables in Railway dashboard:
# PORT              = 5000
# NODE_ENV          = production
# MONGO_URI         = mongodb+srv://...  (your Atlas URI)
# JWT_SECRET        = <your secret>
# JWT_REFRESH_SECRET= <your other secret>
# CLIENT_ORIGIN     = https://your-frontend.vercel.app
```

Railway auto-detects the Dockerfile in `backend/`.

### After deploy — seed production DB

```bash
# In backend/.env set MONGO_URI to production Atlas URI, then:
cd backend && npm run seed
```

---

## Verification Checklist

After setup, confirm these work:

```bash
# Backend health
curl http://localhost:5000/api/health
# → {"status":"ok","timestamp":"..."}

# Festival list
curl http://localhost:5000/api/festivals
# → ["diwali","holi","makar-sankranti",...]

# Patterns (should show 50 after seeding)
curl "http://localhost:5000/api/patterns?limit=5"
# → {"patterns":[...],"total":50,...}

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"Test@1234"}'
# → {"accessToken":"...","user":{...}}
```

---

## Project Structure (quick reference)

```
rangoli-builder/
├── src/                          # React frontend
│   ├── components/
│   │   ├── canvas/               # RangolicCanvas, PolarGrid, TileRenderer
│   │   ├── modes/                # FreeBuild, Festival, Puzzle, Symmetry, PartBuild
│   │   ├── tiles/                # TilePicker, ColorPalette
│   │   ├── timer/                # CountdownTimer
│   │   └── ui/                   # XPToast, SaveDesignModal, FestivalBadge, DailyBanner
│   ├── pages/                    # Home, Game, Auth, Profile, Gallery, Leaderboard, Lobby, GameRoom
│   ├── store/                    # canvasStore, gameStore, userStore, roomStore (Zustand)
│   ├── hooks/                    # useSocket, useTimer, usePuzzleValidator
│   ├── data/                     # festivals.js (8 festivals), tileShapes.js (10 shapes)
│   └── utils/                    # symmetryEngine, scoreCalculator, apiClient, svgExporter
│
├── backend/src/                  # Node.js + Express + Socket.IO
│   ├── models/                   # User, Pattern, GameSession, Challenge, Room
│   ├── controllers/              # auth, pattern, game, leaderboard
│   ├── routes/                   # auth, patterns, festivals, game, leaderboard
│   ├── socket/                   # lobby, game, chat handlers
│   └── services/                 # challengeService (daily cron, midnight IST)
│
├── docker-compose.yml            # Full local stack
├── vercel.json                   # Frontend deploy config
├── backend/railway.toml          # Backend deploy config
├── backend/Dockerfile            # Backend container
├── Dockerfile.frontend           # Frontend nginx container
└── .github/workflows/ci.yml      # GitHub Actions CI
```

---

## Game Routes

| URL | Description |
|---|---|
| `/` | Home — festival selector |
| `/auth` | Login / Register |
| `/profile` | XP, badges, history |
| `/game/free/diwali` | Free Build — Diwali |
| `/game/festival/holi/easy` | Festival Timed — Holi Easy |
| `/game/symmetry/navratri` | Symmetry Challenge |
| `/game/puzzle/onam?patternId=...` | Puzzle Mode |
| `/game/partbuild/diwali/expert` | Part-Build (3 parts) |
| `/lobby` | Multiplayer lobby |
| `/room/ABC123` | Live game room |
| `/leaderboard` | Rankings |
| `/gallery` | Community designs |

---

## Demo Script (3-minute hackathon pitch)

1. **Home page** (20s) — show festival carousel, explain 8 Indian festivals
2. **Free Build — Diwali** (40s) — place tiles, show 8-axis live mirroring, switch to 12-axis
3. **Symmetry Challenge** (30s) — start, show milestone XP toasts
4. **Festival Mode — Holi Easy** (40s) — start game, show timer + score HUD
5. **Multiplayer Lobby** (20s) — create a room, show room code, explain modes
6. **Profile page** (15s) — XP bar, level, badge grid, game history
7. **Leaderboard** (15s) — festival tabs, global rankings
