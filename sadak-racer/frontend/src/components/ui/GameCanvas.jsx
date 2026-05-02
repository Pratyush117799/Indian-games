import React, { useRef, useEffect } from 'react';
import { useRaceGame } from '../../hooks/useRaceGame';
import { W, H } from '../../game/constants';

export default function GameCanvas({ map, mode, carColor, onRaceEnd, onPause }) {
  const canvasRef = useRef(null);

  // Fit canvas to window preserving aspect
  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const scale = Math.min(window.innerWidth / W, window.innerHeight / H);
      canvas.style.width  = `${W * scale}px`;
      canvas.style.height = `${H * scale}px`;
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const { phase } = useRaceGame({ canvasRef, map, mode, carColor, onRaceEnd });

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '100vw', height: '100vh', background: '#000',
    }}>
      <canvas
        id="game-canvas"
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: 'block', imageRendering: 'crisp-edges', cursor: 'none' }}
      />
    </div>
  );
}
