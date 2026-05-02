/**
 * GameLoop — requestAnimationFrame loop with fixed-timestep physics.
 * update(dt) is called at a fixed 1/60 s step.
 * render() is called once per frame.
 */
export class GameLoop {
  constructor({ update, render }) {
    this._update      = update;
    this._render      = render;
    this._running     = false;
    this._raf         = null;
    this._last        = 0;
    this._accumulator = 0;
    this._FIXED_DT    = 1 / 60;
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._last    = performance.now();
    this._raf     = requestAnimationFrame(t => this._tick(t));
  }

  stop() {
    this._running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  _tick(now) {
    if (!this._running) return;
    let dt = Math.min((now - this._last) / 1000, 0.1); // cap at 100 ms
    this._last = now;
    this._accumulator += dt;
    while (this._accumulator >= this._FIXED_DT) {
      this._update(this._FIXED_DT);
      this._accumulator -= this._FIXED_DT;
    }
    this._render();
    this._raf = requestAnimationFrame(t => this._tick(t));
  }
}
