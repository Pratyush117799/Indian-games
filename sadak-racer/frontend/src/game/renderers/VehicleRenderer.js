/**
 * VehicleRenderer — draws every vehicle type as pixel-art style canvas shapes.
 * No external assets needed — all procedural.
 */

import { PLAYER_X_SIDE } from '../constants';
import { getSirenColor } from '../systems/PoliceSystem';

// ── Player car ────────────────────────────────────────────────────────────────
export function drawPlayerCar(ctx, player, shakeX = 0, shakeY = 0) {
  const x = PLAYER_X_SIDE + shakeX;
  const y = player.y + shakeY;
  const color = player.color || '#e74c3c';

  ctx.save();

  // Invincibility flash
  if (player.invincible > 0 && Math.floor(player.invincible * 10) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(x, y + 16, 28, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x - 28, y - 13, 56, 26, 5);
  ctx.fill();

  // Roof
  ctx.fillStyle = lighten(color, 20);
  ctx.beginPath();
  ctx.roundRect(x - 14, y - 20, 28, 14, 4);
  ctx.fill();

  // Windshield
  ctx.fillStyle = 'rgba(180,230,255,0.8)';
  ctx.beginPath();
  ctx.roundRect(x + 2, y - 19, 14, 12, 2);
  ctx.fill();

  // Rear window
  ctx.fillStyle = 'rgba(180,230,255,0.7)';
  ctx.beginPath();
  ctx.roundRect(x - 16, y - 18, 10, 10, 2);
  ctx.fill();

  // Headlights
  ctx.fillStyle = '#fff9c4';
  ctx.shadowColor = '#fff9c4';
  ctx.shadowBlur = 10;
  ctx.fillRect(x + 24, y - 9, 6, 5);
  ctx.fillRect(x + 24, y + 4, 6, 5);
  ctx.shadowBlur = 0;

  // Taillights
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(x - 30, y - 9, 5, 5);
  ctx.fillRect(x - 30, y + 4, 5, 5);

  // Wheels
  ctx.fillStyle = '#222';
  [{ dx: 18, dy: 13 }, { dx: -16, dy: 13 }].forEach(w => {
    ctx.beginPath();
    ctx.arc(x + w.dx, y + w.dy, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.arc(x + w.dx, y + w.dy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
  });

  // Nitro flame if active
  if (player.usingNitro) {
    ctx.fillStyle = '#00eeff';
    ctx.shadowColor = '#00eeff';
    ctx.shadowBlur = 15;
    const fw = 12 + Math.random() * 10;
    ctx.beginPath();
    ctx.moveTo(x - 28, y - 4);
    ctx.lineTo(x - 28 - fw, y);
    ctx.lineTo(x - 28, y + 4);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

// ── Traffic vehicles ──────────────────────────────────────────────────────────
export function drawVehicle(ctx, v) {
  const { type, x, y, color, colorDetail, isOncoming, animFrame } = v;
  const drawers = { car, taxi, auto: autoRick, bus, truck, bike, cycle, camel, cow, police };
  (drawers[type] || car)(ctx, x, y, color, colorDetail, isOncoming, animFrame);
}

function car(ctx, x, y, color, detail, oncoming) {
  const dir = oncoming ? -1 : 1;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(x, y + 14, 24, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(x - 24, y - 12, 48, 24, 4); ctx.fill();
  ctx.fillStyle = lighten(color, 15);
  ctx.beginPath(); ctx.roundRect(x - 10, y - 18, 22, 13, 3); ctx.fill();
  ctx.fillStyle = 'rgba(180,230,255,0.75)';
  ctx.beginPath(); ctx.roundRect(x - 8 * dir, y - 17, 12, 11, 2); ctx.fill();
  drawWheels(ctx, x, y, 17, 13, 6);
  drawLights(ctx, x, y, 24, oncoming);
}

function taxi(ctx, x, y, color, detail, oncoming) {
  car(ctx, x, y, '#f1c40f', null, oncoming);
  // Taxi sign on roof
  ctx.fillStyle = '#333';
  ctx.fillRect(x - 6, y - 22, 12, 5);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 5px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TAXI', x, y - 18);
}

function autoRick(ctx, x, y, color, detail, oncoming) {
  const dir = oncoming ? -1 : 1;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath(); ctx.ellipse(x, y + 12, 18, 6, 0, 0, Math.PI * 2); ctx.fill();
  // Three-wheeler body
  ctx.fillStyle = '#f39c12';
  ctx.beginPath(); ctx.roundRect(x - 18, y - 11, 36, 22, 5); ctx.fill();
  // Canopy
  ctx.fillStyle = '#e67e22';
  ctx.beginPath(); ctx.roundRect(x - 10, y - 17, 22, 12, 4); ctx.fill();
  ctx.fillStyle = 'rgba(180,230,255,0.7)';
  ctx.beginPath(); ctx.roundRect(x - 8 * dir, y - 16, 10, 9, 2); ctx.fill();
  // 3 wheels
  ctx.fillStyle = '#222';
  [{ dx: 14, dy: 11 }, { dx: -12, dy: 11 }, { dx: 0, dy: 13 }].forEach(w => {
    ctx.beginPath(); ctx.arc(x + w.dx, y + w.dy, 5, 0, Math.PI * 2); ctx.fill();
  });
}

function bus(ctx, x, y, color, detail, oncoming) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(x, y + 15, 36, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(x - 40, y - 15, 80, 30, 3); ctx.fill();
  // Windows row
  ctx.fillStyle = 'rgba(180,230,255,0.65)';
  for (let i = -28; i < 32; i += 18) {
    ctx.beginPath(); ctx.roundRect(x + i, y - 13, 14, 10, 2); ctx.fill();
  }
  drawWheels(ctx, x, y, 30, 15, 7);
  drawLights(ctx, x, y, 42, oncoming, 5, 8);
}

function truck(ctx, x, y, color, detail, oncoming) {
  const dir = oncoming ? -1 : 1;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(x, y + 16, 40, 8, 0, 0, Math.PI * 2); ctx.fill();
  // Trailer
  ctx.fillStyle = '#7f8c8d';
  ctx.beginPath(); ctx.roundRect(x - 46 * dir, y - 14, 56, 28, 2); ctx.fill();
  // Cab
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(x + (oncoming ? -46 : -10), y - 15, 30, 30, 3); ctx.fill();
  ctx.fillStyle = 'rgba(180,230,255,0.7)';
  ctx.beginPath(); ctx.roundRect(x + (oncoming ? -44 : -8), y - 14, 14, 12, 2); ctx.fill();
  drawWheels(ctx, x, y, 34, 16, 8);
  drawLights(ctx, x, y, 46, oncoming, 6, 10);
}

function bike(ctx, x, y, color, detail, oncoming, frame) {
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath(); ctx.ellipse(x, y + 10, 14, 5, 0, 0, Math.PI * 2); ctx.fill();
  // Frame
  ctx.strokeStyle = color; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 14, y + 8); ctx.lineTo(x, y - 6); ctx.lineTo(x + 14, y + 8);
  ctx.stroke();
  // Rider
  ctx.fillStyle = '#2c3e50';
  ctx.beginPath(); ctx.arc(x + (oncoming ? 6 : -6), y - 10, 7, 0, Math.PI * 2); ctx.fill();
  // Helmet
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x + (oncoming ? 6 : -6), y - 11, 6, Math.PI, 0); ctx.fill();
  // Wheels
  ctx.strokeStyle = '#333'; ctx.lineWidth = 3;
  [x - 14, x + 14].forEach(wx => {
    ctx.beginPath(); ctx.arc(wx, y + 8, 8, 0, Math.PI * 2); ctx.stroke();
  });
}

function cycle(ctx, x, y, color, detail, oncoming, frame) {
  ctx.strokeStyle = '#555'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x-10,y+6); ctx.lineTo(x,y-5); ctx.lineTo(x+10,y+6); ctx.stroke();
  ctx.fillStyle = '#2c3e50';
  ctx.beginPath(); ctx.arc(x+(oncoming?5:-5), y-9, 5, 0, Math.PI*2); ctx.fill();
  [x-10, x+10].forEach(wx=>{
    ctx.beginPath(); ctx.arc(wx, y+6, 7, 0, Math.PI*2); ctx.stroke();
  });
}

function camel(ctx, x, y, color) {
  // Body
  ctx.fillStyle = '#c8a050';
  ctx.beginPath(); ctx.ellipse(x, y, 28, 14, 0, 0, Math.PI * 2); ctx.fill();
  // Hump
  ctx.beginPath(); ctx.ellipse(x + 5, y - 14, 12, 10, 0, 0, Math.PI * 2); ctx.fill();
  // Head
  ctx.beginPath(); ctx.ellipse(x + 24, y - 8, 10, 7, 0.4, 0, Math.PI * 2); ctx.fill();
  // Legs
  ctx.fillStyle = '#b09040';
  [{ dx: -18, dy: 13 }, { dx: -6, dy: 14 }, { dx: 8, dy: 14 }, { dx: 18, dy: 13 }].forEach(l => {
    ctx.fillRect(x + l.dx - 2, y + l.dy, 4, 10);
  });
  // Eye
  ctx.fillStyle = '#333';
  ctx.beginPath(); ctx.arc(x + 28, y - 10, 2, 0, Math.PI * 2); ctx.fill();
}

function cow(ctx, x, y) {
  ctx.fillStyle = '#f0f0f0';
  ctx.beginPath(); ctx.ellipse(x, y, 25, 13, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#888';
  ctx.beginPath(); ctx.arc(x + 20, y - 5, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f0f0f0';
  // Legs
  [{ dx: -16, dy: 12 }, { dx: -5, dy: 13 }, { dx: 6, dy: 13 }, { dx: 15, dy: 12 }].forEach(l => {
    ctx.fillRect(x + l.dx - 2, y + l.dy, 4, 8);
  });
  ctx.fillStyle = '#e87070';
  ctx.fillRect(x + 24, y + 2, 3, 6); // udder area hint
}

function police(ctx, x, y, color, detail, oncoming, frame, v) {
  car(ctx, x, y, '#2471a3', null, oncoming);
  // Police stripe
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 20, y - 4, 40, 6);
  // Siren light
  const sirenColor = getSirenColor(frame * 0.3);
  ctx.fillStyle = sirenColor;
  ctx.shadowColor = sirenColor; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(x, y - 16, 5, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function drawWheels(ctx, x, y, offsetX, offsetY, r) {
  ctx.fillStyle = '#222';
  [x - offsetX, x + offsetX].forEach(wx => {
    ctx.beginPath(); ctx.arc(wx, y + offsetY, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#555';
    ctx.beginPath(); ctx.arc(wx, y + offsetY, r - 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#222';
  });
}

function drawLights(ctx, x, y, offsetX, oncoming, w = 5, h = 7) {
  const frontX = oncoming ? x - offsetX : x + offsetX;
  const rearX  = oncoming ? x + offsetX : x - offsetX;
  ctx.fillStyle = '#fff9c4';
  ctx.shadowColor = '#fff9c4'; ctx.shadowBlur = 8;
  ctx.fillRect(frontX - 1, y - h/2, w, h/2 - 1);
  ctx.fillRect(frontX - 1, y + 2, w, h/2 - 1);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(rearX - w + 1, y - h/2, w - 1, h/2 - 1);
  ctx.fillRect(rearX - w + 1, y + 2, w - 1, h/2 - 1);
}

function lighten(hex, amount) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}
