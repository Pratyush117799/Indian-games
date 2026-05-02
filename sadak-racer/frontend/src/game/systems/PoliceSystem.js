/**
 * PoliceSystem — spawns police bikes that pursue the player when speeding.
 */

import { W, LANE_CENTERS, PLAYER_X_SIDE } from '../constants';

const POLICE_COLORS = ['#2471a3','#1a5276'];

export function createPoliceBike(lane) {
  return {
    id: Math.random(),
    type: 'police',
    lane,
    x: W + 100,
    y: LANE_CENTERS[Math.min(1, lane)],
    w: 48, h: 24,
    speed: 0,
    active: true,
    color: POLICE_COLORS[Math.floor(Math.random() * POLICE_COLORS.length)],
    sirenPhase: Math.random() * Math.PI * 2,
    pursuing: true,
    warnTimer: 3, // seconds of siren before actually chasing
    laneChangeTimer: 0,
  };
}

export function updatePolice(policeList, player, playerSpeed, dt, map) {
  const policeSpeed = map.policeThreshold + 30; // always faster than threshold

  for (const p of policeList) {
    if (!p.active) continue;

    p.sirenPhase += dt * 4;
    p.laneChangeTimer -= dt;

    // Police try to match player lane
    if (p.laneChangeTimer <= 0 && p.lane !== player.lane) {
      const diff = player.lane - p.lane;
      p.lane = p.lane + Math.sign(diff);
      p.laneChangeTimer = 0.4 + Math.random() * 0.3;
    }

    const targetY = LANE_CENTERS[Math.max(0, Math.min(1, p.lane))];
    p.y += (targetY - p.y) * Math.min(1, 6 * dt);

    if (p.warnTimer > 0) {
      p.warnTimer -= dt;
      // Slowly catches up during warning
      p.speed = Math.min(policeSpeed * 0.7, p.speed + 60 * dt);
    } else {
      p.speed = Math.min(policeSpeed, p.speed + 80 * dt);
    }

    // Move police relative to player scroll
    const bgScroll = (playerSpeed / 3.6) * 0.6;
    const policeScroll = (p.speed / 3.6) * 0.6;
    p.x -= (bgScroll - policeScroll) * dt;

    // If police overtakes player (gets ahead), it's escaped
    if (p.x < PLAYER_X_SIDE - 200) p.active = false;
  }

  return policeList.filter(p => p.active);
}

export function checkPoliceCollision(player, policeList) {
  const px = PLAYER_X_SIDE, py = player.y;
  for (const p of policeList) {
    if (!p.active) continue;
    const dx = Math.abs(px - p.x);
    const dy = Math.abs(py - p.y);
    if (dx < 40 && dy < 22) return p;
  }
  return null;
}

export function shouldSpawnPolice(playerSpeed, map, wantedLevel) {
  return playerSpeed > map.policeThreshold && wantedLevel < map.policeCount;
}

// Returns siren color for current phase
export function getSirenColor(phase) {
  return Math.sin(phase) > 0 ? '#e74c3c' : '#3498db';
}
