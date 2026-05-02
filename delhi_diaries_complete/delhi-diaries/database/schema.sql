-- ════════════════════════════════════════════════════════════
-- Delhi Diaries — Database Schema (PostgreSQL)
-- ════════════════════════════════════════════════════════════

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(32) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  last_login    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ── Game Saves ───────────────────────────────────────────────
-- One active save per user (upsert on save)
CREATE TABLE IF NOT EXISTS saves (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  game_state  JSONB NOT NULL,
  saved_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saves_user ON saves(user_id);

-- ── Leaderboard view ─────────────────────────────────────────
-- Derived from save's game_state JSON
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  u.username,
  (s.game_state -> 'player' ->> 'money')::INTEGER        AS money,
  (s.game_state -> 'player' ->> 'level')::INTEGER        AS level,
  (s.game_state -> 'player' ->> 'xp')::INTEGER           AS xp,
  (s.game_state -> 'player' ->> 'day')::INTEGER          AS day,
  (s.game_state -> 'player' ->> 'intellectScore')::INTEGER AS club_score,
  s.saved_at
FROM saves s
JOIN users u ON u.id = s.user_id
ORDER BY money DESC, level DESC;
