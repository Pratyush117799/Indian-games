-- ── Migration 004: XP event log ──────────────────────────────

CREATE TYPE xp_event_enum AS ENUM (
  'win_easy','win_medium','win_hard','win_ranked',
  'daily','streak','achievement'
);

CREATE TABLE IF NOT EXISTS xp_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id   UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  event_type  VARCHAR(30) NOT NULL,
  xp_delta    INTEGER     NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_log_player ON xp_log(player_id, created_at DESC);
