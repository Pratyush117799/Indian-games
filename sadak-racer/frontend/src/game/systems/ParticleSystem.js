/**
 * ParticleSystem — manages visual particles for crashes, nitro, near-miss dust.
 */

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(type, x, y, options = {}) {
    const emitters = {
      crash:    () => this._crash(x, y, options),
      spark:    () => this._sparks(x, y, options),
      dust:     () => this._dust(x, y, options),
      nitro:    () => this._nitro(x, y, options),
      smoke:    () => this._smoke(x, y, options),
      stars:    () => this._stars(x, y, options),
      sandpuff: () => this._sand(x, y, options),
      snow:     () => this._snow(x, y, options),
    };
    emitters[type]?.();
  }

  _crash(x, y, { color = '#e74c3c' } = {}) {
    for (let i = 0; i < 22; i++) {
      const angle = (Math.PI * 2 * i) / 22 + (Math.random() - 0.5) * 0.5;
      const speed = 60 + Math.random() * 180;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        life: 1, decay: 0.7 + Math.random() * 0.5,
        r: 3 + Math.random() * 6,
        color: Math.random() > 0.5 ? color : '#f39c12',
        type: 'debris',
        gravity: 180,
      });
    }
  }

  _sparks(x, y, { count = 12, color = '#ffd700' } = {}) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 200,
        vy: -50 - Math.random() * 120,
        life: 1, decay: 2.5 + Math.random(),
        r: 1.5 + Math.random() * 2.5,
        color,
        type: 'spark',
        gravity: 120,
      });
    }
  }

  _dust(x, y, { size = 1 } = {}) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 15,
        vx: -20 + (Math.random() - 0.5) * 40,
        vy: -10 - Math.random() * 20,
        life: 1, decay: 1.5 + Math.random(),
        r: (8 + Math.random() * 12) * size,
        color: 'rgba(200,180,140,0.6)',
        type: 'cloud',
        gravity: 5,
      });
    }
  }

  _nitro(x, y) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: x - 10 + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: -120 - Math.random() * 80,
        vy: (Math.random() - 0.5) * 30,
        life: 1, decay: 5,
        r: 4 + Math.random() * 6,
        color: Math.random() > 0.5 ? '#00ffff' : '#0099ff',
        type: 'flame',
        gravity: 0,
      });
    }
  }

  _smoke(x, y) {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y,
        vx: -30 - Math.random() * 40,
        vy: -15 - Math.random() * 25,
        life: 1, decay: 0.8,
        r: 10 + Math.random() * 14,
        color: 'rgba(120,120,120,0.5)',
        type: 'cloud',
        gravity: -8,
      });
    }
  }

  _stars(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * 60,
        vy: Math.sin(angle) * 60 - 50,
        life: 1, decay: 1.8,
        r: 5, color: '#ffd700',
        type: 'star',
        gravity: 40,
        spin: (Math.random() - 0.5) * 10,
        spinAngle: 0,
      });
    }
  }

  _sand(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y,
        vx: (Math.random() - 0.5) * 80,
        vy: -20 - Math.random() * 40,
        life: 1, decay: 1.2,
        r: 6 + Math.random() * 10,
        color: `rgba(${180 + Math.random() * 40|0},${150 + Math.random() * 30|0},80,0.7)`,
        type: 'cloud',
        gravity: 30,
      });
    }
  }

  _snow(x, y) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 60,
        vy: -30 - Math.random() * 50,
        life: 1, decay: 1.0,
        r: 3 + Math.random() * 5,
        color: 'rgba(255,255,255,0.9)',
        type: 'cloud',
        gravity: 20,
      });
    }
  }

  update(dt) {
    for (const p of this.particles) {
      p.x  += p.vx * dt;
      p.y  += p.vy * dt;
      p.vy += (p.gravity || 0) * dt;
      p.vx *= 0.97;
      p.life -= (p.decay || 1) * dt;
      if (p.spinAngle !== undefined) p.spinAngle += (p.spin || 0) * dt;
    }
    this.particles = this.particles.filter(p => p.life > 0);
  }

  render(ctx) {
    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life * (p.type === 'cloud' ? 0.7 : 1));

      if (p.type === 'spark' || p.type === 'flame') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'cloud') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'star') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spinAngle || 0);
        ctx.fillStyle = p.color;
        drawStar(ctx, 0, 0, p.r, p.r * 0.4, 5);
        ctx.restore();
      } else {
        // debris
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.r * p.life), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

function drawStar(ctx, cx, cy, outerR, innerR, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    if (i === 0) ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
    else ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
  }
  ctx.closePath();
  ctx.fill();
}
