-- ── Migration 001: players table ──────────────────────────────

CREATE TABLE IF NOT EXISTS players (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id           VARCHAR(30)  NOT NULL UNIQUE,
  display_name     VARCHAR(40),
  avatar_skin      VARCHAR(30)  DEFAULT 'default',
  xp_total         INTEGER      NOT NULL DEFAULT 0,
  rank             VARCHAR(20)  NOT NULL DEFAULT 'Pebble',
  streak_current   INTEGER      NOT NULL DEFAULT 0,
  streak_best      INTEGER      NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_seen        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_tag_id   ON players(tag_id);
CREATE INDEX IF NOT EXISTS idx_players_xp_total ON players(xp_total DESC);
