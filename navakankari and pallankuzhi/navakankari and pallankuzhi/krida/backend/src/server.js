import express          from 'express'
import { createServer } from 'http'
import { Server }       from 'socket.io'
import cors             from 'cors'
import helmet           from 'helmet'
import rateLimit        from 'express-rate-limit'
import { ENV }          from '../config/env.js'
import { router }       from './api/routes/index.js'
import { initSocket }   from './websocket/gameRoom.js'

const app        = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: { origin: ENV.CLIENT_URL, methods: ['GET','POST'], credentials: true },
  pingTimeout:  20000,
  pingInterval: 10000,
  connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 },
})

// ── Middleware ──
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '16kb' }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500,
  message: { error: 'Too many requests' } }))

// ── REST Routes ──
app.use('/api', router)
app.get('/health', (_, res) => res.json({
  status: 'ok',
  ts:     new Date().toISOString(),
  env:    ENV.NODE_ENV,
}))

// ── WebSocket ──
initSocket(io)

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// ── Start ──
httpServer.listen(ENV.PORT, () => {
  console.log(`🏛  Krida backend · port ${ENV.PORT} · ${ENV.NODE_ENV}`)
})
