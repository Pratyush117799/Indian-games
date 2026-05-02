/**
 * auth.js — Tag-based auth middleware
 * Reads X-Player-Tag header, looks up player in DB, attaches playerId to req.
 */
import { db } from '../../config/db.js'

export const authMiddleware = async (req, res, next) => {
  const tag = req.headers['x-player-tag']
  if (!tag) return res.status(401).json({ error: 'Missing player tag' })

  try {
    const { rows } = await db.query(
      'SELECT id FROM players WHERE tag_id = $1', [tag]
    )
    if (!rows.length) return res.status(401).json({ error: 'Unknown player tag' })
    req.playerId = rows[0].id
    next()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
