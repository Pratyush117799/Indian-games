const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'sadak_racer',
  user:     process.env.DB_USER     || 'sadak_user',
  password: process.env.DB_PASSWORD || 'sadak_secret',
  max: 20, idleTimeoutMillis: 30000, connectionTimeoutMillis: 2000,
});

pool.on('error', err => console.error('PG error:', err));

async function query(text, params) { return pool.query(text, params); }

async function migrate() {
  const dir = path.join(__dirname, '../../database/migrations');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()) {
    console.log('Running:', f);
    await pool.query(fs.readFileSync(path.join(dir, f), 'utf8'));
    console.log('  ✓');
  }
}

module.exports = { pool, query, migrate };
