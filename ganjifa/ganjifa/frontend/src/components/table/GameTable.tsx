'use client';
import { motion } from 'framer-motion';
import PlayerZone from './PlayerZone';
import TrickArea from './TrickArea';
import CardHand from '../cards/CardHand';
import CardDeck from '../cards/CardDeck';
import { ScoreStrip } from '../game/GameModals';
import type { GameState, GanjifaCard } from '@/types';

// Positions for each opponent slot based on total player count
const OPPONENT_POSITIONS: Record<number, ('top'|'top-left'|'top-right'|'left'|'right')[]> = {
  2: ['top'],
  3: ['top-left', 'top-right'],
  4: ['top', 'left', 'right'],
  5: ['top-left', 'top', 'top-right', 'left'],
  6: ['top-left', 'top', 'top-right', 'left', 'right'],
};

interface Props {
  state:       GameState;
  myId:        string;
  usernames:   Record<string, string>;
  theme:       string;
  onPlay:      (cardId: string) => void;
  isDealing?:  boolean;
}

export default function GameTable({ state, myId, usernames, theme, onPlay, isDealing }: Props) {
  const { playerIds, currentTrick, tricksWon, sessionScores, nextToPlay,
          currentLeader, handSizes, myHand = [], legalPlays = [] } = state;

  // Separate my ID from opponents
  const opponents = playerIds.filter(pid => pid !== myId);
  const positions = OPPONENT_POSITIONS[playerIds.length] || OPPONENT_POSITIONS[2];
  const isMyTurn  = nextToPlay === myId && state.phase === 'playing';

  // Enrich trick with usernames
  const enrichedTrick = currentTrick.map(p => ({
    ...p,
    username: p.playerId.startsWith('AI_') ? 'AI' : (usernames[p.playerId] || p.playerId.slice(0,6)),
  }));

  const totalCards = theme === 'ramayana' ? 96 : 120;
  const cardsPerPlayer = Math.floor(totalCards / playerIds.length);

  return (
    <div className="card-table w-full max-w-4xl mx-auto"
         style={{ minHeight: 560, position: 'relative', padding: '24px' }}>

      {/* ── Felt texture overlay ── */}
      <div className="absolute inset-0 rounded-3xl opacity-10 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.05) 0%, transparent 60%)' }}/>

      {/* ── Opponents (top arc) ── */}
      <div className="absolute top-4 left-0 right-0 flex items-start justify-around px-8 gap-4">
        {opponents.map((pid, i) => {
          const isAi   = pid.startsWith('AI_');
          const name   = isAi ? `AI ${pid.replace('AI_','')}`
                              : (usernames[pid] || pid.slice(0,8));
          return (
            <PlayerZone
              key={pid}
              playerId={pid}
              username={name}
              cardCount={handSizes?.[pid] ?? cardsPerPlayer}
              tricksWon={tricksWon[pid] || 0}
              sessionScore={sessionScores[pid] || 0}
              isActive={nextToPlay === pid}
              isLeader={currentLeader === pid}
              isAi={isAi}
              theme={theme}
              position={positions[i] || 'top'}
              isDealing={isDealing}
            />
          );
        })}
      </div>

      {/* ── Centre trick area ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        <TrickArea
          trick={enrichedTrick}
          playerCount={playerIds.length}
          trickWinner={null}
          sweeping={false}
        />
      </div>

      {/* ── Deck (top-right corner) ── */}
      <div className="absolute top-4 right-4">
        <CardDeck
          totalCards={totalCards}
          theme={theme}
          size={56}
          isDealing={isDealing}
        />
      </div>

      {/* ── My hand (bottom) ── */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
        {/* Turn indicator */}
        <motion.div
          animate={isMyTurn ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={{ repeat: isMyTurn ? Infinity : 0, duration: 1.8 }}
          className={`text-xs font-mughal tracking-widest px-4 py-1 rounded-full border transition-all ${
            isMyTurn
              ? 'border-gold/50 text-gold bg-gold/10'
              : 'border-transparent text-ivory/20'
          }`}
        >
          {isMyTurn
            ? state.ledSuit
              ? `✦ FOLLOW ${state.ledSuit.toUpperCase()} IF POSSIBLE ✦`
              : '✦ LEAD ANY CARD ✦'
            : nextToPlay?.startsWith('AI_')
              ? 'AI thinking…'
              : `${usernames[nextToPlay || ''] || 'Opponent'}'s turn`
          }
        </motion.div>

        <CardHand
          cards={myHand as GanjifaCard[]}
          legalPlays={legalPlays}
          isMyTurn={isMyTurn}
          onPlay={onPlay}
          cardSize={96}
          isDealing={isDealing}
          label={`Your hand · ${myHand.length} cards`}
        />
      </div>
    </div>
  );
}
