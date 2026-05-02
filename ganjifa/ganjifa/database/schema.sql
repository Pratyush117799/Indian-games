-- ============================================================
-- GANJIFA — Traditional Indian Card Game Platform
-- PostgreSQL Schema  |  2–6 Players  |  Trick-taking
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username      VARCHAR(30)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);
CREATE INDEX idx_u_email    ON users(email);
CREATE INDEX idx_u_username ON users(username);

-- ── Refresh Tokens ───────────────────────────────────────────
CREATE TABLE refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT        NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Themes (card decks) ──────────────────────────────────────
CREATE TABLE themes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        VARCHAR(30) NOT NULL UNIQUE,   -- 'dashavatara'|'ramayana'|'geopolitics'
  name        VARCHAR(80) NOT NULL,
  description TEXT,
  total_suits INT NOT NULL,                   -- 10 or 8
  cards_per_suit INT DEFAULT 12,
  total_cards INT GENERATED ALWAYS AS (total_suits * cards_per_suit) STORED,
  is_active   BOOLEAN DEFAULT TRUE,
  card_base_url TEXT NOT NULL               -- '/cards/dashavatara/'
);

-- ── Game Rooms ───────────────────────────────────────────────
CREATE TYPE room_status AS ENUM ('waiting','active','finished','abandoned');

CREATE TABLE game_rooms (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_code     VARCHAR(8) NOT NULL UNIQUE,
  host_id       UUID       NOT NULL REFERENCES users(id),
  theme_id      UUID       NOT NULL REFERENCES themes(id),
  max_players   INT        NOT NULL DEFAULT 3 CHECK (max_players BETWEEN 2 AND 6),
  num_rounds    INT        NOT NULL DEFAULT 3,
  is_vs_ai      BOOLEAN    DEFAULT FALSE,
  ai_difficulty VARCHAR(10) DEFAULT 'medium',
  hukm_allowed  BOOLEAN    DEFAULT TRUE,
  status        room_status DEFAULT 'waiting',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  started_at    TIMESTAMPTZ,
  finished_at   TIMESTAMPTZ
);
CREATE INDEX idx_rooms_code   ON game_rooms(room_code);
CREATE INDEX idx_rooms_status ON game_rooms(status);

-- ── Room Players (seat assignments) ──────────────────────────
CREATE TABLE room_players (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id     UUID NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES users(id),
  seat_index  INT  NOT NULL,
  is_ai       BOOLEAN DEFAULT FALSE,
  is_ready    BOOLEAN DEFAULT FALSE,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(room_id, user_id),
  UNIQUE(room_id, seat_index)
);
CREATE INDEX idx_rp_room ON room_players(room_id);

-- ── Game Sessions (one complete multi-round game) ─────────────
CREATE TABLE game_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id         UUID NOT NULL REFERENCES game_rooms(id),
  theme_id        UUID NOT NULL REFERENCES themes(id),
  winner_id       UUID REFERENCES users(id),
  total_rounds    INT  DEFAULT 0,
  duration_secs   INT,
  final_scores    JSONB,           -- { userId: totalScore }
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  ended_at        TIMESTAMPTZ
);
CREATE INDEX idx_gs_room   ON game_sessions(room_id);
CREATE INDEX idx_gs_winner ON game_sessions(winner_id);

-- ── Rounds (one deal+play cycle per session) ──────────────────
CREATE TABLE rounds (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id    UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  round_number  INT  NOT NULL,
  hukm_suit     VARCHAR(30),          -- trump suit slug, null if no hukm
  hukm_declared_by UUID REFERENCES users(id),
  scores        JSONB,                -- { userId: tricksWon }
  winner_id     UUID REFERENCES users(id),
  completed_at  TIMESTAMPTZ
);
CREATE INDEX idx_rounds_session ON rounds(session_id);

-- ── Tricks (individual trick within a round) ──────────────────
CREATE TABLE tricks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id      UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  trick_number  INT  NOT NULL,
  led_suit      VARCHAR(30) NOT NULL,
  winner_id     UUID REFERENCES users(id),
  cards_played  JSONB NOT NULL,    -- [{playerId, suit, rank, value}]
  completed_at  TIMESTAMPTZ
);
CREATE INDEX idx_tricks_round ON tricks(round_id);

-- ── Leaderboard ───────────────────────────────────────────────
CREATE TABLE leaderboard (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme_id        UUID NOT NULL REFERENCES themes(id),
  wins            INT  DEFAULT 0,
  losses          INT  DEFAULT 0,
  total_games     INT  DEFAULT 0,
  total_tricks    INT  DEFAULT 0,
  win_rate        NUMERIC(5,2) DEFAULT 0.00,
  rating          INT  DEFAULT 1000,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, theme_id)
);
CREATE INDEX idx_lb_theme_rating ON leaderboard(theme_id, rating DESC);

-- ── Triggers ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at=NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_upd BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION recalc_win_rate()
RETURNS TRIGGER AS $$
BEGIN
  NEW.win_rate = CASE WHEN NEW.total_games>0
    THEN ROUND((NEW.wins::NUMERIC/NEW.total_games)*100,2) ELSE 0 END;
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_lb_wr BEFORE INSERT OR UPDATE ON leaderboard FOR EACH ROW EXECUTE FUNCTION recalc_win_rate();
