/**
 * Ganjifa Card Definitions
 *
 * Every suit has exactly 12 cards:
 *   - 'raja'   (King  — always highest)
 *   - 'mantri' (Minister — second)
 *   - '1' through '10' (pip cards)
 *
 * Suit type determines pip-card ranking direction:
 *   BISHBAR (strong): pip rank order is 10 > 9 > … > 1  (10 is highest pip)
 *   KAMBAR  (weak):   pip rank order is 1 > 2 > … > 10  (1 is highest pip)
 *
 * Within each theme, suits alternate bishbar/kambar by tradition.
 */

// ── Rank helpers ─────────────────────────────────────────────
const COURT_RANKS = ['raja', 'mantri'];
const PIP_RANKS   = ['1','2','3','4','5','6','7','8','9','10'];
const ALL_RANKS   = [...COURT_RANKS, ...PIP_RANKS];

/**
 * Get numeric strength of a card within its suit.
 * Higher = beats lower.
 * Raja=12, Mantri=11, then pips by bishbar/kambar.
 */
function getStrength(rank, isBishbar) {
  if (rank === 'raja')   return 12;
  if (rank === 'mantri') return 11;
  const n = parseInt(rank);
  return isBishbar ? n : (11 - n);  // bishbar: 10→10, 1→1; kambar: 1→10, 10→1
}

// ── DASHAVATARA — 10 suits × 12 = 120 cards ──────────────────
const DASHAVATARA_SUITS = [
  {
    slug: 'matsya', name: 'Matsya', nameHindi: 'मत्स्य',
    avatar: 'Fish Avatar (1st Incarnation)',
    type: 'bishbar', bgColor: '#0A0A1A', borderColor: '#B8860B',
    pipSymbol: '🐟', description: 'The cosmic fish who saved the Vedas'
  },
  {
    slug: 'kurma', name: 'Kurma', nameHindi: 'कूर्म',
    avatar: 'Tortoise Avatar (2nd Incarnation)',
    type: 'kambar', bgColor: '#8B5E1A', borderColor: '#DAA520',
    pipSymbol: '🐢', description: 'The tortoise who supported Mount Mandara'
  },
  {
    slug: 'varaha', name: 'Varaha', nameHindi: 'वराह',
    avatar: 'Boar Avatar (3rd Incarnation)',
    type: 'bishbar', bgColor: '#0A2A0A', borderColor: '#228B22',
    pipSymbol: '🐗', description: 'The boar who rescued Earth from the cosmic ocean'
  },
  {
    slug: 'narasimha', name: 'Narasimha', nameHindi: 'नरसिंह',
    avatar: 'Man-Lion Avatar (4th Incarnation)',
    type: 'bishbar', bgColor: '#6B0000', borderColor: '#FF4500',
    pipSymbol: '🦁', description: 'The man-lion who slew the demon Hiranyakashipu'
  },
  {
    slug: 'vamana', name: 'Vamana', nameHindi: 'वामन',
    avatar: 'Dwarf Avatar (5th Incarnation)',
    type: 'kambar', bgColor: '#001F3F', borderColor: '#87CEEB',
    pipSymbol: '👣', description: 'The dwarf who crossed the universe in three steps'
  },
  {
    slug: 'parashurama', name: 'Parashurama', nameHindi: 'परशुराम',
    avatar: 'Axe-Warrior Avatar (6th Incarnation)',
    type: 'bishbar', bgColor: '#2A0A0A', borderColor: '#8B0000',
    pipSymbol: '🪓', description: 'The warrior brahmin who rid the world of corrupt kings'
  },
  {
    slug: 'rama', name: 'Rama', nameHindi: 'राम',
    avatar: 'Prince of Ayodhya (7th Incarnation)',
    type: 'kambar', bgColor: '#003333', borderColor: '#20B2AA',
    pipSymbol: '🏹', description: 'The ideal king and upholder of dharma'
  },
  {
    slug: 'krishna', name: 'Krishna', nameHindi: 'कृष्ण',
    avatar: 'Divine Cowherd (8th Incarnation)',
    type: 'bishbar', bgColor: '#001A33', borderColor: '#4169E1',
    pipSymbol: '🪈', description: 'The divine teacher of the Bhagavad Gita'
  },
  {
    slug: 'buddha', name: 'Buddha', nameHindi: 'बुद्ध',
    avatar: 'Enlightened One (9th Incarnation)',
    type: 'kambar', bgColor: '#3D1A00', borderColor: '#FF8C00',
    pipSymbol: '☸️', description: 'The compassionate teacher of non-violence'
  },
  {
    slug: 'kalki', name: 'Kalki', nameHindi: 'कल्कि',
    avatar: 'Future Avatar (10th Incarnation)',
    type: 'bishbar', bgColor: '#1A1A2E', borderColor: '#C0C0C0',
    pipSymbol: '⚔️', description: 'The future warrior who will end the Kali Yuga'
  },
];

// ── RAMAYANA — 8 suits × 12 = 96 cards ───────────────────────
const RAMAYANA_SUITS = [
  {
    slug: 'rama', name: 'Rama', nameHindi: 'राम',
    character: 'Prince of Ayodhya — Hero',
    type: 'bishbar', bgColor: '#004444', borderColor: '#20B2AA',
    pipSymbol: '🏹', description: 'The righteous prince who defeated Ravana'
  },
  {
    slug: 'sita', name: 'Sita', nameHindi: 'सीता',
    character: 'Princess of Mithila — Heroine',
    type: 'kambar', bgColor: '#4A3000', borderColor: '#FFD700',
    pipSymbol: '🌸', description: 'Daughter of Earth, embodiment of purity'
  },
  {
    slug: 'lakshmana', name: 'Lakshmana', nameHindi: 'लक्ष्मण',
    character: 'Rama\'s devoted brother',
    type: 'bishbar', bgColor: '#003300', borderColor: '#32CD32',
    pipSymbol: '🗡️', description: 'The loyal brother who guarded Sita'
  },
  {
    slug: 'hanuman', name: 'Hanuman', nameHindi: 'हनुमान',
    character: 'Divine Vanara General',
    type: 'bishbar', bgColor: '#4A1400', borderColor: '#FF6347',
    pipSymbol: '🔱', description: 'The mighty devotee who leapt across the ocean'
  },
  {
    slug: 'ravana', name: 'Ravana', nameHindi: 'रावण',
    character: 'King of Lanka — Antagonist',
    type: 'kambar', bgColor: '#1A0000', borderColor: '#DC143C',
    pipSymbol: '👑', description: 'The ten-headed demon king, scholar of the Vedas'
  },
  {
    slug: 'kumbhakarna', name: 'Kumbhakarna', nameHindi: 'कुम्भकर्ण',
    character: 'Giant warrior brother of Ravana',
    type: 'kambar', bgColor: '#000A1F', borderColor: '#4169E1',
    pipSymbol: '⚔️', description: 'The sleeping giant who fought for Lanka'
  },
  {
    slug: 'sugriva', name: 'Sugriva', nameHindi: 'सुग्रीव',
    character: 'Vanara King — Rama\'s ally',
    type: 'bishbar', bgColor: '#2A1500', borderColor: '#CD853F',
    pipSymbol: '🌿', description: 'The monkey king who allied with Rama'
  },
  {
    slug: 'vibhishana', name: 'Vibhishana', nameHindi: 'विभीषण',
    character: 'Righteous brother of Ravana',
    type: 'kambar', bgColor: '#1A0033', borderColor: '#9370DB',
    pipSymbol: '🕊️', description: 'The just one who defected to Rama\'s side'
  },
];

// ── GEOPOLITICS — 10 suits × 12 = 120 cards ──────────────────
const GEOPOLITICS_SUITS = [
  {
    slug: 'rafale', name: 'Rafale', label: 'Dassault Rafale',
    nation: 'France', nationCode: 'FR',
    type: 'bishbar', bgColor: '#00206A', borderColor: '#C0C0C0',
    pipSymbol: '✈', description: '4.5-gen multirole fighter | 2.8 Mach | AESA radar'
  },
  {
    slug: 'su57', name: 'Su-57 Felon', label: 'Sukhoi Su-57',
    nation: 'Russia', nationCode: 'RU',
    type: 'bishbar', bgColor: '#8B0000', borderColor: '#FFD700',
    pipSymbol: '🛦', description: '5th-gen stealth fighter | supercruise capable'
  },
  {
    slug: 'f35', name: 'F-35 Lightning', label: 'Lockheed Martin F-35',
    nation: 'USA', nationCode: 'US',
    type: 'bishbar', bgColor: '#1C2951', borderColor: '#C0C0C0',
    pipSymbol: '⚡', description: '5th-gen stealth multirole | 3 variants | 17 nations'
  },
  {
    slug: 'brahmos', name: 'BrahMos', label: 'BrahMos Supersonic Missile',
    nation: 'India / Russia', nationCode: 'IN',
    type: 'bishbar', bgColor: '#FF6600', borderColor: '#138808',
    pipSymbol: '🚀', description: 'World\'s fastest cruise missile | Mach 2.8–3.0'
  },
  {
    slug: 'tejas', name: 'Tejas Mk2', label: 'HAL Tejas',
    nation: 'India', nationCode: 'IN',
    type: 'kambar', bgColor: '#005500', borderColor: '#FF9933',
    pipSymbol: '🛩', description: 'India\'s indigenous 4.5-gen light combat aircraft'
  },
  {
    slug: 's400', name: 'S-400 Triumf', label: 'S-400 / SA-21 Growler',
    nation: 'Russia', nationCode: 'RU',
    type: 'kambar', bgColor: '#1A2A00', borderColor: '#8B8B00',
    pipSymbol: '🎯', description: 'Long-range SAM system | 400km range | NATO nightmare'
  },
  {
    slug: 'b2', name: 'B-2 Spirit', label: 'Northrop Grumman B-2',
    nation: 'USA', nationCode: 'US',
    type: 'bishbar', bgColor: '#0A0A0A', borderColor: '#888888',
    pipSymbol: '💀', description: 'Strategic stealth bomber | flying wing | nuclear capable'
  },
  {
    slug: 'kalibr', name: 'Kalibr', label: '3M-54 Kalibr Cruise Missile',
    nation: 'Russia', nationCode: 'RU',
    type: 'kambar', bgColor: '#001433', borderColor: '#4682B4',
    pipSymbol: '🌊', description: 'Sea-launched cruise missile | 2,500km range | subsonic'
  },
  {
    slug: 'drone', name: 'Kamikaze Drone', label: 'Loitering Munition',
    nation: 'Multi-nation', nationCode: 'XX',
    type: 'kambar', bgColor: '#1A1400', borderColor: '#B8860B',
    pipSymbol: '💥', description: 'AI-guided suicide drone | Shahed, Switchblade, Harop'
  },
  {
    slug: 'carrier', name: 'Aircraft Carrier', label: 'Supercarrier',
    nation: 'Multi-nation', nationCode: 'XX',
    type: 'bishbar', bgColor: '#001A2E', borderColor: '#00CED1',
    pipSymbol: '⚓', description: 'Power projection platform | INS Vikrant / USS Gerald Ford'
  },
];

// ── Theme registry ────────────────────────────────────────────
const THEMES = {
  dashavatara: {
    slug: 'dashavatara',
    name: 'Dashavatara Ganjifa',
    suits: DASHAVATARA_SUITS,
    totalCards: DASHAVATARA_SUITS.length * 12,
  },
  ramayana: {
    slug: 'ramayana',
    name: 'Ramayana Ganjifa',
    suits: RAMAYANA_SUITS,
    totalCards: RAMAYANA_SUITS.length * 12,
  },
  geopolitics: {
    slug: 'geopolitics',
    name: 'Modern Warfare Ganjifa',
    suits: GEOPOLITICS_SUITS,
    totalCards: GEOPOLITICS_SUITS.length * 12,
  },
};

module.exports = {
  THEMES, ALL_RANKS, COURT_RANKS, PIP_RANKS,
  getStrength,
  DASHAVATARA_SUITS, RAMAYANA_SUITS, GEOPOLITICS_SUITS,
};
