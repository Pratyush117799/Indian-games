-- ============================================================
-- GANJIFA — Seed Data
-- ============================================================

-- Themes
INSERT INTO themes (slug, name, description, total_suits, cards_per_suit, card_base_url) VALUES
(
  'dashavatara',
  'Dashavatara Ganjifa',
  'The 10 incarnations of Lord Vishnu — Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Krishna, Buddha, Kalki. 120 cards in 10 suits.',
  10, 12, '/cards/dashavatara/'
),
(
  'ramayana',
  'Ramayana Ganjifa',
  'The epic of Rama — 8 principal characters as suits. Rama, Sita, Lakshmana, Hanuman, Ravana, Kumbhakarna, Sugriva, Vibhishana. 96 cards.',
  8, 12, '/cards/ramayana/'
),
(
  'geopolitics',
  'Modern Warfare Ganjifa',
  '21st-century weapons platforms — Rafale, Su-57, F-35, BrahMos, Tejas, S-400, B-2 Spirit, Kalibr, Kamikaze Drone, Aircraft Carrier. 120 cards.',
  10, 12, '/cards/geopolitics/'
);

-- Demo admin user (password: Admin@1234)
INSERT INTO users (username, email, password_hash) VALUES
('ganjifa_admin', 'admin@ganjifa.app', crypt('Admin@1234', gen_salt('bf', 12)));

-- Seed leaderboard rows for admin across all themes
DO $$
DECLARE
  v_uid UUID;
  v_tid UUID;
BEGIN
  SELECT id INTO v_uid FROM users WHERE username='ganjifa_admin';
  FOR v_tid IN SELECT id FROM themes LOOP
    INSERT INTO leaderboard (user_id, theme_id) VALUES (v_uid, v_tid) ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
