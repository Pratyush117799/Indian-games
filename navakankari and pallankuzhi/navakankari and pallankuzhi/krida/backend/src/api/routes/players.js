import { Router } from 'express'
import { z }      from 'zod'
import { db }     from '../../config/db.js'
import { v4 as uuid } from 'uuid'

const router = Router()

const CreatePlayerSchema = z.object({
  tagId: z.string().min(4).max(30),
})

// POST /api/players — register a new player tag
router.post('/', async (req, res) => {
  try {
    const { tagId } = CreatePlayerSchema.parse(req.body)

    // Upsert: if tag already exists, return it
    const existing = await db.query(
      'SELECT * FROM players WHERE tag_id = $1', [tagId]
    )
    if (existing.rows.length) return res.json(existing.rows[0])

    const { rows } = await db.query(
      `INSERT INTO players (id, tag_id, xp_total, rank, streak_current, streak_best, created_at, last_seen)
       VALUES ($1, $2, 0, 'Pebble', 0, 0, NOW(), NOW())
       RETURNING *`,
      [uuid(), tagId]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET /api/players/:tagId
router.get('/:tagId', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM players WHERE tag_id = $1', [req.params.tagId]
    )
    if (!rows.length) return res.status(404).json({ error: 'Not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
