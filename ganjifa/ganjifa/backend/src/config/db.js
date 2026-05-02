const { Pool } = require('pg');
const logger   = require('../utils/logger');
const pool = new Pool({
  host: process.env.DB_HOST||'localhost', port: parseInt(process.env.DB_PORT||'5432'),
  database: process.env.DB_NAME||'ganjifa_db', user: process.env.DB_USER||'ganjifa_user',
  password: process.env.DB_PASSWORD||'', min:2, max:10,
  idleTimeoutMillis:30000, connectionTimeoutMillis:5000,
});
pool.on('error', err => logger.error('PG pool error:', err));
module.exports = { query:(t,p)=>pool.query(t,p), getClient:()=>pool.connect(), pool };
