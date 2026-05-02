/**
 * HUDRenderer — draws all on-screen UI during a race.
 */

import { W, H, RACE_DIST_M, NITRO_MAX } from '../constants';

export function renderHUD(ctx, state) {
  const { player, map, timeMs, nearMissText, wantedLevel,
          policeWarning, score, countdownVal } = state;

  // ── Countdown ───────────────────────────────────────────────────────────────
  if (countdownVal > 0) {
    ctx.save();
    ctx.font = `bold ${120 - (1 - (countdownVal % 1)) * 40}px 'Arial Black', Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = countdownVal > 1 ? Math.ceil(countdownVal).toString() : 'GO!';
    const alpha = countdownVal > 1 ? 1 : countdownVal;
    ctx.fillStyle = `rgba(255,220,50,${alpha})`;
    ctx.strokeStyle = `rgba(0,0,0,${alpha * 0.8})`;
    ctx.lineWidth = 8;
    ctx.strokeText(label, W / 2, H / 2);
    ctx.fillText(label, W / 2, H / 2);
    ctx.restore();
    return; // Don't draw other HUD during countdown
  }

  // ── Speedometer ─────────────────────────────────────────────────────────────
  drawSpeedometer(ctx, player.speed, map.maxSpeed);

  // ── Damage bar ──────────────────────────────────────────────────────────────
  drawDamageBar(ctx, player.damage);

  // ── Nitro bar ───────────────────────────────────────────────────────────────
  drawNitroBar(ctx, player.nitro);

  // ── Distance / progress ─────────────────────────────────────────────────────
  drawProgress(ctx, player.dist);

  // ── Timer ───────────────────────────────────────────────────────────────────
  drawTimer(ctx, timeMs);

  // ── Position ─────────────────────────────────────────────────────────────────
  drawPosition(ctx, player.position || 1);

  // ── Score ────────────────────────────────────────────────────────────────────
  drawScore(ctx, score);

  // ── Near-miss popup ──────────────────────────────────────────────────────────
  if (nearMissText) drawNearMiss(ctx, nearMissText);

  // ── Police warning ───────────────────────────────────────────────────────────
  if (wantedLevel > 0) drawPoliceWarning(ctx, wantedLevel, policeWarning);

  // ── Map name watermark ───────────────────────────────────────────────────────
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(`${map.emoji} ${map.name} · ${map.sub}`, W - 12, H - 14);
  ctx.restore();

  // ── Controls hint (fade out after 5s) ───────────────────────────────────────
  if (state.showHint) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, state.showHint);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(W/2 - 140, H - 42, 280, 30);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('↑/W Accelerate  ←→/AD Lane  SPACE Nitro  P Pause', W/2, H - 22);
    ctx.restore();
  }
}

function drawSpeedometer(ctx, speed, maxSpeed) {
  const cx = 70, cy = H - 70, r = 54;
  // Background
  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#444'; ctx.lineWidth = 2;
  ctx.stroke();

  // Arc
  const startAngle = Math.PI * 0.75;
  const endAngle = Math.PI * 2.25;
  const pct = speed / maxSpeed;
  const needleAngle = startAngle + pct * (endAngle - startAngle);

  // Speed arc background
  ctx.strokeStyle = '#333'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(cx, cy, r - 8, startAngle, endAngle); ctx.stroke();

  // Speed arc fill
  const arcColor = speed > maxSpeed * 0.85 ? '#e74c3c' : speed > maxSpeed * 0.6 ? '#f39c12' : '#2ecc71';
  ctx.strokeStyle = arcColor; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(cx, cy, r - 8, startAngle, needleAngle); ctx.stroke();

  // Needle
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(needleAngle) * (r - 14), cy + Math.sin(needleAngle) * (r - 14));
  ctx.stroke();

  // Centre dot
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();

  // Speed text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(Math.round(speed), cx, cy + 5);
  ctx.font = '9px Arial';
  ctx.fillStyle = '#aaa';
  ctx.fillText('km/h', cx, cy + 16);

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawDamageBar(ctx, damage) {
  const bx = 140, by = H - 30, bw = 130, bh = 14;
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 4); ctx.fill();
  const pct = damage / 100;
  const col = damage > 75 ? '#e74c3c' : damage > 40 ? '#f39c12' : '#2ecc71';
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.roundRect(bx + 2, by + 2, (bw - 4) * (1 - pct), bh - 4, 3); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '9px Arial'; ctx.textAlign = 'left';
  ctx.fillText(`HP  ${100 - Math.round(damage)}%`, bx + 4, by - 3);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawNitroBar(ctx, nitro) {
  const bx = 140, by = H - 52, bw = 130, bh = 12;
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 4); ctx.fill();
  const pct = nitro / NITRO_MAX;
  ctx.fillStyle = pct > 0.5 ? '#00ccff' : '#0066aa';
  if (pct > 0) {
    ctx.shadowColor = '#00ccff'; ctx.shadowBlur = pct > 0.8 ? 10 : 0;
    ctx.beginPath(); ctx.roundRect(bx + 2, by + 2, (bw - 4) * pct, bh - 4, 3); ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.fillStyle = '#00eeff';
  ctx.font = '9px Arial'; ctx.textAlign = 'left';
  ctx.fillText('NITRO', bx + 4, by - 3);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawProgress(ctx, dist) {
  const bx = W / 2 - 100, by = 10, bw = 200, bh = 10;
  const pct = Math.min(1, dist / RACE_DIST_M);
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 3); ctx.fill();
  ctx.fillStyle = '#f39c12';
  ctx.beginPath(); ctx.roundRect(bx + 1, by + 1, (bw - 2) * pct, bh - 2, 2); ctx.fill();
  // Finish flag icon
  ctx.fillStyle = '#fff';
  ctx.font = '12px serif'; ctx.textAlign = 'center';
  ctx.fillText('🏁', bx + bw + 10, by + 10);
  ctx.fillStyle = '#ccc';
  ctx.font = '10px Arial';
  ctx.fillText(`${Math.round(dist)}m / ${RACE_DIST_M}m`, W / 2, by + bh + 12);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawTimer(ctx, ms) {
  const secs = ms / 1000;
  const m = Math.floor(secs / 60);
  const s = (secs % 60).toFixed(2).padStart(5, '0');
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath(); ctx.roundRect(W - 105, 10, 95, 30, 5); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${m}:${s}`, W - 58, 31);
  ctx.restore();
}

function drawPosition(ctx, pos) {
  const labels = ['','1ST','2ND','3RD','4TH'];
  const colors = ['','#ffd700','#c0c0c0','#cd7f32','#aaa'];
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.beginPath(); ctx.roundRect(W - 105, 48, 95, 34, 5); ctx.fill();
  ctx.fillStyle = colors[Math.min(pos, 4)] || '#fff';
  ctx.font = 'bold 22px Arial Black';
  ctx.textAlign = 'center';
  ctx.fillText(labels[Math.min(pos, 4)] || `${pos}TH`, W - 58, 72);
  ctx.restore();
}

function drawScore(ctx, score) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath(); ctx.roundRect(W - 105, 90, 95, 24, 4); ctx.fill();
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`⭐ ${score.toLocaleString()}`, W - 58, 106);
  ctx.restore();
}

function drawNearMiss(ctx, text) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,200,0,0.92)';
  ctx.font = 'bold 20px Arial Black';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
  ctx.fillText(text, W / 2, 80);
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawPoliceWarning(ctx, level, phase) {
  // Flashing siren bar at top
  const sirenAlpha = 0.3 + Math.sin(phase * 6) * 0.25;
  ctx.save();
  ctx.fillStyle = `rgba(${Math.sin(phase*6) > 0 ? '220,50,50' : '50,50,220'},${sirenAlpha})`;
  ctx.fillRect(0, 0, W, 6);
  // Stars
  ctx.fillStyle = '#e74c3c';
  ctx.font = '14px Arial'; ctx.textAlign = 'left';
  for (let i = 0; i < level; i++) {
    ctx.fillText('★', 10 + i * 22, 26);
  }
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px Arial';
  ctx.fillText('POLICE', 10 + level * 22 + 6, 26);
  ctx.restore();
}
