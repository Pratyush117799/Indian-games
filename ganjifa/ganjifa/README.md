# Ganjifa — Traditional Indian Card Game
> **गंजिफा** · Ancient Mughal trick-taking card game · Full-Stack Web Implementation

Real-time multiplayer (2–6 players) · AI opponent (3 difficulties) · 3 themes · Hukm/Trump · Bishbar & Kambar ranking

---

## Three Themes

| Theme | Cards | Suits | Description |
|---|---|---|---|
| **Dashavatara** | 120 | 10 | Ten incarnations of Lord Vishnu |
| **Ramayana** | 96 | 8 | Heroes and villains of the epic |
| **Modern Warfare** | 120 | 10 | 21st-century weapons platforms |

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 · TypeScript · Tailwind · Framer Motion |
| State | Zustand · Socket.IO-client |
| Backend | Node.js · Express · Socket.IO |
| AI | Greedy trick-taking AI (card counting, 3 difficulties) |
| Database | PostgreSQL 15 |
| Auth | JWT access + refresh rotation · bcrypt |

---

## Project Structure

```
ganjifa/
├── cards/                         ← All card images (add after generation)
│   ├── dashavatara/{matsya,kurma,varaha,…}/{raja,mantri,1-10}.png
│   ├── ramayana/{rama,sita,lakshmana,…}/…
│   ├── geopolitics/{rafale,su57,…}/…
│   └── card-backs/
│
├── database/
│   ├── schema.sql                 # 8 tables + ELO trigger
│   └── seeds/themes.sql           # 3 themes seeded
│
├── backend/src/
│   ├── index.js                   # Express + Socket.IO + static /cards
│   ├── config/db.js
│   ├── game-logic/
│   │   ├── deck/cardDefinitions.js  # All 30 suits (10+8+10) defined
│   │   ├── deck/deckBuilder.js      # Build/shuffle/deal for any theme
│   │   ├── engine/engine.js         # Trick-taking state machine
│   │   ├── engine/engine.test.js    # 28 tests — all passing
│   │   └── ai/aiPlayer.js           # Greedy AI with card memory
│   ├── controllers/{auth,game,leaderboard}
│   ├── routes/{auth,rooms}
│   └── socket/index.js            # Full room + game + AI trigger
│
└── frontend/src/
    ├── app/
    │   ├── page.tsx               # Landing with 3 theme cards
    │   ├── lobby/page.tsx         # Create/join room + full config
    │   ├── game/[roomCode]/page.tsx  # Animated game table
    │   ├── leaderboard/page.tsx
    │   ├── history/page.tsx
    │   └── profile/page.tsx
    ├── components/
    │   ├── cards/CardFace.tsx     # Animated circular card + fallback
    │   ├── cards/CardHand.tsx     # Fan layout with spring physics
    │   ├── table/TrickArea.tsx    # 6-player centre table + sweep
    │   └── game/GameModals.tsx    # Hukm, RoundEnd, GameOver modals
    ├── store/{authStore,gameStore}.ts
    └── lib/{api,socket,suitData}.ts
```

---

## Quick Start

### Docker (one command)
```bash
cd ganjifa
docker-compose up
# Frontend → http://localhost:3002
# Backend  → http://localhost:5002
```

### Manual
```bash
# Database
psql -U postgres -c "CREATE USER ganjifa_user WITH PASSWORD 'ganjifa_pass';"
psql -U postgres -c "CREATE DATABASE ganjifa_db OWNER ganjifa_user;"
psql -U ganjifa_user -d ganjifa_db -f database/schema.sql
psql -U ganjifa_user -d ganjifa_db -f database/seeds/themes.sql

# Backend (port 5002)
cd backend
cp .env.example .env     # fill in JWT secrets
npm install && npm run dev

# Frontend (port 3002)
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5002" > .env.local
echo "NEXT_PUBLIC_SOCKET_URL=http://localhost:5002" >> .env.local
echo "NEXT_PUBLIC_CARDS_URL=http://localhost:5002" >> .env.local
npm install && npm run dev

# Tests
cd backend && npm test    # 28 engine tests
```

---

## Card Image Setup

After generating card images using Gemini/Grok (see prompts in Work 2 of the design document):

```
cards/dashavatara/matsya/raja.png
cards/dashavatara/matsya/mantri.png
cards/dashavatara/matsya/1.png
…
cards/dashavatara/matsya/10.png
cards/dashavatara/kurma/raja.png
… (repeat for all 10 suits)

cards/ramayana/rama/raja.png
… (8 suits × 12 cards)

cards/geopolitics/rafale/raja.png
… (10 suits × 12 cards)
```

Cards are served as static files by the backend at:
`http://localhost:5002/cards/{theme}/{suit}/{rank}.png`

The `CardFace` component shows a beautiful fallback (coloured circle with emoji + rank) while card images are being added — the game is **fully playable without images**.

---

## Game Rules (Implemented)

| Rule | Status |
|---|---|
| Bishbar suits: pip rank 10→1 (10 highest) | ✅ |
| Kambar suits: pip rank 1→10 (1 highest) | ✅ |
| Raja always beats Mantri | ✅ |
| Must follow led suit if possible | ✅ |
| Hukm (trump) beats all non-trump led-suit cards | ✅ |
| Trick winner leads next trick | ✅ |
| Multi-round scoring (most tricks = round point) | ✅ |
| Position repetition detection | ✅ |

## API Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/refresh` | — | Rotate tokens |
| GET  | `/api/auth/me` | ✓ | Current user |
| GET  | `/api/themes` | — | All 3 themes |
| POST | `/api/rooms` | ✓ | Create room |
| POST | `/api/rooms/:code/join` | ✓ | Join room |
| GET  | `/api/rooms/:code` | ✓ | Room state |
| GET  | `/api/leaderboard/:theme` | — | Top 30 by ELO |
| GET  | `/api/history` | ✓ | My sessions |

## Socket Events

```
Client → Server          Server → Client
────────────────         ────────────────────────
room:join                room:state
room:ready               room:start
room:leave               room:player_joined
room:chat                room:abandoned
game:hukm                room:message
game:skip_hukm           game:state
game:play                game:hukm_declared
game:next_round          game:trick_end
                         game:round_end
                         game:round_started
                         game:over
                         game:error
```

## Run Commands

```bash
cd ganjifa/backend
npm run dev     # Start API server on :5002
npm test        # Run 28 engine tests

cd ganjifa/frontend
npm run dev     # Start Next.js on :3002
```
