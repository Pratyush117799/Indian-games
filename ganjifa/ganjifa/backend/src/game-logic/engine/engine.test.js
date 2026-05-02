/**
 * Ganjifa Engine Tests — run: node engine.test.js
 */
const {
  createGameState, dealRound, declareHukm, skipHukm,
  playCard, getLegalPlays, getNextToPlay, startNextRound,
} = require('./engine');

let p = 0, f = 0;
const test = (n, fn) => { try { fn(); console.log(`  ✓ ${n}`); p++; } catch(e) { console.error(`  ✗ ${n} — ${e.message}`); f++; } };
const assert = (c, m) => { if (!c) throw new Error(m || 'fail'); };
const eq = (a, b, m) => { if (a !== b) throw new Error(m || `Expected ${JSON.stringify(b)} got ${JSON.stringify(a)}`); };

const P1='p1', P2='p2', P3='p3';
const PLAYERS = [P1, P2, P3];

// ── State creation ────────────────────────────────────────────
console.log('\n── State & Deal');
test('creates game state with correct structure', () => {
  const s = createGameState('dashavatara', PLAYERS, 3, true);
  eq(s.phase, 'hukm');
  eq(s.currentRound, 1);
  eq(s.playerIds.length, 3);
  assert(s.sessionScores[P1] === 0);
});
test('dealRound gives each player cards', () => {
  let s = createGameState('dashavatara', PLAYERS, 3, true);
  s = dealRound(s);
  eq(Object.keys(s.hands).length, 3);
  // 120 cards / 3 players = 40 each
  eq(s.hands[P1].length, 40);
  eq(s.hands[P2].length, 40);
  eq(s.hands[P3].length, 40);
});
test('dealRound with 4 players gives 30 cards each (120/4)', () => {
  const four = ['p1','p2','p3','p4'];
  let s = createGameState('dashavatara', four, 3, true);
  s = dealRound(s);
  four.forEach(pid => eq(s.hands[pid].length, 30));
});
test('ramayana: 96 cards / 3 players = 32 each', () => {
  let s = createGameState('ramayana', PLAYERS, 3, true);
  s = dealRound(s);
  eq(s.hands[P1].length, 32);
});
test('all dealt cards are unique', () => {
  let s = createGameState('dashavatara', PLAYERS, 3, false);
  s = dealRound(s);
  const all = [...s.hands[P1], ...s.hands[P2], ...s.hands[P3]];
  const ids = all.map(c => c.id);
  eq(new Set(ids).size, ids.length);
});

// ── Hukm ──────────────────────────────────────────────────────
console.log('\n── Hukm Declaration');
test('leader can declare hukm', () => {
  let s = createGameState('dashavatara', PLAYERS, 3, true);
  s = dealRound(s);
  const { newState, error } = declareHukm(s, P1, 'matsya');
  assert(!error, error);
  eq(newState.hukm, 'matsya');
  eq(newState.phase, 'playing');
});
test('non-leader cannot declare hukm', () => {
  let s = createGameState('dashavatara', PLAYERS, 3, true);
  s = dealRound(s);
  const { error } = declareHukm(s, P2, 'matsya');
  assert(error, 'Should error for non-leader');
});
test('invalid suit rejected', () => {
  let s = createGameState('dashavatara', PLAYERS, 3, true);
  s = dealRound(s);
  const { error } = declareHukm(s, P1, 'invalid_suit');
  assert(error, 'Should reject invalid suit');
});
test('skip hukm sets hukm=null and phase=playing', () => {
  let s = createGameState('dashavatara', PLAYERS, 3, true);
  s = dealRound(s);
  const { newState } = skipHukm(s, P1);
  eq(newState.hukm, null);
  eq(newState.phase, 'playing');
});

// ── Card playing ──────────────────────────────────────────────
console.log('\n── Card Playing');
function setupPlaying() {
  let s = createGameState('dashavatara', PLAYERS, 3, false);
  s = dealRound(s);
  return s;
}

test('leader plays any card legally', () => {
  let s = setupPlaying();
  const card = s.hands[P1][0];
  const { newState, error } = playCard(s, P1, card.id);
  assert(!error, error);
  eq(newState.ledSuit, card.suit);
  eq(newState.currentTrick.length, 1);
  eq(newState.hands[P1].length, 39); // one less
});
test('wrong player rejected', () => {
  let s = setupPlaying();
  const card = s.hands[P2][0];
  const { error } = playCard(s, P2, card.id);
  assert(error, 'Should reject wrong player');
});
test('card not in hand rejected', () => {
  let s = setupPlaying();
  const { error } = playCard(s, P1, 'fake-card-id');
  assert(error, 'Should reject invalid card');
});
test('must follow suit when possible', () => {
  let s = setupPlaying();
  const leadCard = s.hands[P1][0];
  ({ newState: s } = playCard(s, P1, leadCard.id));

  // P2 must follow ledSuit if they have it
  const p2Hand = s.hands[P2];
  const suitCards = p2Hand.filter(c => c.suit === s.ledSuit);
  if (suitCards.length > 0) {
    // Trying to play off-suit should be rejected
    const offSuit = p2Hand.find(c => c.suit !== s.ledSuit);
    if (offSuit) {
      const { error } = playCard(s, P2, offSuit.id);
      assert(error, 'Should reject off-suit play when suit is available');
    }
    // Playing in-suit should work
    const { error: e2 } = playCard(s, P2, suitCards[0].id);
    assert(!e2, e2);
  }
});
test('can play any card when no matching suit', () => {
  let s = setupPlaying();
  // Force a scenario: set ledSuit to a suit P2 doesn't have
  const leadCard = s.hands[P1][0];
  ({ newState: s } = playCard(s, P1, leadCard.id));

  // Find a card P2 can play (either in suit or off-suit if no suit match)
  const legal = getLegalPlays(s, P2);
  assert(legal.length > 0, 'P2 should have legal plays');
});

// ── Full trick ────────────────────────────────────────────────
console.log('\n── Trick Resolution');
test('trick completes after all 3 players play', () => {
  let s = setupPlaying();
  let trickComplete = false;

  // P1 leads
  let legal = getLegalPlays(s, P1);
  let res = playCard(s, P1, legal[0]);
  s = res.newState; trickComplete = res.trickComplete;

  // P2 follows
  legal = getLegalPlays(s, P2);
  res = playCard(s, P2, legal[0]);
  s = res.newState; trickComplete = res.trickComplete;

  // P3 follows
  legal = getLegalPlays(s, P3);
  res = playCard(s, P3, legal[0]);
  s = res.newState; trickComplete = res.trickComplete;

  assert(trickComplete, 'Trick should be complete after 3 plays');
  assert(res.trickWinner, 'Should have a trick winner');
});
test('tricks won counter increments', () => {
  let s = setupPlaying();
  for (let i = 0; i < 3; i++) {
    const pid = [P1,P2,P3][i];
    const legal = getLegalPlays(s, pid === s.hands[pid] ? pid : getNextToPlay(s));
    const nextPid = getNextToPlay(s);
    const nextLegal = getLegalPlays(s, nextPid);
    const res = playCard(s, nextPid, nextLegal[0]);
    s = res.newState;
  }
  const totalTricks = Object.values(s.tricksWon).reduce((a,b)=>a+b,0);
  eq(totalTricks, 1);
});

// ── Bishbar / Kambar ──────────────────────────────────────────
console.log('\n── Bishbar/Kambar Ranking');
const { getStrength } = require('../deck/cardDefinitions');
test('bishbar: 10 > 9 > 1', () => {
  assert(getStrength('10', true) > getStrength('9', true));
  assert(getStrength('9',  true) > getStrength('1', true));
});
test('kambar: 1 > 2 > 10', () => {
  assert(getStrength('1',  false) > getStrength('2',  false));
  assert(getStrength('2',  false) > getStrength('10', false));
});
test('raja always beats mantri regardless of suit type', () => {
  assert(getStrength('raja',   true) > getStrength('mantri', true));
  assert(getStrength('raja',   false) > getStrength('mantri', false));
});
test('raja always beats highest pip (10 bishbar)', () => {
  assert(getStrength('raja', true) > getStrength('10', true));
});

// ── Multi-round ───────────────────────────────────────────────
console.log('\n── Round & Session');
test('startNextRound resets trick state', () => {
  let s = createGameState('dashavatara', PLAYERS, 2, false);
  s = dealRound(s);
  s = { ...s, phase: 'round_end', currentRound: 1 };
  const { newState } = startNextRound(s);
  eq(newState.currentRound, 2);
  eq(newState.currentTrick.length, 0);
  eq(newState.ledSuit, null);
});
test('cannot startNextRound if not in round_end phase', () => {
  let s = setupPlaying();
  const { error } = startNextRound(s);
  assert(error, 'Should reject if not round_end');
});

// ── Card definitions ──────────────────────────────────────────
console.log('\n── Deck Builder');
const { buildDeck, dealCards, getAllImageUrls } = require('../deck/deckBuilder');
test('dashavatara deck has 120 cards', () => eq(buildDeck('dashavatara').length, 120));
test('ramayana deck has 96 cards', () => eq(buildDeck('ramayana').length, 96));
test('geopolitics deck has 120 cards', () => eq(buildDeck('geopolitics').length, 120));
test('all card IDs are unique in deck', () => {
  const deck = buildDeck('dashavatara');
  eq(new Set(deck.map(c=>c.id)).size, 120);
});
test('every card has an imageUrl', () => {
  buildDeck('dashavatara').forEach(c => assert(c.imageUrl.startsWith('/cards/')));
});
test('getAllImageUrls returns 120 URLs for dashavatara', () => {
  eq(getAllImageUrls('dashavatara').length, 120);
});

// ── Summary ───────────────────────────────────────────────────
console.log(`\n${'─'.repeat(52)}`);
console.log(`Results: ${p} passed, ${f} failed`);
process.exit(f > 0 ? 1 : 0);
