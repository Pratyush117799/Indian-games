/**
 * Ganjifa Deck Builder
 * Creates, shuffles, and deals a full deck for any theme.
 */

const { THEMES, ALL_RANKS, getStrength } = require('./cardDefinitions');

/**
 * Build a complete deck for a given theme.
 * Returns array of card objects sorted suit→rank.
 */
function buildDeck(themeSlug) {
  const theme = THEMES[themeSlug];
  if (!theme) throw new Error(`Unknown theme: ${themeSlug}`);

  const deck = [];
  for (const suit of theme.suits) {
    for (const rank of ALL_RANKS) {
      deck.push({
        id:        `${suit.slug}-${rank}`,
        suit:      suit.slug,
        rank,
        type:      suit.type,                         // 'bishbar' | 'kambar'
        strength:  getStrength(rank, suit.type === 'bishbar'),
        isCourt:   rank === 'raja' || rank === 'mantri',
        imageUrl:  `/cards/${themeSlug}/${suit.slug}/${rank}.png`,
        // Metadata for UI display
        suitName:  suit.name,
        bgColor:   suit.bgColor,
        borderColor: suit.borderColor,
        pipSymbol: suit.pipSymbol || suit.pipSymbol,
      });
    }
  }
  return deck;
}

/**
 * Fisher-Yates shuffle.
 */
function shuffle(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

/**
 * Deal cards to players as evenly as possible.
 * With 120 cards and 3 players → 40 each.
 * With 120 cards and 4 players → 30 each.
 * With 96 cards and 6 players  → 16 each.
 * Remainders are discarded (placed face-down — traditional).
 *
 * @param {string}   themeSlug
 * @param {string[]} playerIds
 * @returns {{ hands: Object, discarded: Array }}
 */
function dealCards(themeSlug, playerIds) {
  const deck    = shuffle(buildDeck(themeSlug));
  const n       = playerIds.length;
  const perHand = Math.floor(deck.length / n);

  const hands = {};
  playerIds.forEach((pid, i) => {
    hands[pid] = deck.slice(i * perHand, (i + 1) * perHand);
  });

  const discarded = deck.slice(n * perHand);
  return { hands, discarded };
}

/**
 * Get sorted display order of a hand (suits grouped, rank within suit).
 */
function sortHand(cards) {
  return [...cards].sort((a, b) => {
    if (a.suit !== b.suit) return a.suit.localeCompare(b.suit);
    return b.strength - a.strength; // highest strength first
  });
}

/**
 * Build the card image URL pattern for a theme.
 * Used to pre-load images in the frontend.
 */
function getAllImageUrls(themeSlug) {
  return buildDeck(themeSlug).map(c => c.imageUrl);
}

module.exports = { buildDeck, shuffle, dealCards, sortHand, getAllImageUrls };
