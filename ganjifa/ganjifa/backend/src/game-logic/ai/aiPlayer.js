/**
 * Ganjifa AI Player — Greedy Trick-Taking Strategy
 *
 * Difficulty levels:
 *   easy:   random legal play (30% chance), else lowest card
 *   medium: follows basic trick-taking heuristics
 *   hard:   tracks played cards, wins tricks strategically, saves high cards
 */

const { getLegalPlays, getNextToPlay } = require('../engine/engine');

// ── Memory tracker ────────────────────────────────────────────
function createMemory(themeSlug, playerIds) {
  return {
    playedCards: new Set(),   // card IDs already played
    trickHistory: [],         // past tricks for card counting
  };
}

function updateMemory(memory, trick) {
  trick.forEach(({ card }) => memory.playedCards.add(card.id));
  memory.trickHistory.push(trick);
  return memory;
}

// ── Main AI entry ─────────────────────────────────────────────

/**
 * Get the AI's chosen card.
 * @param {object}  state       Current game state
 * @param {string}  aiPlayerId  The AI's player ID
 * @param {string}  difficulty  'easy' | 'medium' | 'hard'
 * @param {object}  memory      Card tracking memory
 * @returns {string} cardId to play
 */
function getAiMove(state, aiPlayerId, difficulty = 'medium', memory = null) {
  const legalIds = getLegalPlays(state, aiPlayerId);
  if (!legalIds.length) return null;

  const hand   = state.hands[aiPlayerId] || [];
  const legal  = hand.filter(c => legalIds.includes(c.id));

  if (legal.length === 0) return null;
  if (legal.length === 1) return legal[0].id;

  // Easy: 40% random
  if (difficulty === 'easy' && Math.random() < 0.4) {
    return legal[Math.floor(Math.random() * legal.length)].id;
  }

  const isLeading = state.currentTrick.length === 0;

  if (isLeading) {
    return chooseLeadCard(legal, state, difficulty);
  } else {
    return chooseFollowCard(legal, state, difficulty, memory);
  }
}

// ── Leading strategy ──────────────────────────────────────────
function chooseLeadCard(legal, state, difficulty) {
  // Hard: lead with highest court card if available
  if (difficulty === 'hard') {
    const raja   = legal.find(c => c.rank === 'raja');
    if (raja) return raja.id;
    const mantri = legal.find(c => c.rank === 'mantri');
    if (mantri) return mantri.id;
  }

  // Medium/Hard: lead highest card in a strong (bishbar) suit
  const bishbarCards = legal.filter(c => c.type === 'bishbar');
  if (bishbarCards.length > 0) {
    const top = bishbarCards.reduce((best, c) => c.strength > best.strength ? c : best);
    return top.id;
  }

  // Fallback: highest overall
  return legal.reduce((best, c) => c.strength > best.strength ? c : best).id;
}

// ── Following strategy ────────────────────────────────────────
function chooseFollowCard(legal, state, difficulty, memory) {
  const { currentTrick, ledSuit, hukm } = state;
  const currentWinner = getCurrentTrickWinner(currentTrick, ledSuit, hukm);

  // Cards that can win this trick
  const canWin = legal.filter(c => canBeatCurrentWinner(c, currentWinner, ledSuit, hukm));

  // Easy: just play lowest legal
  if (difficulty === 'easy') {
    return legal.reduce((low, c) => c.strength < low.strength ? c : low).id;
  }

  // Medium/Hard: try to win if possible
  if (canWin.length > 0) {
    // Win with the LOWEST winning card (save high cards)
    const cheapWin = canWin.reduce((low, c) => c.strength < low.strength ? c : low);

    // Hard: only win if worth it (not last trick — save for when it matters more)
    if (difficulty === 'hard') {
      const tricksLeft = Math.max(...Object.values(state.hands).map(h => h.length));
      if (tricksLeft > 3) return cheapWin.id; // play to win early
      // Late game: win only with court cards
      if (cheapWin.isCourt) return cheapWin.id;
    } else {
      return cheapWin.id;
    }
  }

  // Cannot win — dump lowest card
  const nonSuitCards = legal.filter(c => c.suit !== ledSuit && c.suit !== hukm);
  if (nonSuitCards.length > 0) {
    return nonSuitCards.reduce((low, c) => c.strength < low.strength ? c : low).id;
  }
  return legal.reduce((low, c) => c.strength < low.strength ? c : low).id;
}

// ── Trick winner calculation ──────────────────────────────────
function getCurrentTrickWinner(trick, ledSuit, hukm) {
  if (trick.length === 0) return null;

  const hukmPlays = hukm ? trick.filter(p => p.card.suit === hukm && p.card.suit !== ledSuit) : [];
  const ledPlays  = trick.filter(p => p.card.suit === ledSuit);
  const deciding  = hukmPlays.length > 0 ? hukmPlays : ledPlays;

  if (deciding.length === 0) return null;
  return deciding.reduce((best, p) => p.card.strength > best.card.strength ? p : best);
}

function canBeatCurrentWinner(card, currentWinner, ledSuit, hukm) {
  if (!currentWinner) return true; // first card always "wins" so far

  const isHukm    = hukm && card.suit === hukm;
  const isLedSuit = card.suit === ledSuit;
  const winnerIsHukm = hukm && currentWinner.card.suit === hukm;

  if (isHukm && !winnerIsHukm) return true;     // trump beats non-trump
  if (!isHukm && winnerIsHukm) return false;     // non-trump loses to trump
  if (!isLedSuit && !isHukm)   return false;     // off-suit, off-trump can't win
  return card.strength > currentWinner.card.strength;
}

// ── Hukm (trump) selection ────────────────────────────────────
/**
 * AI chooses a trump suit — picks the suit with the most court cards.
 */
function chooseHukm(state, aiPlayerId) {
  const hand = state.hands[aiPlayerId] || [];
  const suitCount = {};

  hand.forEach(c => {
    if (!suitCount[c.suit]) suitCount[c.suit] = { courts: 0, total: 0 };
    suitCount[c.suit].total++;
    if (c.isCourt) suitCount[c.suit].courts++;
  });

  // Pick suit with most court cards, then most cards
  const best = Object.entries(suitCount).reduce((best, [suit, counts]) => {
    if (!best) return { suit, ...counts };
    if (counts.courts > best.courts) return { suit, ...counts };
    if (counts.courts === best.courts && counts.total > best.total) return { suit, ...counts };
    return best;
  }, null);

  return best?.suit || null;
}

module.exports = { getAiMove, chooseHukm, createMemory, updateMemory };
