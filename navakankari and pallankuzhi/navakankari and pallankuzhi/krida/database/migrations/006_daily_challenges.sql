-- ── Migration 006: daily challenges ──────────────────────────

CREATE TABLE IF NOT EXISTS daily_challenges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type     game_type_enum NOT NULL,
  date          DATE NOT NULL,
  challenge_data JSONB NOT NULL,   -- { boardState, goal, maxMoves }
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (game_type, date)
);

CREATE TABLE IF NOT EXISTS daily_completions (
  player_id     UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  challenge_id  UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  moves_taken   INTEGER,
  PRIMARY KEY (player_id, challenge_id)
);
