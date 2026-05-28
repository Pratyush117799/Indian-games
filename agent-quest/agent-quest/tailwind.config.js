/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core cyberpunk palette
        cyber: {
          bg:        '#020408',   // near-black deep space
          surface:   '#080e1a',   // card backgrounds
          border:    '#0d1f3c',   // subtle borders
          cyan:      '#00f5ff',   // primary neon
          purple:    '#bd00ff',   // secondary neon
          pink:      '#ff0090',   // accent / danger
          green:     '#00ff88',   // success / XP
          amber:     '#ffaa00',   // warning / collectibles
          muted:     '#3a5070',   // disabled / placeholder text
          text:      '#c8e0ff',   // body text
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'monospace'],   // headings / HUD
        mono:    ['"JetBrains Mono"', 'monospace'],  // code / terminal
        body:    ['"Exo 2"', 'sans-serif'],     // body / dialogue
      },
      boxShadow: {
        'neon-cyan':   '0 0 8px #00f5ff, 0 0 24px #00f5ff44',
        'neon-purple': '0 0 8px #bd00ff, 0 0 24px #bd00ff44',
        'neon-pink':   '0 0 8px #ff0090, 0 0 24px #ff009044',
        'neon-green':  '0 0 8px #00ff88, 0 0 24px #00ff8844',
        'neon-amber':  '0 0 8px #ffaa00, 0 0 24px #ffaa0044',
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'scan':         'scan 4s linear infinite',
        'flicker':      'flicker 0.15s infinite',
        'float':        'float 3s ease-in-out infinite',
        'glitch':       'glitch 0.4s steps(2, end) infinite',
        'type':         'typing 2s steps(30, end)',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%':   { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        glitch: {
          '0%':   { clipPath: 'inset(40% 0 61% 0)' },
          '20%':  { clipPath: 'inset(92% 0 1% 0)' },
          '40%':  { clipPath: 'inset(43% 0 1% 0)' },
          '60%':  { clipPath: 'inset(25% 0 58% 0)' },
          '80%':  { clipPath: 'inset(54% 0 7% 0)' },
          '100%': { clipPath: 'inset(58% 0 43% 0)' },
        },
        typing: {
          from: { width: '0' },
          to:   { width: '100%' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px #00f5ff, 0 0 24px #00f5ff44' },
          '50%':      { boxShadow: '0 0 16px #00f5ff, 0 0 48px #00f5ff88' },
        },
      },
      backgroundImage: {
        'grid-cyber': `
          linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)
        `,
        'scanlines': `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,0.15) 2px,
          rgba(0,0,0,0.15) 4px
        )`,
      },
      backgroundSize: {
        'grid-40':  '40px 40px',
      },
    },
  },
  plugins: [],
}
