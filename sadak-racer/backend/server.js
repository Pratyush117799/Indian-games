require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');

const { errorHandler, notFound } = require('./middleware/errorHandler');
const playerRoutes      = require('./routes/players');
const leaderboardRoutes = require('./routes/leaderboard');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '500kb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, max: 300,
  message: { error: { message: 'Too many requests' } },
}));

app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));
app.use('/api/players',     playerRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🏎️  Sadak Racer API → http://localhost:${PORT}`);
  console.log(`   DB: ${process.env.DB_NAME || 'sadak_racer'}@${process.env.DB_HOST || 'localhost'}\n`);
});

module.exports = app;
