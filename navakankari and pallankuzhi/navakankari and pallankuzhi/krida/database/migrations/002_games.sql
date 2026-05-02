-- ── Migration 002: games table ────────────────────────────────

CREATE TYPE game_type_enum AS ENUM ('navakankari', 'pallankuzhi');
CREATE TYPE game_mode_enum AS ENUM ('ai', 'ranked', 'friendly', 'daily');

CREATE TABLE IF NOT EXISTS games (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type     game_type_enum NOT NULL,
  mode          game_mode_enum NOT NULL DEFAULT 'ai',
  player1_id    UUID REFERENCES players(id) ON DELETE SET NULL,
  player2_id    UUID REFERENCES players(id) ON DELETE SET NULL,
  winner_id     UUID,
  state_json    JSONB,
  total_moves   INTEGER DEFAULT 0,
  duration_sec  INTEGER,
  share_token   VARCHAR(12) UNIQUE,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_games_player1    ON games(player1_id);
CREATE INDEX IF NOT EXISTS idx_games_player2    ON games(player2_id);
CREATE INDEX IF NOT EXISTS idx_games_share_token ON games(share_token);
CREATE INDEX IF NOT EXISTS idx_games_type_mode  ON games(game_type, mode);
