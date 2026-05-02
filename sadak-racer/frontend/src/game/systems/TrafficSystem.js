/**
 * TrafficSystem — spawns and moves all traffic vehicles.
 *
 * Side-scroll world model:
 *  - Same-dir vehicles (lanes 0,1) enter from the right, drift left relative
 *    to player (player is faster).
 *  - Oncoming vehicles (lanes 2,3) enter from the left, move rightward.
 *
 * Positions are in screen-space. The "scrolling" is achieved by offsetting
 * every vehicle's x each frame proportional to player speed.
 */

import { W, LANE_CENTERS, PLAYER_X_SIDE } from '../constants';

// Visual sizes [w, h] per vehicle type
const SIZES = {
  car:   [60, 30], taxi: [62, 30], auto:  [48, 28],
  bus:   [90, 34], truck:[100,36], bike:  [38, 22],
  cycle: [40, 22], camel:[70, 50], cow:   [55, 38],
  police:[62, 30],
};

const CAR_COLORS = {
  car:   ['#c0392b','#2980b9','#27ae60','#8e44ad','#f39c12','#7f8c8d'],
  taxi:  ['#f1c40f','#f39c12'],
  auto:  ['#f39c12','#e67e22'],
  bus:   ['#e74c3c','#c0392b','#d35400'],
  truck: ['#2c3e50','#34495e','#7f8c8d'],
  bike:  ['#1abc9c','#e74c3c','#3498db','#f39c12'],
  cycle: ['#27ae60','#2980b9','#8e44ad'],
  camel: ['#c8a050','#a07030'],
  cow:   ['#f5f5f0','#e8e8e0'],
  police:['#2471a3','#1a5276'],
};

function randomColor(type) {
  const c = CAR_COLORS[type] || ['#888'];
  return c[Math.floor(Math.random() * c.length)];
}

export function createVehicle({ type, lane, speed }) {
  const isOncoming  = lane >= 2;
  const [w, h]      = SIZES[type] || [60, 30];
  return {
    id: Math.random(),
    type, lane,
    x: isOncoming ? -w - 20 : W + w + 20,
    y: LANE_CENTERS[lane],
    w, h, speed, isOncoming,
    active:      true,
    nearMissed:  false,
    color:       randomColor(type),
    animFrame:   Math.random() * 100,
  };
}

export function updateTraffic(traffic, playerSpeed, dt) {
  // Convert km/h to screen-px/s  (tune SCROLL_SCALE for feel)
  const SCROLL_SCALE = 0.55;
  const scrollPx = (playerSpeed / 3.6) * SCROLL_SCALE;

  for (const v of traffic) {
    if (!v.active) continue;
    const vPx = (v.speed / 3.6) * SCROLL_SCALE;

    if (v.isOncoming) {
      // Moves from left toward right (opposite direction)
      v.x += (scrollPx + vPx) * dt;
    } else {
      // Same direction — drifts left (player overtaking)
      v.x -= (scrollPx - vPx) * dt;
    }

    v.animFrame += dt * 10;

    if (v.x > W + 220 || v.x < -220) v.active = false;
  }

  return traffic.filter(v => v.active);
}

export function spawnTraffic(traffic, map, timer, dt) {
  let t = timer - dt;
  if (t <= 0) {
    const mix   = map.trafficMix;
    const total = mix.reduce((s, m) => s + m.w, 0);
    let roll    = Math.random() * total;
    let picked  = mix[0];
    for (const m of mix) { roll -= m.w; if (roll <= 0) { picked = m; break; } }

    const isOncoming = picked.dir === 'oncoming' ||
      (picked.dir === 'both' && Math.random() > 0.5);
    const lane  = isOncoming ? 2 + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 2);
    const speed = picked.sMin + Math.random() * (picked.sMax - picked.sMin);

    // ── Minimum gap check: don't spawn if a vehicle in same lane is too close to the spawn edge ──
    const SPAWN_X   = isOncoming ? -120 : W + 120;
    const MIN_GAP_X = 200; // px between vehicles in the same lane
    const tooClose  = traffic.some(v =>
      v.active && v.lane === lane && v.isOncoming === isOncoming &&
      Math.abs(v.x - SPAWN_X) < MIN_GAP_X
    );

    if (!tooClose) {
      traffic.push(createVehicle({ type: picked.type, lane, speed }));
    }

    const density = map.trafficDensity || 1;
    // Clamp density so spawn interval never drops below 0.55s regardless of map setting
    const effectiveDensity = Math.min(density, 1.4);
    t = (map.spawnInterval || 1.0) / effectiveDensity * (0.7 + Math.random() * 0.6);
  }
  return [traffic, t];
}

export function checkPlayerCollisions(player, traffic) {
  const PW = 46, PH = 24; // player hitbox (slightly smaller than visual)
  const px = PLAYER_X_SIDE, py = player.y;
  let hit      = null;
  let nearMiss = false;

  for (const v of traffic) {
    if (!v.active) continue;

    const dx    = Math.abs(px - v.x);
    const dy    = Math.abs(py - v.y);
    const minDx = (PW + v.w) / 2 - 10;  // tighter hitbox (was -5)
    const minDy = (PH + v.h) / 2 - 10;  // tighter hitbox (was -5)

    if (dx < minDx && dy < minDy) {
      hit = v;
      v.active = false;
      break;
    }

    // Near-miss: just passed player x, close vertically but no collision
    if (!v.nearMissed && dx < 36 && dy > minDy && dy < minDy + 55) {
      v.nearMissed = true;
      nearMiss     = true;
    }
  }

  return { hit, nearMiss };
}
