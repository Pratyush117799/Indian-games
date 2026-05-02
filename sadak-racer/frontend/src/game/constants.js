// ── Canvas ────────────────────────────────────────────────────────────────────
export const W = 900;
export const H = 600;

// ── Road layout (side-scroll) ─────────────────────────────────────────────────
export const ROAD_TOP  = 170;
export const ROAD_BOT  = 555;
export const ROAD_H    = ROAD_BOT - ROAD_TOP;   // 385 px
export const NUM_LANES = 4;                      // 2 same-dir + 2 oncoming
export const LANE_H    = ROAD_H / NUM_LANES;     // ~96 px each

// Lane Y centres
export const LANE_CENTERS = [
  ROAD_TOP + LANE_H * 0.5,   // 0 — same dir fast
  ROAD_TOP + LANE_H * 1.5,   // 1 — same dir slow
  ROAD_TOP + LANE_H * 2.5,   // 2 — oncoming slow
  ROAD_TOP + LANE_H * 3.5,   // 3 — oncoming fast
];

// Player fixed X in side-scroll
export const PLAYER_X_SIDE = 200;

// ── Top-down layout ───────────────────────────────────────────────────────────
export const TD_ROAD_LEFT  = 250;
export const TD_ROAD_RIGHT = W - 250;
export const TD_ROAD_W     = TD_ROAD_RIGHT - TD_ROAD_LEFT;   // 400 px
export const TD_NUM_LANES  = 4;
export const TD_LANE_W     = TD_ROAD_W / TD_NUM_LANES;        // 100 px

// ── Physics ───────────────────────────────────────────────────────────────────
export const BASE_ACCEL        = 80;    // km/h per second
export const BRAKE_DECEL       = 160;
export const FRICTION          = 30;
export const LANE_CHANGE_SPEED = 280;   // px/s
export const NITRO_ACCEL_BONUS = 140;
export const NITRO_MAX         = 100;
export const NITRO_BURN_RATE   = 25;    // per second
export const NITRO_REGEN_RATE  = 8;

// ── Race ──────────────────────────────────────────────────────────────────────
export const RACE_DIST_M = 5000;
export const MAX_DAMAGE  = 100;

// ── Scoring ───────────────────────────────────────────────────────────────────
export const SCORE_PER_100M      = 10;
export const SCORE_NEAR_MISS     = 50;
export const SCORE_POLICE_ESCAPE = 300;
export const SCORE_SPEED_BONUS   = 0.5;   // per km/h above 100 per second

// ── AI ────────────────────────────────────────────────────────────────────────
export const AI_COUNT = 3;

// ── Collision ─────────────────────────────────────────────────────────────────
export const ONCOMING_DANGER = 1.8;

// ── Car colours ───────────────────────────────────────────────────────────────
export const CAR_COLORS = [
  '#e74c3c','#3498db','#2ecc71','#f39c12',
  '#9b59b6','#1abc9c','#e67e22','#ffffff',
];

// ── Player colors ─────────────────────────────────────────────────────────────
export const PLAYER_COLORS = CAR_COLORS;

// ── Map unlock order ──────────────────────────────────────────────────────────
export const MAP_ORDER = ['mumbai','delhi','himalaya','rajasthan','chennai'];
