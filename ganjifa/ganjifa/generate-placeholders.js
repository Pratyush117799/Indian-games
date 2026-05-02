#!/usr/bin/env node
/**
 * Ganjifa Placeholder Card Generator
 * Creates SVG placeholder cards for all 336 card image slots.
 * Run: node generate-placeholders.js
 *
 * Output: cards/{theme}/{suit}/{rank}.svg
 * These are rendered as circular fallback cards until real AI-generated
 * images are added. The backend serves both .png and .svg from /cards/.
 *
 * Replace any .svg with a .png of the same name to upgrade that card.
 */

const fs   = require('fs');
const path = require('path');

// ── Suit definitions (mirrors cardDefinitions.js) ─────────────
const SUITS = {
  dashavatara: [
    { slug:'matsya',      name:'Matsya',      bg:'#0A0A1A', border:'#B8860B', pip:'🐟', type:'B' },
    { slug:'kurma',       name:'Kurma',       bg:'#8B5E1A', border:'#DAA520', pip:'🐢', type:'K' },
    { slug:'varaha',      name:'Varaha',      bg:'#0A2A0A', border:'#228B22', pip:'🐗', type:'B' },
    { slug:'narasimha',   name:'Narasimha',   bg:'#6B0000', border:'#FF4500', pip:'🦁', type:'B' },
    { slug:'vamana',      name:'Vamana',      bg:'#001F3F', border:'#87CEEB', pip:'👣', type:'K' },
    { slug:'parashurama', name:'Parashurama', bg:'#2A0A0A', border:'#8B0000', pip:'🪓', type:'B' },
    { slug:'rama',        name:'Rama',        bg:'#003333', border:'#20B2AA', pip:'🏹', type:'K' },
    { slug:'krishna',     name:'Krishna',     bg:'#001A33', border:'#4169E1', pip:'🪈', type:'B' },
    { slug:'buddha',      name:'Buddha',      bg:'#3D1A00', border:'#FF8C00', pip:'☸', type:'K' },
    { slug:'kalki',       name:'Kalki',       bg:'#1A1A2E', border:'#C0C0C0', pip:'⚔', type:'B' },
  ],
  ramayana: [
    { slug:'rama',        name:'Rama',        bg:'#004444', border:'#20B2AA', pip:'🏹', type:'B' },
    { slug:'sita',        name:'Sita',        bg:'#4A3000', border:'#FFD700', pip:'🌸', type:'K' },
    { slug:'lakshmana',   name:'Lakshmana',   bg:'#003300', border:'#32CD32', pip:'🗡',  type:'B' },
    { slug:'hanuman',     name:'Hanuman',     bg:'#4A1400', border:'#FF6347', pip:'🔱', type:'B' },
    { slug:'ravana',      name:'Ravana',      bg:'#1A0000', border:'#DC143C', pip:'👑', type:'K' },
    { slug:'kumbhakarna', name:'Kumbhakarna', bg:'#000A1F', border:'#4169E1', pip:'⚔', type:'K' },
    { slug:'sugriva',     name:'Sugriva',     bg:'#2A1500', border:'#CD853F', pip:'🌿', type:'B' },
    { slug:'vibhishana',  name:'Vibhishana',  bg:'#1A0033', border:'#9370DB', pip:'🕊', type:'K' },
  ],
  geopolitics: [
    { slug:'rafale',  name:'Rafale',   bg:'#00206A', border:'#C0C0C0', pip:'✈', type:'B' },
    { slug:'su57',    name:'Su-57',    bg:'#8B0000', border:'#FFD700', pip:'✈', type:'B' },
    { slug:'f35',     name:'F-35',     bg:'#1C2951', border:'#C0C0C0', pip:'⚡', type:'B' },
    { slug:'brahmos', name:'BrahMos',  bg:'#FF6600', border:'#138808', pip:'🚀', type:'B' },
    { slug:'tejas',   name:'Tejas',    bg:'#005500', border:'#FF9933', pip:'✈', type:'K' },
    { slug:'s400',    name:'S-400',    bg:'#1A2A00', border:'#8B8B00', pip:'🎯', type:'K' },
    { slug:'b2',      name:'B-2',      bg:'#0A0A0A', border:'#888888', pip:'💀', type:'B' },
    { slug:'kalibr',  name:'Kalibr',   bg:'#001433', border:'#4682B4', pip:'🌊', type:'K' },
    { slug:'drone',   name:'Drone',    bg:'#1A1400', border:'#B8860B', pip:'💥', type:'K' },
    { slug:'carrier', name:'Carrier',  bg:'#001A2E', border:'#00CED1', pip:'⚓', type:'B' },
  ],
};

const RANKS = ['raja','mantri','1','2','3','4','5','6','7','8','9','10'];
const RANK_LABELS = {
  raja:'Raja', mantri:'Mantri', '1':'1', '2':'2', '3':'3', '4':'4',
  '5':'5', '6':'6', '7':'7', '8':'8', '9':'9', '10':'10'
};

// ── SVG card builder ──────────────────────────────────────────
function makeSvg(suit, rank) {
  const isRaja   = rank === 'raja';
  const isMantri = rank === 'mantri';
  const isCourt  = isRaja || isMantri;
  const num      = parseInt(rank);
  const typeLabel = suit.type === 'B' ? 'Bishbar' : 'Kambar';
  const label    = RANK_LABELS[rank];

  // Pip arrangement for numbered cards
  function pipLayout(n) {
    const positions = {
      1:  [[50,50]],
      2:  [[50,28],[50,72]],
      3:  [[50,22],[50,50],[50,78]],
      4:  [[32,28],[68,28],[32,72],[68,72]],
      5:  [[32,24],[68,24],[50,50],[32,76],[68,76]],
      6:  [[32,24],[68,24],[32,50],[68,50],[32,76],[68,76]],
      7:  [[32,22],[68,22],[50,36],[32,50],[68,50],[32,72],[68,72]],
      8:  [[30,22],[70,22],[30,40],[70,40],[30,58],[70,58],[30,76],[70,76]],
      9:  [[30,20],[70,20],[30,36],[70,36],[50,50],[30,64],[70,64],[30,80],[70,80]],
      10: [[30,18],[70,18],[30,34],[70,34],[50,46],[50,54],[30,66],[70,66],[30,82],[70,82]],
    };
    return (positions[n] || []).map(([x,y]) =>
      `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="12">${suit.pip}</text>`
    ).join('\n');
  }

  const body = isCourt
    ? `
      <!-- Crown / court indicator -->
      <circle cx="50" cy="42" r="18" fill="${suit.border}" opacity="0.25"/>
      <text x="50" y="38" text-anchor="middle" dominant-baseline="middle" font-size="20">${suit.pip}</text>
      <text x="50" y="57" text-anchor="middle" dominant-baseline="middle"
            font-size="9" fill="${suit.border}" font-weight="bold" font-family="serif">
        ${isRaja ? 'RAJA' : 'MANTRI'}
      </text>
      <text x="50" y="70" text-anchor="middle" dominant-baseline="middle"
            font-size="7" fill="${suit.border}" opacity="0.7">${suit.name}</text>
      <text x="50" y="80" text-anchor="middle" dominant-baseline="middle"
            font-size="6" fill="${suit.border}" opacity="0.5">${typeLabel}</text>`
    : `
      <g opacity="0.85">${pipLayout(num)}</g>
      <text x="50" y="84" text-anchor="middle" dominant-baseline="middle"
            font-size="7" fill="${suit.border}" opacity="0.6">${suit.name}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
  <defs>
    <clipPath id="circle"><circle cx="50" cy="50" r="48"/></clipPath>
  </defs>
  <!-- Background -->
  <circle cx="50" cy="50" r="50" fill="${suit.bg}"/>
  <!-- Outer border ring -->
  <circle cx="50" cy="50" r="48" fill="none" stroke="${suit.border}" stroke-width="3"/>
  <!-- Inner ring -->
  <circle cx="50" cy="50" r="42" fill="none" stroke="${suit.border}" stroke-width="1" opacity="0.4"/>
  <!-- Corner rank labels -->
  <text x="12" y="14" text-anchor="middle" font-size="8" fill="${suit.border}" opacity="0.7" font-weight="bold">${label}</text>
  <text x="88" y="90" text-anchor="middle" font-size="8" fill="${suit.border}" opacity="0.7" font-weight="bold" transform="rotate(180,88,90)">${label}</text>
  <!-- Decorative dots -->
  ${Array.from({length:12},(_,i)=>{
    const a=(i/12)*2*Math.PI, r=44;
    const cx=50+r*Math.cos(a), cy=50+r*Math.sin(a);
    return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="1.2" fill="${suit.border}" opacity="0.3"/>`;
  }).join('')}
  <!-- Card body clipped to circle -->
  <g clip-path="url(#circle)">${body}</g>
</svg>`;
}

// ── Generate all cards ────────────────────────────────────────
let count = 0;
const cardsDir = path.join(__dirname, 'cards');

Object.entries(SUITS).forEach(([theme, suits]) => {
  suits.forEach(suit => {
    const dir = path.join(cardsDir, theme, suit.slug);
    fs.mkdirSync(dir, { recursive: true });

    RANKS.forEach(rank => {
      const outPath = path.join(dir, `${rank}.svg`);
      // Don't overwrite existing PNGs (real images)
      if (fs.existsSync(path.join(dir, `${rank}.png`))) return;
      fs.writeFileSync(outPath, makeSvg(suit, rank));
      count++;
    });
  });
});

console.log(`✅ Generated ${count} SVG placeholder cards`);
console.log(`   Cards are in: cards/{theme}/{suit}/{rank}.svg`);
console.log(`   Replace any .svg with a .png to use AI-generated images.`);
