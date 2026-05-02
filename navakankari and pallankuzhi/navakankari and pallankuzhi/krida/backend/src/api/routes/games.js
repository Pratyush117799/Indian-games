import { Router } from 'express'
import { db }     from '../../config/db.js'
import { v4 as uuid } from 'uuid'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

// POST /api/games — start a new game session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { gameType, mode } = req.body
    const { rows } = await db.query(
      `INSERT INTO games (id, game_type, mode, player1_id, started_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [uuid(), gameType, mode, req.playerId]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/games/:id — update game result
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { winnerId, totalMoves, durationSec } = req.body
    const { rows } = await db.query(
      `UPDATE games SET winner_id=$1, total_moves=$2, duration_sec=$3, ended_at=NOW()
       WHERE id=$4 RETURNING *`,
      [winnerId, totalMoves, durationSec, req.params.id]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
