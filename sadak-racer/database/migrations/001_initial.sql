CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE players (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username      VARCHAR(32) UNIQUE NOT NULL,
  display_name  VARCHAR(64),
  car_color     VARCHAR(16) DEFAULT '#e74c3c',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  last_seen     TIMESTAMPTZ DEFAULT NOW(),
  total_races   INT DEFAULT 0,
  total_wins    INT DEFAULT 0,
  total_dist_m  BIGINT DEFAULT 0,
  best_speed    INT DEFAULT 0,
  near_misses   INT DEFAULT 0,
  police_escaped INT DEFAULT 0,
  crashes       INT DEFAULT 0,
  unlocked_maps  JSONB DEFAULT '["mumbai"]',
  unlocked_modes JSONB DEFAULT '["side"]',
  car_skins      JSONB DEFAULT '["default"]'
);

CREATE TABLE race_results (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id     UUID REFERENCES players(id) ON DELETE CASCADE,
  map_id        VARCHAR(32) NOT NULL,
  mode          VARCHAR(16) NOT NULL DEFAULT 'side',
  completed     BOOLEAN DEFAULT FALSE,
  time_ms       INT,
  distance_m    INT NOT NULL DEFAULT 0,
  max_speed_kph INT NOT NULL DEFAULT 0,
  avg_speed_kph INT NOT NULL DEFAULT 0,
  damage_taken  INT NOT NULL DEFAULT 0,
  near_misses   INT NOT NULL DEFAULT 0,
  police_escaped BOOLEAN DEFAULT FALSE,
  crashes       INT NOT NULL DEFAULT 0,
  score         INT NOT NULL DEFAULT 0,
  position      INT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE player_progress (
  player_id     UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  map_id        VARCHAR(32) NOT NULL,
  mode          VARCHAR(16) NOT NULL DEFAULT 'side',
  completed     BOOLEAN DEFAULT FALSE,
  best_time_ms  INT,
  best_score    INT DEFAULT 0,
  attempts      INT DEFAULT 0,
  first_cleared TIMESTAMPTZ,
  PRIMARY KEY (player_id, map_id, mode)
);

CREATE VIEW leaderboard_global AS
SELECT p.id, p.username, p.display_name, p.car_color,
  p.total_races, p.total_wins, p.best_speed,
  CASE WHEN p.total_races>0 THEN ROUND(100.0*p.total_wins/p.total_races,1) ELSE 0 END AS win_pct,
  ROW_NUMBER() OVER (ORDER BY p.total_wins DESC, p.best_speed DESC) AS rank
FROM players p WHERE p.total_races>0;

CREATE VIEW leaderboard_by_map AS
SELECT r.map_id, r.mode, p.id AS player_id, p.username, p.display_name, p.car_color,
  MIN(r.time_ms) AS best_time_ms, MAX(r.score) AS best_score, MAX(r.max_speed_kph) AS top_speed,
  ROW_NUMBER() OVER (PARTITION BY r.map_id,r.mode ORDER BY MIN(r.time_ms) ASC NULLS LAST) AS rank
FROM race_results r JOIN players p ON p.id=r.player_id
WHERE r.completed=TRUE GROUP BY r.map_id,r.mode,p.id,p.username,p.display_name,p.car_color;

CREATE INDEX idx_race_results_player ON race_results(player_id);
CREATE INDEX idx_race_results_map    ON race_results(map_id,mode);
CREATE INDEX idx_player_progress_pid ON player_progress(player_id);
