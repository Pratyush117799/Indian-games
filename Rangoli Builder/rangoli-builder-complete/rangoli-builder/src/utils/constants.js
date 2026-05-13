// shared/constants.js
export const GRID = {
  RINGS: 7,           // concentric ring count (0 = center dot, 6 = outermost)
  CENTER_X: 300,      // SVG viewport center
  CENTER_Y: 300,
  RING_GAP: 36,       // px between rings
  VIEWBOX: 600,
};

export const SYMMETRY_OPTIONS = [
  { axes: 1,  label: "Free",    icon: "✦"  },
  { axes: 4,  label: "4-axis",  icon: "✚"  },
  { axes: 6,  label: "6-axis",  icon: "✶"  },
  { axes: 8,  label: "8-axis",  icon: "✳"  },
  { axes: 12, label: "12-axis", icon: "❊"  },
];

export const SCORE_WEIGHTS = {
  ACCURACY:    0.50,
  SPEED:       0.25,
  STREAK:      0.15,
  COMPLETION:  0.10,
  MAX_SCORE:   10000,
};

export const TIMER = {
  MIN: 3 * 60,   // 3 minutes
  MAX: 20 * 60,  // 20 minutes
};

export const GAME_PHASES = {
  IDLE:      "idle",
  COUNTDOWN: "countdown",
  ACTIVE:    "active",
  FINISHED:  "finished",
};

export const GAME_MODES = {
  FREE:      "free",
  PUZZLE:    "puzzle",
  SYMMETRY:  "symmetry",
  FESTIVAL:  "festival",
  VS:        "vs",
};
