'use strict';
const express = require('express');
const router  = express.Router();
const SaveModel = require('../../database/models/Save');
const { authMiddleware } = require('../middleware/auth');

const getSave = req => new SaveModel(req.app.locals.pool);

/* GET /api/save — load current user's save */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const save = await getSave(req).load(req.user.id);
    if (!save) return res.json({ save: null });
    res.json({ save: save.game_state, savedAt: save.saved_at });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load save' });
  }
});

/* POST /api/save — upsert save */
router.post('/', authMiddleware, async (req, res) => {
  const { gameState } = req.body;
  if (!gameState) return res.status(400).json({ error: 'gameState required' });
  try {
    const result = await getSave(req).save(req.user.id, gameState);
    res.json({ saved: true, savedAt: result.saved_at });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

/* DELETE /api/save — delete save (new game) */
router.delete('/', authMiddleware, async (req, res) => {
  try {
    await getSave(req).delete(req.user.id);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete save' });
  }
});

module.exports = router;
