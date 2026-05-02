'use strict';
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const { Pool } = require('pg');

const authRoutes        = require('./routes/auth');
const saveRoutes        = require('./routes/save');
const leaderboardRoutes = require('./routes/leaderboard');

const app  = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://localhost/delhi_diaries' });

app.locals.pool = pool;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth',        authRoutes);
app.use('/api/save',        saveRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', game: 'Delhi Diaries' }));

/* Serve frontend for all other routes */
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`[Delhi Diaries] Server on port ${PORT}`));

module.exports = app;
