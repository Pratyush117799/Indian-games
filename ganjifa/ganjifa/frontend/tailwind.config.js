/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Mughal court palette
        gold:    { DEFAULT:'#DAA520', light:'#F5C842', dark:'#B8860B', deep:'#8B6914' },
        crimson: { DEFAULT:'#DC143C', dark:'#8B0000', light:'#FF4444' },
        indigo:  { DEFAULT:'#2E0854', light:'#4B0082', bright:'#6A0DAD' },
        felt:    { DEFAULT:'#1B4332', light:'#2D6A4F', dark:'#0F2419' }, // card table green
        ivory:   { DEFAULT:'#FFFFF0', warm:'#FFF8DC', cream:'#FAEBD7' },
        copper:  { DEFAULT:'#B87333', light:'#DA8A67' },
        // Theme colours
        dashavatara: '#2E0854',
        ramayana:    '#8B0000',
        geopolitics: '#0A1628',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        mughal:  ['Cinzel', 'serif'],        // decorative headings
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
      boxShadow: {
        'card':      '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(218,165,32,0.3)',
        'card-glow': '0 0 24px rgba(218,165,32,0.8), 0 0 8px rgba(218,165,32,0.4)',
        'table':     'inset 0 0 60px rgba(0,0,0,0.4)',
        'hukm':      '0 0 40px rgba(218,165,32,1), 0 0 80px rgba(218,165,32,0.5)',
      },
      animation: {
        'card-deal':     'cardDeal 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'card-play':     'cardPlay 0.4s ease-out forwards',
        'trick-sweep':   'trickSweep 0.6s ease-in forwards',
        'hukm-flash':    'hukmFlash 1s ease-out',
        'card-hover':    'cardHover 0.2s ease-out forwards',
        'gold-shimmer':  'goldShimmer 2s ease-in-out infinite',
        'win-rain':      'winRain 3s linear infinite',
        'float':         'float 3s ease-in-out infinite',
      },
      keyframes: {
        cardDeal: {
          '0%':   { transform:'translateY(-200px) rotate(10deg) scale(0.5)', opacity:'0' },
          '100%': { transform:'translateY(0) rotate(0) scale(1)',            opacity:'1' },
        },
        cardPlay: {
          '0%':   { transform:'scale(1) translateY(0)' },
          '50%':  { transform:'scale(1.15) translateY(-20px)' },
          '100%': { transform:'scale(1) translateY(0)' },
        },
        trickSweep: {
          '0%':   { transform:'scale(1)', opacity:'1' },
          '100%': { transform:'scale(0.2) translateY(100px)', opacity:'0' },
        },
        hukmFlash: {
          '0%':   { boxShadow:'0 0 0px rgba(218,165,32,0)' },
          '50%':  { boxShadow:'0 0 60px rgba(218,165,32,0.9), 0 0 120px rgba(218,165,32,0.5)' },
          '100%': { boxShadow:'0 0 20px rgba(218,165,32,0.3)' },
        },
        cardHover: {
          '0%':   { transform:'translateY(0) scale(1)' },
          '100%': { transform:'translateY(-12px) scale(1.05)' },
        },
        goldShimmer: {
          '0%,100%': { backgroundPosition:'0% 50%' },
          '50%':     { backgroundPosition:'100% 50%' },
        },
        winRain: {
          '0%':   { transform:'translateY(-100vh) rotate(0deg)' },
          '100%': { transform:'translateY(100vh) rotate(720deg)' },
        },
        float: {
          '0%,100%': { transform:'translateY(0px)' },
          '50%':     { transform:'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #B8860B 0%, #DAA520 40%, #F5C842 60%, #DAA520 80%, #B8860B 100%)',
        'felt-gradient': 'radial-gradient(ellipse at center, #2D6A4F 0%, #1B4332 50%, #0F2419 100%)',
        'mughal-pattern': "url('/assets/patterns/mughal.svg')",
        'card-back-dashavatara': "url('/assets/card-backs/dashavatara.png')",
      },
    },
  },
  plugins: [],
};
