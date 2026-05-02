/**
 * Physics — player car movement, lane changes, nitro, collision damage.
 */
import {
  LANE_CENTERS, LANE_CHANGE_SPEED,
  BASE_ACCEL, BRAKE_DECEL, FRICTION,
  NITRO_ACCEL_BONUS, NITRO_BURN_RATE, NITRO_REGEN_RATE, NITRO_MAX,
  MAX_DAMAGE, ONCOMING_DANGER,
} from '../constants';

export function updatePlayer(player, input, dt, map) {
  const { maxSpeed } = map;
  const usingNitro   = input.nitro && player.nitro > 0;

  // ── Speed ──────────────────────────────────────────────────────────────────
  if (input.up) {
    const accel = BASE_ACCEL + (usingNitro ? NITRO_ACCEL_BONUS : 0);
    player.speed = Math.min(maxSpeed, player.speed + accel * dt);
  } else if (input.down) {
    player.speed = Math.max(0, player.speed - BRAKE_DECEL * dt);
  } else {
    player.speed = Math.max(0, player.speed - FRICTION * dt);
  }

  // ── Nitro ──────────────────────────────────────────────────────────────────
  if (usingNitro) {
    player.nitro = Math.max(0, player.nitro - NITRO_BURN_RATE * dt);
  } else {
    player.nitroRecharge = (player.nitroRecharge || 0) + dt;
    if (player.nitroRecharge > 0.5) {
      player.nitro = Math.min(NITRO_MAX, player.nitro + NITRO_REGEN_RATE * dt);
    }
  }
  player.usingNitro = usingNitro;

  // ── Lane change (debounced) ────────────────────────────────────────────────
  const laneDelay = (player.laneDelay || 0) - dt;
  player.laneDelay = Math.max(0, laneDelay);

  if (player.laneDelay <= 0) {
    if (input.left  && player.lane > 0) { player.lane--; player.laneDelay = 0.22; }
    if (input.right && player.lane < 3) { player.lane++; player.laneDelay = 0.22; }
  }

  // Smooth Y interpolation toward target lane
  const targetY = LANE_CENTERS[player.lane];
  const dy = targetY - player.y;
  const step = LANE_CHANGE_SPEED * dt;
  player.y += Math.sign(dy) * Math.min(Math.abs(dy), step);

  // ── Shake decay ────────────────────────────────────────────────────────────
  player.shakeX = (player.shakeX || 0) * 0.82;
  player.shakeY = (player.shakeY || 0) * 0.82;
  if (Math.abs(player.shakeX) < 0.3) player.shakeX = 0;
  if (Math.abs(player.shakeY) < 0.3) player.shakeY = 0;

  // ── Invincibility frames ───────────────────────────────────────────────────
  if (player.invincible > 0) player.invincible = Math.max(0, player.invincible - dt);

  // ── Near-miss glow decay ───────────────────────────────────────────────────
  if (player.nearMiss > 0) player.nearMiss = Math.max(0, player.nearMiss - dt * 2);

  // ── Slow HP self-repair (rewards clean stretches) ────────────────────────
  if (player.damage > 0 && player.invincible <= 0) {
    player.damage = Math.max(0, player.damage - 1.5 * dt); // heals ~1.5 HP/s
  }

  // ── Odometer ──────────────────────────────────────────────────────────────
  player.dist += (player.speed / 3.6) * dt; // km/h → m/s
}

export function applyCollision(player, vehicle) {
  if (player.invincible > 0 || !player.alive) return 0;

  const isOncoming  = vehicle.lane >= 2;
  const relSpeed    = isOncoming
    ? player.speed + vehicle.speed
    : Math.abs(player.speed - vehicle.speed);

  const dmg = Math.min(30, Math.max(4, (relSpeed / 100) * (isOncoming ? ONCOMING_DANGER : 1) * 18));

  player.damage   += dmg;
  player.crashes   = (player.crashes || 0) + 1;
  player.shakeX    = isOncoming ? 15 : 9;
  player.shakeY    = isOncoming ? 11 : 6;
  player.invincible = 2.0;              // 2 s safe window (was 1.2)
  player.speed     *= isOncoming ? 0.35 : 0.65;  // side hit less punishing

  if (player.damage >= MAX_DAMAGE) player.alive = false;
  return dmg;
}

export function checkNearMiss(player, vehicle) {
  // Vehicle just passed player X; check vertical proximity (close but no collision)
  const dy = Math.abs(player.y - vehicle.y);
  return dy > 30 && dy < 65;
}
