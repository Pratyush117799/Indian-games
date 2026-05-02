const express = require('express');
const router  = express.Router();
const svc     = require('../services/leaderboardService');

// GET /api/leaderboard — global top players
router.get('/', async (req, res, next) => {
  try {
    const players = await svc.getGlobal(50);
    res.json({ players });
  } catch (err) { next(err); }
});

// GET /api/leaderboard/:mapId?mode=side — per-map
router.get('/:mapId', async (req, res, next) => {
  try {
    const { mode = 'side' } = req.query;
    const entries = await svc.getByMap(req.params.mapId, mode, 20);
    res.json({ entries });
  } catch (err) { next(err); }
});

// POST /api/leaderboard/submit
router.post('/submit', async (req, res, next) => {
  try {
    const id = await svc.submitRace(req.body);
    res.status(201).json({ id });
  } catch (err) { next(err); }
});

module.exports = router;
