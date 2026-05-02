/**
 * db.js — PostgreSQL connection pool
 */
import pg from 'pg'
import { ENV } from '../../config/env.js'

const { Pool } = pg

export const db = new Pool({
  connectionString: ENV.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

db.on('error', (err) => {
  console.error('PostgreSQL pool error:', err)
})

export const query = (text, params) => db.query(text, params)
