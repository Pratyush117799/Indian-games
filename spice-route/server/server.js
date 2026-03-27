import express from "express";
import cors from "cors";
import { saveGame, updateGame, getProgress, getHistory, getGameById } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(express.json());

app.post("/api/save", (req, res) => {
  try {
    const { playerId, gold, cargo, currentPortId, log, gameMode, completedAt, goalReached, gameId } = req.body;
    if (!playerId) {
      return res.status(400).json({ error: "playerId required" });
    }
    if (gameId) {
      updateGame(gameId, { gold, cargo, currentPortId, log, completedAt, goalReached });
      return res.json({ ok: true, updated: true, gameId });
    }
    const { id, createdAt } = saveGame({
      playerId,
      gold,
      cargo,
      currentPortId,
      log,
      gameMode,
      completedAt,
      goalReached,
    });
    res.json({ ok: true, gameId: id, createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/progress", (req, res) => {
  try {
    const playerId = req.query.playerId;
    if (!playerId) return res.status(400).json({ error: "playerId required" });
    const progress = getProgress(playerId);
    res.json(progress ? { ok: true, progress } : { ok: true, progress: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/history", (req, res) => {
  try {
    const playerId = req.query.playerId;
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 50);
    if (!playerId) return res.status(400).json({ error: "playerId required" });
    const history = getHistory(playerId, limit);
    res.json({ ok: true, history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/game/:id", (req, res) => {
  try {
    const playerId = req.query.playerId;
    if (!playerId) return res.status(400).json({ error: "playerId required" });
    const game = getGameById(parseInt(req.params.id, 10), playerId);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json({ ok: true, game });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Spice Route API running at http://localhost:${PORT}`);
});
