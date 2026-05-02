-- ── Migration 005: achievements ───────────────────────────────

CREATE TABLE IF NOT EXISTS achievement_defs (
  key          VARCHAR(40) PRIMARY KEY,
  label        VARCHAR(60) NOT NULL,
  description  TEXT,
  icon         VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS player_achievements (
  player_id       UUID        NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  achievement_key VARCHAR(40) NOT NULL REFERENCES achievement_defs(key),
  unlocked_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (player_id, achievement_key)
);

-- Seed achievement definitions
INSERT INTO achievement_defs (key, label, description, icon) VALUES
  ('first_mill',    'First Mill',    'Form your first mill in Navakankari',          '🏛'),
  ('sower',         'Sower',         'Complete 10 turns in Pallankuzhi',              '🌊'),
  ('flame_streak',  'Flame Streak',  'Play 7 days in a row',                         '🔥'),
  ('double_mill',   'Double Mill',   'Execute a zwicker (double mill threat)',        '⚡'),
  ('harvest',       'Harvest',       'Capture 50+ seeds in one Pallankuzhi game',    '🌾'),
  ('flight',        'Flight',        'Win a game from the 3-piece fly phase',        '🦅'),
  ('grandmaster',   'Grandmaster',   'Reach top 10 on the leaderboard',              '👑'),
  ('historian',     'Historian',     'Read all cultural lore entries',               '📜'),
  ('first_win',     'First Victory', 'Win your first game against AI',               '⚔️'),
  ('speed_run',     'Speed Run',     'Win Pallankuzhi in under 5 minutes',           '⚡'),
  ('stone_cold',    'Stone Cold',    'Win Navakankari without losing a piece',       '🗿'),
  ('comeback',      'Comeback',      'Win after being reduced to 3 pieces',          '🔄')
ON CONFLICT (key) DO NOTHING;
