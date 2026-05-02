/**
 * AISystem — manages up to 3 rival AI racers in the same race.
 */

import { LANE_CENTERS, PLAYER_X_SIDE, AI_COUNT } from '../constants';

const AI_NAMES  = ['Bunty','Raju','Priya','Vikram','Sunita','Arjun'];
const AI_COLORS = ['#3498db','#2ecc71','#9b59b6','#e67e22','#1abc9c'];

export function createAIRacers(map) {
  return Array.from({ length: AI_COUNT }, (_, i) => ({
    id: i,
    name: AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)],
    lane: Math.floor(Math.random() * 2),
    x: PLAYER_X_SIDE + 80 + i * 60,  // start slightly ahead
    y: LANE_CENTERS[Math.floor(Math.random() * 2)],
    speed: 50 + Math.random() * 40,
    maxSpeed: map.maxSpeed * (0.78 + Math.random() * 0.18),
    dist: 0,
    color: AI_COLORS[i % AI_COLORS.length],
    active: true,
    laneTimer: 0,
    aggression: 0.3 + Math.random() * 0.5,
    crashed: false,
    crashTimer: 0,
    position: i + 2, // starts at position 2,3,4
  }));
}

export function updateAIRacers(aiRacers, player, traffic, dt, map) {
  for (const ai of aiRacers) {
    if (!ai.active) continue;

    if (ai.crashed) {
      ai.crashTimer -= dt;
      ai.speed = Math.max(0, ai.speed - 80 * dt);
      if (ai.crashTimer <= 0) { ai.crashed = false; ai.speed = 40; }
      continue;
    }

    // Accelerate toward max speed
    ai.speed = Math.min(ai.maxSpeed, ai.speed + 35 * dt);

    // Occasional lane change to overtake
    ai.laneTimer -= dt;
    if (ai.laneTimer <= 0) {
      if (Math.random() < ai.aggression) {
        ai.lane = Math.floor(Math.random() * 2);
      }
      ai.laneTimer = 0.8 + Math.random() * 1.5;
    }

    // Dodge traffic in front
    for (const v of traffic) {
      if (!v.active || v.isOncoming) continue;
      if (Math.abs(v.x - ai.x) < 80 && v.lane === ai.lane) {
        ai.lane = 1 - ai.lane; // swap lanes
        ai.laneTimer = 1;
        break;
      }
    }

    const targetY = LANE_CENTERS[ai.lane];
    ai.y += (targetY - ai.y) * Math.min(1, 4 * dt);

    // AI distance (relative to player scroll)
    const relativeSpeed = ai.speed - player.speed;
    ai.x += (relativeSpeed / 3.6) * 0.6 * dt;
    ai.dist += (ai.speed / 3.6) * dt;

    // Cull if too far behind
    if (ai.x < -300) ai.active = false;
  }

  // Rank calculation
  const allDists = [{ id: 'player', dist: player.dist }, ...aiRacers.filter(a=>a.active).map(a=>({ id: a.id, dist: a.dist }))];
  allDists.sort((a, b) => b.dist - a.dist);
  player.position = allDists.findIndex(a => a.id === 'player') + 1;

  return aiRacers;
}
