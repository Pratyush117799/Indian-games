/**
 * useRaceGame — central React hook managing the entire race.
 * Integrates all systems: physics, traffic, police, AI, particles.
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { GameLoop } from '../game/engine/GameLoop';
import { input } from '../game/engine/InputManager';
import { updatePlayer, applyCollision } from '../game/engine/Physics';
import { spawnTraffic, updateTraffic, checkPlayerCollisions } from '../game/systems/TrafficSystem';
import { createPoliceBike, updatePolice, checkPoliceCollision,
         shouldSpawnPolice, getSirenColor } from '../game/systems/PoliceSystem';
import { createAIRacers, updateAIRacers } from '../game/systems/AISystem';
import { ParticleSystem } from '../game/systems/ParticleSystem';
import { renderBackground, scrollBackground, resetScroll } from '../game/renderers/BackgroundRenderer';
import { drawPlayerCar, drawVehicle } from '../game/renderers/VehicleRenderer';
import { renderHUD } from '../game/renderers/HUDRenderer';
import { renderTopDown, scrollTopDown, resetTopDown } from '../game/renderers/TopDownRenderer';
import {
  RACE_DIST_M, NITRO_MAX, MAX_DAMAGE,
  SCORE_PER_100M, SCORE_NEAR_MISS, SCORE_POLICE_ESCAPE, SCORE_SPEED_BONUS,
  LANE_CENTERS, PLAYER_X_SIDE,
} from '../game/constants';

function makePlayer(map, carColor) {
  return {
    x: PLAYER_X_SIDE, y: LANE_CENTERS[1], lane: 1, targetLane: 1,
    speed: 0, maxSpeed: map.maxSpeed,
    nitro: NITRO_MAX, nitroRecharge: 0,
    damage: 0, dist: 0,
    alive: true, finished: false,
    shakeX: 0, shakeY: 0,
    invincible: 0,
    nearMiss: 0,
    crashes: 0,
    color: carColor || '#e74c3c',
    usingNitro: false,
    position: 1,
  };
}

export function useRaceGame({ canvasRef, map, mode, carColor, onRaceEnd }) {
  const loopRef     = useRef(null);
  const stateRef    = useRef(null);
  const [phase, setPhase] = useState('countdown'); // countdown|racing|finished|failed

  const initState = useCallback(() => {
    const player   = makePlayer(map, carColor);
    const ai       = createAIRacers(map);
    const particles = new ParticleSystem();
    resetScroll(); resetTopDown();

    stateRef.current = {
      player, map, mode,
      traffic: [], spawnTimer: 0,
      police: [], wantedLevel: 0, policeWarning: 0, policeSpawnTimer: 8,
      ai,
      particles,
      timeMs: 0,
      score: 0,
      countdownVal: 3,
      nearMissText: null, nearMissTimer: 0,
      showHint: 6,
      lastScoreDist: 0,
      maxSpeed: 0,
      nearMissCount: 0,
      policeEscaped: false,
      phase: 'countdown',
    };
  }, [map, mode, carColor]);

  const update = useCallback((dt) => {
    const s = stateRef.current;
    if (!s) return;

    // ── Countdown ─────────────────────────────────────────────────────────
    if (s.countdownVal > 0) {
      s.countdownVal = Math.max(0, s.countdownVal - dt);
      return;
    }

    if (s.phase !== 'racing') { s.phase = 'racing'; setPhase('racing'); }
    if (input.pause) return;

    const { player } = s;

    // ── Player update ──────────────────────────────────────────────────────
    player.usingNitro = input.nitro && player.nitro > 0;
    updatePlayer(player, input, dt, map);
    s.maxSpeed = Math.max(s.maxSpeed, player.speed);
    s.showHint = Math.max(0, (s.showHint || 0) - dt);

    // ── Scroll background ──────────────────────────────────────────────────
    if (mode === 'side') scrollBackground(player.speed, dt);
    else scrollTopDown(player.speed, dt);

    // ── Traffic ────────────────────────────────────────────────────────────
    const [newTraffic, newTimer] = spawnTraffic(s.traffic, map, s.spawnTimer, dt);
    s.traffic = newTraffic;
    s.spawnTimer = newTimer;
    s.traffic = updateTraffic(s.traffic, player.speed, dt);

    // Update top-down Y positions for traffic
    if (mode === 'topdown') {
      const scroll = (player.speed / 3.6) * 0.5;
      for (const v of s.traffic) {
        if (v.tdY === undefined) v.tdY = -60 - Math.random() * 400;
        v.tdY += (v.isOncoming ? -1 : 1) * (scroll + (v.speed / 3.6) * 0.3) * dt * 60;
        if (v.tdY > 700) v.active = false;
        if (v.tdY < -100) v.active = false;
      }
    }

    // ── Collision ──────────────────────────────────────────────────────────
    const { hit, nearMiss } = checkPlayerCollisions(player, s.traffic, s.particles);
    if (hit && player.alive) {
      const dmg = applyCollision(player, hit, s.particles);
      s.particles.emit('crash', PLAYER_X_SIDE + player.shakeX, player.y, { color: hit.color });
      s.particles.emit('spark', PLAYER_X_SIDE, player.y);
    }
    if (nearMiss) {
      s.nearMissCount++;
      s.score += SCORE_NEAR_MISS;
      s.nearMissText = `NEAR MISS! +${SCORE_NEAR_MISS}`;
      s.nearMissTimer = 1.5;
      s.particles.emit('stars', PLAYER_X_SIDE, player.y - 20);
    }
    if (s.nearMissTimer > 0) {
      s.nearMissTimer -= dt;
      if (s.nearMissTimer <= 0) s.nearMissText = null;
    }

    // ── Nitro particles ────────────────────────────────────────────────────
    if (player.usingNitro && Math.random() < 0.4) {
      s.particles.emit('nitro', PLAYER_X_SIDE - 30, player.y);
    }
    // Tyre dust at high speed
    if (player.speed > 150 && Math.random() < 0.15) {
      s.particles.emit('dust', PLAYER_X_SIDE - 20, player.y + 14);
    }

    // ── Police ────────────────────────────────────────────────────────────
    s.policeSpawnTimer -= dt;
    if (s.policeSpawnTimer <= 0 && shouldSpawnPolice(player.speed, map, s.wantedLevel)) {
      s.police.push(createPoliceBike(Math.floor(Math.random() * 2)));
      s.wantedLevel = Math.min(map.policeCount, s.wantedLevel + 1);
      s.policeSpawnTimer = 12 + Math.random() * 8;
    }

    s.police = updatePolice(s.police, player, player.speed, dt, map);
    s.policeWarning += dt;
    if (s.police.length === 0 && s.wantedLevel > 0) {
      s.wantedLevel = 0;
      s.policeEscaped = true;
      s.score += SCORE_POLICE_ESCAPE;
      s.nearMissText = `ESCAPED POLICE! +${SCORE_POLICE_ESCAPE}`;
      s.nearMissTimer = 2;
    }

    // Police collision
    const caughtBy = checkPoliceCollision(player, s.police);
    if (caughtBy) {
      player.speed *= 0.3;
      player.damage += 15;
      player.invincible = 2;
    }

    // ── AI ────────────────────────────────────────────────────────────────
    updateAIRacers(s.ai, player, s.traffic, dt, map);

    // ── Score ─────────────────────────────────────────────────────────────
    const distDelta = player.dist - s.lastScoreDist;
    if (distDelta > 100) {
      s.score += SCORE_PER_100M;
      s.lastScoreDist = player.dist;
    }
    if (player.speed > 100) {
      s.score += Math.round(SCORE_SPEED_BONUS * player.speed * dt);
    }

    // ── Particles ─────────────────────────────────────────────────────────
    s.particles.update(dt);

    // ── Timer ─────────────────────────────────────────────────────────────
    s.timeMs += dt * 1000;

    // ── End conditions ────────────────────────────────────────────────────
    if (player.dist >= RACE_DIST_M && !player.finished) {
      player.finished = true;
      s.phase = 'finished';
      setPhase('finished');
      onRaceEnd?.({
        completed: true, timeMs: s.timeMs, dist: player.dist,
        maxSpeed: s.maxSpeed, score: s.score,
        nearMisses: s.nearMissCount, policeEscaped: s.policeEscaped,
        crashes: player.crashes, damage: player.damage,
        position: player.position,
      });
    }
    if (!player.alive && s.phase === 'racing') {
      s.phase = 'failed';
      setPhase('failed');
      s.particles.emit('crash', PLAYER_X_SIDE, player.y, { color: player.color });
      onRaceEnd?.({
        completed: false, timeMs: s.timeMs, dist: player.dist,
        maxSpeed: s.maxSpeed, score: s.score,
        nearMisses: s.nearMissCount, policeEscaped: s.policeEscaped,
        crashes: player.crashes, damage: player.damage,
        position: player.position,
      });
    }
  }, [map, mode, onRaceEnd]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s = stateRef.current;
    if (!s) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mode === 'side') {
      // Side-scroll rendering
      renderBackground(ctx, map);

      // Draw traffic
      for (const v of s.traffic) {
        if (v.active) drawVehicle(ctx, v);
      }
      // Police
      for (const p of s.police) {
        if (p.active) drawVehicle(ctx, { ...p, type: 'police', animFrame: p.sirenPhase });
      }
      // AI racers
      for (const ai of s.ai) {
        if (ai.active) {
          const aiV = {
            type: 'car', x: ai.x, y: ai.y, color: ai.color,
            isOncoming: false, w: 56, h: 28, animFrame: 0
          };
          drawVehicle(ctx, aiV);
        }
      }
      // Player
      drawPlayerCar(ctx, s.player, s.player.shakeX, s.player.shakeY);
      // Particles
      s.particles.render(ctx);
    } else {
      // Top-down rendering
      renderTopDown(ctx, s);
    }

    // HUD always on top
    renderHUD(ctx, s);

    // Pause overlay
    if (input.pause && s.phase === 'racing') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '18px Arial';
      ctx.fillStyle = '#ccc';
      ctx.fillText('Press P or ESC to resume', canvas.width / 2, canvas.height / 2 + 20);
    }
  }, [canvasRef, map, mode]);

  useEffect(() => {
    initState();
    loopRef.current = new GameLoop({ update, render });
    loopRef.current.start();
    return () => loopRef.current?.stop();
  }, [initState, update, render]);

  return { phase, stateRef };
}
