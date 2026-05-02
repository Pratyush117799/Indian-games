/**
 * InputManager — singleton capturing keyboard and touch input.
 * Exposes: up / down / left / right / nitro / pause
 */
class InputManager {
  constructor() {
    this.up    = false;
    this.down  = false;
    this.left  = false;
    this.right = false;
    this.nitro = false;
    this.pause = false;
    this._pauseDown = false;
    this._cleanup = null;
    this._bindKeyboard();
    this._bindTouch();
  }

  _bindKeyboard() {
    const onDown = e => {
      switch (e.code) {
        case 'ArrowUp':    case 'KeyW': this.up    = true; e.preventDefault(); break;
        case 'ArrowDown':  case 'KeyS': this.down  = true; e.preventDefault(); break;
        case 'ArrowLeft':  case 'KeyA': this.left  = true; e.preventDefault(); break;
        case 'ArrowRight': case 'KeyD': this.right = true; e.preventDefault(); break;
        case 'Space':                   this.nitro = true; e.preventDefault(); break;
        case 'Escape': case 'KeyP':
          if (!this._pauseDown) { this.pause = !this.pause; this._pauseDown = true; }
          break;
      }
    };
    const onUp = e => {
      switch (e.code) {
        case 'ArrowUp':    case 'KeyW': this.up    = false; break;
        case 'ArrowDown':  case 'KeyS': this.down  = false; break;
        case 'ArrowLeft':  case 'KeyA': this.left  = false; break;
        case 'ArrowRight': case 'KeyD': this.right = false; break;
        case 'Space':                   this.nitro = false; break;
        case 'Escape': case 'KeyP':     this._pauseDown = false; break;
      }
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup',   onUp);
    this._cleanup = () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup',   onUp);
    };
  }

  _bindTouch() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    let sx = 0, sy = 0, lastTap = 0;

    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.touches[0];
      sx = t.clientX; sy = t.clientY;
      const now = Date.now();
      if (now - lastTap < 280) this.nitro = true;
      lastTap = now;
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      const t = e.touches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      const THR = 18;
      this.left  = dx < -THR;
      this.right = dx >  THR;
      this.up    = dy < -THR;
      this.down  = dy >  THR;
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      this.up = this.down = this.left = this.right = this.nitro = false;
    });
  }

  destroy() { this._cleanup?.(); }
}

export const input = new InputManager();
