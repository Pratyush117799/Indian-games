/**
 * BackgroundRenderer — draws parallax backgrounds for each map theme.
 * All drawing is on a 900×600 canvas.
 */

import { W, H, ROAD_TOP, ROAD_BOT } from '../constants';

// Scrolling offset layers (far, mid, near) updated externally
let offsets = { far: 0, mid: 0, near: 0 };

export function scrollBackground(playerSpeed, dt) {
  const spx = (playerSpeed / 3.6) * 0.6;
  offsets.far  = (offsets.far  - spx * 0.15 * dt * 60) % W;
  offsets.mid  = (offsets.mid  - spx * 0.35 * dt * 60) % W;
  offsets.near = (offsets.near - spx * 0.7  * dt * 60) % W;
  if (offsets.far  > 0) offsets.far  -= W;
  if (offsets.mid  > 0) offsets.mid  -= W;
  if (offsets.near > 0) offsets.near -= W;
}

export function resetScroll() {
  offsets = { far: 0, mid: 0, near: 0 };
}

export function renderBackground(ctx, map) {
  const type = map.bgType;
  // Draw sky
  drawSky(ctx, map);
  // Draw horizon elements (buildings/mountains/dunes)
  const drawers = {
    night_city: drawNightCity,
    smog_city:  drawSmogCity,
    mountain:   drawMountain,
    desert:     drawDesert,
    coastal:    drawCoastal,
  };
  (drawers[type] || drawNightCity)(ctx, map);
  // Draw road
  drawRoad(ctx, map);
}

function drawSky(ctx, map) {
  const [c1, c2, c3] = map.skyGradient;
  const grad = ctx.createLinearGradient(0, 0, 0, ROAD_TOP);
  grad.addColorStop(0, c1);
  grad.addColorStop(0.6, c2);
  grad.addColorStop(1, c3 || c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, ROAD_TOP);
}

// ── Night City (Mumbai) ───────────────────────────────────────────────────────
function drawNightCity(ctx, map) {
  // Stars
  if (map.skyStars) {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 80; i++) {
      const sx = ((i * 137 + offsets.far * 0.1) % W + W) % W;
      const sy = (i * 53) % (ROAD_TOP - 20);
      const r = (i % 3 === 0) ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Far buildings
  ctx.fillStyle = '#050520';
  for (let i = 0; i < 12; i++) {
    const bx = ((i * 180 + offsets.far) % (W + 200) + W + 200) % (W + 200) - 100;
    const bh = 40 + (i * 37) % 80;
    const bw = 30 + (i * 23) % 50;
    ctx.fillRect(bx, ROAD_TOP - bh, bw, bh);
    // Windows
    ctx.fillStyle = `rgba(255,220,100,${0.2 + (i % 3) * 0.15})`;
    for (let wy = ROAD_TOP - bh + 5; wy < ROAD_TOP - 5; wy += 12) {
      for (let wx = bx + 4; wx < bx + bw - 4; wx += 10) {
        if (Math.sin(i * 7 + wx + wy) > 0) ctx.fillRect(wx, wy, 6, 8);
      }
    }
    ctx.fillStyle = '#050520';
  }

  // Mid buildings — brighter, taller
  ctx.fillStyle = '#0a0a30';
  for (let i = 0; i < 8; i++) {
    const bx = ((i * 220 + offsets.mid) % (W + 300) + W + 300) % (W + 300) - 100;
    const bh = 60 + (i * 41) % 60;
    const bw = 40 + (i * 17) % 40;
    ctx.fillRect(bx, ROAD_TOP - bh, bw, bh);
    ctx.fillStyle = 'rgba(255,200,80,0.3)';
    for (let wy = ROAD_TOP - bh + 5; wy < ROAD_TOP - 5; wy += 14) {
      for (let wx = bx + 5; wx < bx + bw - 5; wx += 12) {
        if (Math.sin(i * 11 + wx * 0.3 + wy * 0.2) > -0.3) ctx.fillRect(wx, wy, 7, 9);
      }
    }
    ctx.fillStyle = '#0a0a30';
  }

  // Orange street-lamp glow on road sides
  for (let i = 0; i < 8; i++) {
    const lx = ((i * 130 + offsets.near) % (W + 130) + W + 130) % (W + 130) - 30;
    const grad = ctx.createRadialGradient(lx, ROAD_TOP + 10, 0, lx, ROAD_TOP + 10, 60);
    grad.addColorStop(0, 'rgba(255,160,40,0.35)');
    grad.addColorStop(1, 'rgba(255,160,40,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(lx - 60, ROAD_TOP - 10, 120, 50);
    // Lamp post
    ctx.fillStyle = '#555';
    ctx.fillRect(lx - 2, ROAD_TOP - 30, 4, 40);
    ctx.fillStyle = '#ffa030';
    ctx.beginPath();
    ctx.arc(lx, ROAD_TOP - 30, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sea side (left shoulder) — shimmer
  const seaGrad = ctx.createLinearGradient(0, ROAD_BOT, 0, H);
  seaGrad.addColorStop(0, '#021830');
  seaGrad.addColorStop(1, '#010d1a');
  ctx.fillStyle = seaGrad;
  ctx.fillRect(0, ROAD_BOT, W, H - ROAD_BOT);
}

// ── Smog City (Delhi) ─────────────────────────────────────────────────────────
function drawSmogCity(ctx, map) {
  // Smog overlay
  if (map.fogAlpha > 0) {
    ctx.fillStyle = `rgba(180,160,100,${map.fogAlpha})`;
    ctx.fillRect(0, 0, W, ROAD_TOP + 20);
  }

  // Buildings in smog
  for (let i = 0; i < 14; i++) {
    const bx = ((i * 155 + offsets.far) % (W + 200) + W + 200) % (W + 200) - 80;
    const bh = 50 + (i * 31) % 90;
    const bw = 35 + (i * 19) % 55;
    const alpha = 0.4 + (i % 3) * 0.15;
    ctx.fillStyle = `rgba(100,80,40,${alpha})`;
    ctx.fillRect(bx, ROAD_TOP - bh, bw, bh);
    // Red fort-style dome occasionally
    if (i % 5 === 0) {
      ctx.fillStyle = `rgba(150,80,40,${alpha})`;
      ctx.beginPath();
      ctx.arc(bx + bw / 2, ROAD_TOP - bh, bw * 0.4, Math.PI, 0);
      ctx.fill();
    }
  }
  ctx.fillStyle = '#4a3a1a';
  ctx.fillRect(0, ROAD_BOT, W, H - ROAD_BOT);
}

// ── Mountain (Himalaya) ───────────────────────────────────────────────────────
function drawMountain(ctx, map) {
  // Far snow peaks
  ctx.fillStyle = '#f0f0ff';
  for (let i = 0; i < 6; i++) {
    const mx = ((i * 250 + offsets.far * 0.5) % (W + 300) + W + 300) % (W + 300) - 100;
    const mh = 80 + (i * 47) % 60;
    ctx.beginPath();
    ctx.moveTo(mx, ROAD_TOP);
    ctx.lineTo(mx + 100, ROAD_TOP - mh);
    ctx.lineTo(mx + 200, ROAD_TOP);
    ctx.fill();
  }
  // Mid green hills
  ctx.fillStyle = '#2d5a27';
  for (let i = 0; i < 5; i++) {
    const mx = ((i * 280 + offsets.mid) % (W + 350) + W + 350) % (W + 350) - 100;
    ctx.beginPath();
    ctx.moveTo(mx, ROAD_TOP + 5);
    ctx.lineTo(mx + 130, ROAD_TOP - 55);
    ctx.lineTo(mx + 260, ROAD_TOP + 5);
    ctx.fill();
  }
  // Rock face (right side)
  ctx.fillStyle = '#3a4a3a';
  ctx.fillRect(0, ROAD_BOT, W, H - ROAD_BOT);
  // Cliff drop warning (left side) — striped
  for (let i = 0; i < 20; i++) {
    const lx = ((i * 60 + offsets.near * 0.5) % (W + 60) + W + 60) % (W + 60) - 30;
    ctx.fillStyle = i % 2 === 0 ? '#e74c3c' : '#fff';
    ctx.fillRect(lx, ROAD_BOT + 2, 30, 8);
  }
}

// ── Desert (Rajasthan) ────────────────────────────────────────────────────────
function drawDesert(ctx, map) {
  // Sand dunes far
  for (let i = 0; i < 5; i++) {
    const dx = ((i * 300 + offsets.far * 0.4) % (W + 400) + W + 400) % (W + 400) - 100;
    const dh = 30 + (i * 23) % 30;
    const grad = ctx.createLinearGradient(dx, ROAD_TOP - dh, dx + 300, ROAD_TOP);
    grad.addColorStop(0, '#d4a030');
    grad.addColorStop(1, '#c89020');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(dx, ROAD_TOP + 5);
    ctx.quadraticCurveTo(dx + 150, ROAD_TOP - dh, dx + 300, ROAD_TOP + 5);
    ctx.fill();
  }
  // Sun
  const sunX = 760 + Math.sin(offsets.far * 0.01) * 20;
  const grad = ctx.createRadialGradient(sunX, 50, 0, sunX, 50, 80);
  grad.addColorStop(0, 'rgba(255,240,100,1)');
  grad.addColorStop(0.3, 'rgba(255,180,30,0.8)');
  grad.addColorStop(1, 'rgba(255,140,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(sunX - 80, 0, 160, 140);
  // Sand ground
  const sandGrad = ctx.createLinearGradient(0, ROAD_BOT, 0, H);
  sandGrad.addColorStop(0, '#c8a050');
  sandGrad.addColorStop(1, '#b08030');
  ctx.fillStyle = sandGrad;
  ctx.fillRect(0, ROAD_BOT, W, H - ROAD_BOT);
}

// ── Coastal (Chennai ECR) ─────────────────────────────────────────────────────
function drawCoastal(ctx, map) {
  // Ocean with waves
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, ROAD_TOP);
  oceanGrad.addColorStop(0, '#1a6aaa');
  oceanGrad.addColorStop(0.7, '#2a8ace');
  oceanGrad.addColorStop(1, '#3ab0e0');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, W, ROAD_TOP);

  // Wave lines
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const wy = 20 + i * 25;
    const wx = ((offsets.mid * 0.6 + i * 80) % (W + 100) + W + 100) % (W + 100) - 50;
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + 30, wy - 5, wx + 60, wy);
    ctx.stroke();
  }

  // Palm trees on right shoulder
  for (let i = 0; i < 6; i++) {
    const tx = ((i * 180 + offsets.near) % (W + 180) + W + 180) % (W + 180) - 40;
    const ty = ROAD_TOP + 5;
    // Trunk
    ctx.fillStyle = '#8B6914';
    ctx.beginPath();
    ctx.moveTo(tx - 4, ty + 40);
    ctx.quadraticCurveTo(tx + 2, ty + 20, tx, ty);
    ctx.lineTo(tx + 4, ty);
    ctx.quadraticCurveTo(tx + 6, ty + 20, tx + 8, ty + 40);
    ctx.fill();
    // Fronds
    ctx.fillStyle = '#2d7a1a';
    for (let a = 0; a < 6; a++) {
      const angle = (a / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(tx + Math.cos(angle) * 18, ty + Math.sin(angle) * 10 - 5, 18, 6, angle, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Sandy beach / grass strip
  const beachGrad = ctx.createLinearGradient(0, ROAD_BOT, 0, H);
  beachGrad.addColorStop(0, '#2a5a2a');
  beachGrad.addColorStop(1, '#1a4a1a');
  ctx.fillStyle = beachGrad;
  ctx.fillRect(0, ROAD_BOT, W, H - ROAD_BOT);
}

// ── Road ──────────────────────────────────────────────────────────────────────
export function drawRoad(ctx, map) {
  // Shoulders
  ctx.fillStyle = map.shoulderColor || '#111';
  ctx.fillRect(0, ROAD_TOP - 8, W, 8);
  ctx.fillRect(0, ROAD_BOT, W, 8);

  // Road surface
  ctx.fillStyle = map.roadColor || '#222';
  ctx.fillRect(0, ROAD_TOP, W, ROAD_BOT - ROAD_TOP);

  // Centre divider line
  ctx.strokeStyle = map.dividerColor || '#fff';
  ctx.lineWidth = 4;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(0, ROAD_TOP + (ROAD_BOT - ROAD_TOP) / 2);
  ctx.lineTo(W, ROAD_TOP + (ROAD_BOT - ROAD_TOP) / 2);
  ctx.stroke();

  // Lane markings (dashed)
  const dashOffset = -((offsets.near) % 80);
  ctx.strokeStyle = map.roadLines || '#fff';
  ctx.lineWidth = 2;
  ctx.setLineDash([50, 30]);
  ctx.lineDashOffset = dashOffset;

  const laneH = (ROAD_BOT - ROAD_TOP) / 4;
  // Lane 0|1 divider (same-dir side)
  ctx.beginPath();
  ctx.moveTo(0, ROAD_TOP + laneH);
  ctx.lineTo(W, ROAD_TOP + laneH);
  ctx.stroke();
  // Lane 2|3 divider (oncoming side)
  ctx.beginPath();
  ctx.moveTo(0, ROAD_TOP + laneH * 3);
  ctx.lineTo(W, ROAD_TOP + laneH * 3);
  ctx.stroke();

  ctx.setLineDash([]);

  // Road edge lines
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, ROAD_TOP); ctx.lineTo(W, ROAD_TOP);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, ROAD_BOT); ctx.lineTo(W, ROAD_BOT);
  ctx.stroke();
}
