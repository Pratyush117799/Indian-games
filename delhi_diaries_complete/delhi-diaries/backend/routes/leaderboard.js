'use strict';
const express = require('express');
const router  = express.Router();
const SaveModel = require('../../database/models/Save');

/* GET /api/leaderboard — top 10 by money */
router.get('/', async (req, res) => {
  try {
    const rows = await new SaveModel(req.app.locals.pool).leaderboard(10);
    res.json({ leaderboard: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;
