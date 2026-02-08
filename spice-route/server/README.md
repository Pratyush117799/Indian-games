# Spice Route API (save & history)

SQLite-backed API for saving game progress and viewing game history.

## Setup

```bash
cd server
npm install
```

## Run

```bash
npm start
```

Runs on http://localhost:3000. The Vite dev server (port 5174) proxies `/api` to this server.

## Run game with database

1. **Terminal 1** – start the API:
   ```bash
   npm run server
   ```
   (from project root, or `cd server && npm start`)

2. **Terminal 2** – start the game:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5174. Use **Save game** / **Save & finish** in-game, **Resume saved game** and **Game history** in the lobby.

Data is stored in `server/spice-route.db` (SQLite).
