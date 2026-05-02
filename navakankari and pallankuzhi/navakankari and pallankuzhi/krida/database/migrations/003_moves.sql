-- ── Migration 003: move log ───────────────────────────────────

CREATE TABLE IF NOT EXISTS moves (
  id            BIGSERIAL PRIMARY KEY,
  game_id       UUID        NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  move_number   INTEGER     NOT NULL,
  player_id     UUID        REFERENCES players(id) ON DELETE SET NULL,
  move_data     JSONB       NOT NULL,
  time_taken_ms INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moves_game_id ON moves(game_id, move_number);
