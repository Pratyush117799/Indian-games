/**
 * TopDownRenderer — draws the top-down (bird's eye) mode.
 * Road runs vertically on screen; player scrolls upward.
 */

import { W, H, TD_ROAD_LEFT, TD_ROAD_RIGHT, TD_ROAD_W, TD_NUM_LANES, TD_LANE_W } from '../constants';
import { PLAYER_COLORS } from '../constants';

let tdOffset = 0;

export function resetTopDown() { tdOffset = 0; }

export function scrollTopDown(playerSpeed, dt) {
  tdOffset = (tdOffset + (playerSpeed / 3.6) * 0.5 * dt * 60) % 120;
}

export function renderTopDown(ctx, gameState) {
  const { player, traffic, police: policeList, map, particles } = gameState;

  // ── Background ────────────────────────────────────────────────────────────
  ctx.fillStyle = map.sideLeftColor || '#1a4a1a';
  ctx.fillRect(0, 0, TD_ROAD_LEFT, H);
  ctx.fillStyle = map.sideRightColor || '#1a4a1a';
  ctx.fillRect(TD_ROAD_RIGHT, 0, W - TD_ROAD_RIGHT, H);

  // ── Road ──────────────────────────────────────────────────────────────────
  ctx.fillStyle = map.roadColor || '#333';
  ctx.fillRect(TD_ROAD_LEFT, 0, TD_ROAD_W, H);

  // Lane markings
  ctx.strokeStyle = map.roadLines || '#fff';
  ctx.lineWidth = 2;
  ctx.setLineDash([40, 30]);
  ctx.lineDashOffset = -tdOffset;
  for (let i = 1; i < TD_NUM_LANES; i++) {
    const lx = TD_ROAD_LEFT + i * TD_LANE_W;
    ctx.beginPath();
    ctx.moveTo(lx, 0); ctx.lineTo(lx, H);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Centre divider
  const midX = TD_ROAD_LEFT + TD_ROAD_W / 2;
  ctx.strokeStyle = map.dividerColor || '#fff';
  ctx.lineWidth = 4;
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(midX, 0); ctx.lineTo(midX, H); ctx.stroke();

  // Road edges
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
  [TD_ROAD_LEFT, TD_ROAD_RIGHT].forEach(ex => {
    ctx.beginPath(); ctx.moveTo(ex, 0); ctx.lineTo(ex, H); ctx.stroke();
  });

  // ── Traffic ───────────────────────────────────────────────────────────────
  for (const v of traffic) {
    if (!v.active) continue;
    drawTopDownVehicle(ctx, v);
  }

  // ── Police ────────────────────────────────────────────────────────────────
  for (const p of (policeList || [])) {
    if (!p.active) continue;
    drawTopDownPolice(ctx, p);
  }

  // ── Player car ────────────────────────────────────────────────────────────
  drawTopDownPlayer(ctx, player);

  // ── Particles ─────────────────────────────────────────────────────────────
  particles?.render(ctx);
}

function laneToX(lane) {
  // In top-down: lanes 0,1 = left half (same dir going up), 2,3 = right half (oncoming going down)
  return TD_ROAD_LEFT + (lane + 0.5) * TD_LANE_W;
}

function drawTopDownPlayer(ctx, player) {
  const x = laneToX(player.lane);
  const y = H * 0.7; // fixed vertical position

  ctx.save();
  if (player.invincible > 0 && Math.floor(player.invincible * 10) % 2 === 0) ctx.globalAlpha = 0.4;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(x + 3, y + 3, 14, 22, 0, 0, Math.PI * 2); ctx.fill();

  // Body
  ctx.fillStyle = player.color || '#e74c3c';
  ctx.beginPath(); ctx.roundRect(x - 13, y - 22, 26, 44, 5); ctx.fill();

  // Roof
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath(); ctx.roundRect(x - 8, y - 14, 16, 28, 3); ctx.fill();

  // Headlights (top = front)
  ctx.fillStyle = '#fff9c4';
  ctx.shadowColor = '#fff9c4'; ctx.shadowBlur = 8;
  ctx.fillRect(x - 10, y - 26, 6, 5);
  ctx.fillRect(x + 4, y - 26, 6, 5);
  ctx.shadowBlur = 0;

  // Taillights
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(x - 10, y + 21, 6, 5);
  ctx.fillRect(x + 4, y + 21, 6, 5);

  // Wheels
  ctx.fillStyle = '#222';
  [[-12,-14],[12,-14],[-12,12],[12,12]].forEach(([dx,dy])=>{
    ctx.beginPath(); ctx.ellipse(x+dx, y+dy, 4, 6, 0, 0, Math.PI*2); ctx.fill();
  });

  // Nitro
  if (player.usingNitro) {
    ctx.fillStyle = '#00eeff';
    ctx.shadowColor = '#00eeff'; ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(x-6, y+22); ctx.lineTo(x, y+22+12+Math.random()*10); ctx.lineTo(x+6, y+22);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawTopDownVehicle(ctx, v) {
  const x = v.tdX !== undefined ? v.tdX : laneToX(v.lane);
  const y = v.tdY !== undefined ? v.tdY : H / 2;
  const isOncoming = v.isOncoming;
  const len = v.type === 'truck' ? 52 : v.type === 'bus' ? 46 : v.type === 'auto' ? 28 : 34;
  const wid = v.type === 'truck' ? 18 : v.type === 'bus' ? 16 : 14;

  ctx.save();
  if (isOncoming) { ctx.translate(x, y); ctx.scale(1, -1); ctx.translate(-x, -y); }

  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(x + 3, y + 3, wid, len / 2, 0, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = v.color;
  ctx.beginPath(); ctx.roundRect(x - wid, y - len/2, wid*2, len, 4); ctx.fill();

  ctx.fillStyle = 'rgba(180,230,255,0.65)';
  ctx.beginPath(); ctx.roundRect(x - wid + 3, y - len/2 + 3, wid*2 - 6, len * 0.35, 2); ctx.fill();

  // Lights
  ctx.fillStyle = isOncoming ? '#e74c3c' : '#fff9c4';
  ctx.fillRect(x - wid + 2, y - len/2 - 3, wid*2 - 4, 4);

  ctx.restore();
}

function drawTopDownPolice(ctx, p) {
  const x = laneToX(Math.max(0, Math.min(1, p.lane)));
  const y = p.tdY !== undefined ? p.tdY : H * 0.5;
  ctx.save();
  ctx.fillStyle = '#2471a3';
  ctx.beginPath(); ctx.roundRect(x - 12, y - 20, 24, 40, 4); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 10, y - 5, 20, 10);
  const sc = Math.sin(p.sirenPhase * 6) > 0 ? '#e74c3c' : '#3498db';
  ctx.fillStyle = sc;
  ctx.shadowColor = sc; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(x, y - 22, 5, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}
