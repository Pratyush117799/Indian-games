import { Router } from 'express'
import { db }     from '../../config/db.js'

const router = Router()

// GET /api/leaderboard/:game?limit=20
router.get('/:game', async (req, res) => {
  try {
    const { game } = req.params
    const limit = Math.min(parseInt(req.query.limit ?? '20'), 100)
    const { rows } = await db.query(
      `SELECT p.tag_id, p.rank, p.xp_total,
              COUNT(g.id) FILTER (WHERE g.winner_id = p.id) AS wins,
              COUNT(g.id) AS total_games
       FROM players p
       LEFT JOIN games g ON g.player1_id = p.id OR g.player2_id = p.id
       WHERE ($1 = 'all' OR g.game_type = $1 OR g.id IS NULL)
       GROUP BY p.id
       ORDER BY p.xp_total DESC
       LIMIT $2`,
      [game, limit]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
