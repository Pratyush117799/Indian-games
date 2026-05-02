require('dotenv').config();
const http    = require('http');
const express = require('express');
const { Server } = require('socket.io');
const helmet  = require('helmet');
const cors    = require('cors');
const morgan  = require('morgan');
const rateLimit = require('express-rate-limit');
const path    = require('path');
const logger  = require('./utils/logger');
const { initSocket } = require('./socket');

const authRoutes  = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');
const gc          = require('./controllers/gameController');
const { authenticate } = require('./middleware/auth');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3002', credentials: true },
  transports: ['websocket', 'polling'],
});

initSocket(io);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3002', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev', { stream: { write: m => logger.info(m.trim()) } }));
app.use('/api', rateLimit({ windowMs: 15*60*1000, max: 200 }));

// Serve card images as static files
app.use('/cards', express.static(path.join(__dirname, '../../../cards'), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
  },
}));

app.get('/api/health', (_, res) => res.json({ status: 'ok', game: 'Ganjifa' }));
app.use('/api/auth',        authRoutes);
app.use('/api/rooms',       roomsRoutes);
app.get('/api/themes',      async (_, res, next) => {
  try {
    const db = require('./config/db');
    const { rows } = await db.query('SELECT * FROM themes WHERE is_active=true ORDER BY name');
    res.json({ themes: rows });
  } catch(err) { next(err); }
});
app.get('/api/leaderboard/:themeSlug', gc.getLeaderboard);
app.get('/api/history',     authenticate, gc.getHistory);

app.use((err, req, res, _next) => {
  logger.error(`${req.method} ${req.path}: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = parseInt(process.env.PORT || '5002');
server.listen(PORT, () => {
  logger.info(`🃏  Ganjifa API → http://localhost:${PORT}`);
  logger.info(`🔌  Socket.IO ready`);
});

module.exports = { app, server };
