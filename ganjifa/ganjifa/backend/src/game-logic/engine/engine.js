/**
 * Ganjifa Trick-Taking Engine
 *
 * Game flow:
 *   1. Deal cards to all players
 *   2. [Optional] Hukm (trump) declaration — first player or host declares a trump suit
 *   3. Each trick:
 *        a. Lead player plays any card → sets led_suit
 *        b. Other players must follow suit if they have one; otherwise play anything
 *        c. Highest card of led_suit wins (hukm beats all if played and no led_suit card is higher)
 *        d. Winner leads next trick
 *   4. After all tricks, score = number of tricks won
 *   5. Repeat for N rounds; cumulative score determines winner
 *
 * Card strength within a trick:
 *   - If a card's suit matches led_suit: use its strength score
 *   - If a card's suit is hukm (trump):  it beats all non-trump led_suit cards
 *   - Otherwise: cannot win the trick
 *
 * Bishbar vs Kambar only affects pip-card ordering WITHIN a suit —
 * not cross-suit comparisons (those are handled by hukm/led-suit logic).
 */

const { dealCards, sortHand } = require('../deck/deckBuilder');
const { getStrength, THEMES } = require('../deck/cardDefinitions');

// ── State factory ────────────────────────────────────────────

/**
 * Create a fresh game session state.
 * @param {string}   themeSlug
 * @param {string[]} playerIds   Ordered array of player UUIDs (or 'AI_x')
 * @param {number}   numRounds
 * @param {boolean}  hukmAllowed
 */
function createGameState(themeSlug, playerIds, numRounds = 3, hukmAllowed = true) {
  const theme = THEMES[themeSlug];
  if (!theme) throw new Error(`Unknown theme: ${themeSlug}`);

  return {
    themeSlug,
    playerIds,
    numRounds,
    hukmAllowed,

    // Round tracking
    currentRound:     1,
    roundScores:      playerIds.reduce((a,p) => ({ ...a, [p]: [] }), {}), // per-round trick counts
    sessionScores:    playerIds.reduce((a,p) => ({ ...a, [p]: 0 }), {}),  // cumulative

    // Current round state
    hands:            {},           // { playerId: Card[] }
    discarded:        [],
    hukm:             null,         // trump suit slug or null
    hukmDeclaredBy:   null,
    hukmPhase:        hukmAllowed,  // true = waiting for hukm declaration before tricks begin

    // Current trick state
    currentTrick:     [],           // [{ playerId, card }] — cards played so far
    trickNumber:      1,
    ledSuit:          null,         // suit of the first card played in this trick
    currentLeader:    playerIds[0], // who leads the current trick
    tricksWon:        playerIds.reduce((a,p) => ({ ...a, [p]: 0 }), {}),

    // Terminal state
    roundWinner:      null,
    gameWinner:       null,
    phase:            'hukm',       // 'hukm' | 'playing' | 'round_end' | 'game_over'
    moveCount:        0,
  };
}

// ── Round setup ──────────────────────────────────────────────

function dealRound(state) {
  const { hands, discarded } = dealCards(state.themeSlug, state.playerIds);
  return {
    ...state,
    hands,
    discarded,
    hukm:           null,
    hukmDeclaredBy: null,
    hukmPhase:      state.hukmAllowed,
    currentTrick:   [],
    trickNumber:    1,
    ledSuit:        null,
    currentLeader:  state.playerIds[0],
    tricksWon:      state.playerIds.reduce((a,p) => ({ ...a, [p]: 0 }), {}),
    roundWinner:    null,
    phase:          state.hukmAllowed ? 'hukm' : 'playing',
  };
}

// ── Hukm (Trump) declaration ─────────────────────────────────

/**
 * Declare a trump suit. Only the first player (leader) can declare.
 * @returns { newState, error }
 */
function declareHukm(state, playerId, suitSlug) {
  if (state.phase !== 'hukm')
    return { error: 'Hukm can only be declared at the start of a round' };
  if (playerId !== state.currentLeader)
    return { error: 'Only the round leader can declare Hukm' };
  if (!THEMES[state.themeSlug].suits.find(s => s.slug === suitSlug))
    return { error: 'Invalid suit for Hukm' };

  return {
    newState: {
      ...state,
      hukm:           suitSlug,
      hukmDeclaredBy: playerId,
      hukmPhase:      false,
      phase:          'playing',
    }
  };
}

/**
 * Skip Hukm — play without a trump suit.
 */
function skipHukm(state, playerId) {
  if (state.phase !== 'hukm')
    return { error: 'Not in hukm phase' };
  if (playerId !== state.currentLeader)
    return { error: 'Only the round leader can skip Hukm' };

  return {
    newState: {
      ...state,
      hukm:      null,
      hukmPhase: false,
      phase:     'playing',
    }
  };
}

// ── Legal plays ──────────────────────────────────────────────

/**
 * Returns the set of card IDs that playerId may legally play.
 * Rule: must follow led_suit if possible.
 */
function getLegalPlays(state, playerId) {
  const hand = state.hands[playerId] || [];
  if (!state.ledSuit) return hand.map(c => c.id); // leading — any card

  const suitCards = hand.filter(c => c.suit === state.ledSuit);
  return suitCards.length > 0
    ? suitCards.map(c => c.id)
    : hand.map(c => c.id); // no matching suit — play anything
}

// ── Play a card ──────────────────────────────────────────────

/**
 * Apply a card play to the state.
 * @param {string} playerId
 * @param {string} cardId
 * @returns { newState, error, trickComplete, trickWinner }
 */
function playCard(state, playerId, cardId) {
  if (state.phase !== 'playing')
    return { error: 'Game is not in playing phase' };

  // Validate it's this player's turn
  const expectedPlayer = getNextToPlay(state);
  if (playerId !== expectedPlayer)
    return { error: 'Not your turn' };

  // Validate player has the card
  const hand = state.hands[playerId] || [];
  const card = hand.find(c => c.id === cardId);
  if (!card) return { error: 'Card not in hand' };

  // Validate legal play
  const legal = getLegalPlays(state, playerId);
  if (!legal.includes(cardId))
    return { error: 'Must follow the led suit' };

  // Remove card from hand
  const newHands = {
    ...state.hands,
    [playerId]: hand.filter(c => c.id !== cardId),
  };

  // Set led suit if this is the first card
  const ledSuit = state.ledSuit || card.suit;

  const newTrick = [...state.currentTrick, { playerId, card }];

  let newState = {
    ...state,
    hands:         newHands,
    currentTrick:  newTrick,
    ledSuit,
    moveCount:     state.moveCount + 1,
  };

  // If all players have played → resolve trick
  if (newTrick.length === state.playerIds.length) {
    return resolveTrick(newState);
  }

  return { newState, trickComplete: false };
}

// ── Trick resolution ─────────────────────────────────────────

/**
 * Determine the winner of the current completed trick.
 * Winner = highest card of led_suit, OR highest hukm card if any were played.
 */
function resolveTrick(state) {
  const { currentTrick, ledSuit, hukm, playerIds } = state;

  // Separate trump plays from led-suit plays
  const hukmPlays  = hukm ? currentTrick.filter(p => p.card.suit === hukm && p.card.suit !== ledSuit) : [];
  const ledPlays   = currentTrick.filter(p => p.card.suit === ledSuit);
  const decidingPlays = hukmPlays.length > 0 ? hukmPlays : ledPlays;

  // Highest strength among deciding plays wins
  const winner = decidingPlays.reduce((best, play) =>
    play.card.strength > best.card.strength ? play : best
  );
  const winnerId = winner.playerId;

  // Update tricks won
  const newTricksWon = { ...state.tricksWon, [winnerId]: state.tricksWon[winnerId] + 1 };

  // Check if the round is over (all hands empty)
  const allHandsEmpty = playerIds.every(pid => (state.hands[pid] || []).length === 0);

  if (allHandsEmpty) {
    return finishRound({ ...state, tricksWon: newTricksWon }, winnerId);
  }

  // Continue — winner leads next trick
  const newState = {
    ...state,
    currentTrick:   [],
    ledSuit:        null,
    currentLeader:  winnerId,
    tricksWon:      newTricksWon,
    trickNumber:    state.trickNumber + 1,
  };

  return { newState, trickComplete: true, trickWinner: winnerId };
}

// ── Round & game completion ───────────────────────────────────

function finishRound(state, lastTrickWinner) {
  const { currentRound, numRounds, playerIds, tricksWon, sessionScores, roundScores } = state;

  // Who won this round? → most tricks
  const maxTricks = Math.max(...playerIds.map(pid => tricksWon[pid]));
  const roundWinners = playerIds.filter(pid => tricksWon[pid] === maxTricks);
  const roundWinner = roundWinners.length === 1 ? roundWinners[0] : null; // null = tie

  // Update cumulative scores
  const newSessionScores = { ...sessionScores };
  if (roundWinner) newSessionScores[roundWinner] += 1;

  // Update round history
  const newRoundScores = { ...roundScores };
  playerIds.forEach(pid => {
    newRoundScores[pid] = [...(newRoundScores[pid] || []), tricksWon[pid]];
  });

  // Game over?
  if (currentRound >= numRounds) {
    const maxSession = Math.max(...Object.values(newSessionScores));
    const gameWinners = playerIds.filter(pid => newSessionScores[pid] === maxSession);
    const gameWinner = gameWinners.length === 1 ? gameWinners[0] : null;

    return {
      newState: {
        ...state,
        sessionScores: newSessionScores,
        roundScores:   newRoundScores,
        roundWinner,
        gameWinner,
        phase: 'game_over',
        currentTrick: [],
        ledSuit: null,
      },
      trickComplete: true,
      trickWinner: lastTrickWinner,
      roundComplete: true,
      roundWinner,
      gameOver: true,
      gameWinner,
    };
  }

  // Start next round
  const nextRoundBase = {
    ...state,
    currentRound:   currentRound + 1,
    sessionScores:  newSessionScores,
    roundScores:    newRoundScores,
    roundWinner,
    phase:          'round_end',
    currentTrick:   [],
    ledSuit:        null,
  };

  return {
    newState: nextRoundBase,
    trickComplete: true,
    trickWinner: lastTrickWinner,
    roundComplete: true,
    roundWinner,
    gameOver: false,
  };
}

// ── Start next round ──────────────────────────────────────────
function startNextRound(state) {
  if (state.phase !== 'round_end') return { error: 'Not in round_end phase' };
  const incremented = { ...state, currentRound: state.currentRound + 1 };
  return { newState: dealRound(incremented) };
}

// ── Utilities ─────────────────────────────────────────────────

/**
 * Who plays next in the current trick?
 */
function getNextToPlay(state) {
  const alreadyPlayed = new Set(state.currentTrick.map(p => p.playerId));
  const order = getPlayOrder(state.currentLeader, state.playerIds);
  return order.find(pid => !alreadyPlayed.has(pid)) || null;
}

/**
 * Returns playerIds in play order starting from leaderId.
 */
function getPlayOrder(leaderId, playerIds) {
  const idx = playerIds.indexOf(leaderId);
  return [...playerIds.slice(idx), ...playerIds.slice(0, idx)];
}

/**
 * Serialise state for DB storage (removes hand details for security).
 */
function serialiseForDB(state) {
  const { hands, ...rest } = state;
  return {
    ...rest,
    handSizes: Object.fromEntries(
      Object.entries(hands).map(([pid, h]) => [pid, h.length])
    ),
  };
}

/**
 * Serialise hand for a specific player (only their own cards).
 */
function serialiseForPlayer(state, playerId) {
  return {
    ...serialiseForDB(state),
    myHand:     state.hands[playerId] || [],
    legalPlays: getLegalPlays(state, playerId),
    nextToPlay: getNextToPlay(state),
  };
}

module.exports = {
  createGameState, dealRound,
  declareHukm, skipHukm,
  playCard, getLegalPlays,
  startNextRound, getNextToPlay, getPlayOrder,
  serialiseForDB, serialiseForPlayer,
};
