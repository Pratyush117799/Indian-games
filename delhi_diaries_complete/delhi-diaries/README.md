# Delhi Diaries: Ultimate Edition
### 2D Top-Down Student RPG · Node.js + PostgreSQL + Vanilla JS

---

## Project Structure

```
delhi-diaries/
│
├── frontend/                   ← Served as static files by Express
│   ├── index.html              ← Auth overlay + full game UI
│   ├── css/
│   │   └── style.css           ← All styles: auth card, game HUD, modals
│   └── js/
│       ├── questions.js        ← 500 questions across 5 categories
│       ├── game.js             ← Full game engine: map, NPCs, debates, draw loop
│       └── auth.js             ← Login/signup UI + token management + save API
│
├── backend/
│   ├── server.js               ← Express entry point (port 3001)
│   ├── routes/
│   │   ├── auth.js             ← POST /api/auth/register & /login
│   │   ├── save.js             ← GET/POST/DELETE /api/save  (JWT protected)
│   │   └── leaderboard.js      ← GET /api/leaderboard
│   └── middleware/
│       └── auth.js             ← JWT verify + signToken()
│
├── database/
│   ├── schema.sql              ← users + saves tables + leaderboard view
│   └── models/
│       ├── User.js             ← create, findByUsername, verifyPassword
│       └── Save.js             ← save (upsert), load, leaderboard
│
├── package.json
└── README.md
```

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. PostgreSQL
```bash
createdb delhi_diaries
export DATABASE_URL=postgresql://localhost/delhi_diaries
npm run db:init       # runs database/schema.sql
```

### 3. Run
```bash
npm run dev           # nodemon, port 3001
# or
npm start
```

Open `http://localhost:3001` — the auth screen will appear first.

---

## Auth Flow
- **Sign Up** — username + password (no email). Username: 3-32 chars, alphanumeric + _.
- **Login** — returns a JWT (7-day expiry) stored in `localStorage`.
- **Auto-login** — on page load the stored token is validated; if valid, game boots straight to last save.
- **Guest mode** — play without an account; progress is NOT saved to server.
- **Logout** — clears token, returns to auth screen.

---

## Saving
- **Ctrl+S** (keyboard shortcut) or the **💾 Save Game** button in the sidebar.
- Saves are stored server-side in PostgreSQL as JSONB.
- One save slot per account (overwritten on each save).
- On login, the saved game state is automatically loaded.

---

## Question Bank (questions.js)
| Category    | Count | Used for debate type             |
|-------------|-------|----------------------------------|
| Philosophy  | 100   | Intellects Club debates          |
| Politics    | 100   | Parliament policy debates        |
| Science     | 100   | DU Admin interview               |
| History     | 100   | DU Student scholarship debates   |
| Delhi GK    | 100   | Street wager citizens            |
**Total: 500 questions**

---

## Improvements over original
| Issue                     | Fix                                                     |
|---------------------------|---------------------------------------------------------|
| Canvas focus breaking     | `setTimeout(canvas.focus, 10)` after every button click |
| NPCs standing still       | `tickNPCs()` called in rAF loop — citizens roam roads   |
| Single shared question pool | Each debate type draws from its matching category      |
| No save system            | JWT + PostgreSQL JSONB save/load                        |
| No auth                   | Full login/register/logout with bcrypt + JWT            |
| Event-driven redraw       | `requestAnimationFrame` loop for smooth NPC movement    |

---

## Environment Variables
| Variable       | Default                              | Description        |
|----------------|--------------------------------------|--------------------|
| `DATABASE_URL` | `postgresql://localhost/delhi_diaries` | Postgres connection |
| `JWT_SECRET`   | `delhi-diaries-secret-change-in-prod` | JWT signing key    |
| `PORT`         | `3001`                               | HTTP port          |
