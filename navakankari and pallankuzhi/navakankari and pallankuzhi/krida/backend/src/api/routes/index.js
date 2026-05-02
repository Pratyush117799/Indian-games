import { Router }     from 'express'
import playerRoutes   from './players.js'
import gameRoutes     from './games.js'
import leaderboardRoutes from './leaderboard.js'
import xpRoutes       from './xp.js'

export const router = Router()

router.use('/players',     playerRoutes)
router.use('/games',       gameRoutes)
router.use('/leaderboard', leaderboardRoutes)
router.use('/xp',          xpRoutes)
