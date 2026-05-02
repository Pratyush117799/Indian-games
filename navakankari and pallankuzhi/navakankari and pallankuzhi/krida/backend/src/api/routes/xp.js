import { Router } from 'express'
import { db }     from '../../config/db.js'
import { authMiddleware } from '../middleware/auth.js'
import { v4 as uuid } from 'uuid'

const XP_TABLE = {
  win_easy: 5, win_medium: 20, win_hard: 40,
  win_ranked: 60, daily: 15, streak: 10,
}

const RANK_THRESHOLDS = [
  [0,    'Pebble'],
  [50,   'Stone'],
  [200,  'Warrior'],
  [600,  'Scholar'],
  [1500, 'Sage'],
  [4000, 'Grandmaster'],
]

const calcRank = (xp) => {
  let rank = 'Pebble'
  for (const [threshold, name] of RANK_THRESHOLDS)
    if (xp >= threshold) rank = name
  return rank
}

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { event } = req.body
    const pts = XP_TABLE[event] ?? 0
    if (!pts) return res.json({ xp: 0 })

    // Log event
    await db.query(
      `INSERT INTO xp_log (id, player_id, event_type, xp_delta, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [uuid(), req.playerId, event, pts]
    )

    // Update player XP and rank
    const { rows } = await db.query(
      `UPDATE players SET xp_total = xp_total + $1, last_seen = NOW()
       WHERE id = $2 RETURNING xp_total`,
      [pts, req.playerId]
    )
    const newXP   = rows[0]?.xp_total ?? 0
    const newRank = calcRank(newXP)
    await db.query(`UPDATE players SET rank=$1 WHERE id=$2`, [newRank, req.playerId])

    res.json({ xp: newXP, rank: newRank, earned: pts })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
