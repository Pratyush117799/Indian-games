'use client';
import { motion, AnimatePresence } from 'framer-motion';
import CardFace from '../cards/CardFace';
import type { GanjifaCard } from '@/types';

interface PlayedCard { playerId: string; card: GanjifaCard; username?: string; }

interface Props {
  trick:        PlayedCard[];
  playerCount:  number;
  trickWinner?: string | null;
  sweeping?:    boolean;
}

// Positions for up to 6 players around the table
const POSITIONS: { x: number; y: number; rotate: number }[] = [
  { x:   0, y:  60, rotate:   0 },   // bottom (me)
  { x: -90, y:  20, rotate:  15 },   // bottom-left
  { x:-110, y: -40, rotate:  30 },   // left
  { x:   0, y: -70, rotate: 180 },   // top
  { x: 110, y: -40, rotate: -30 },   // right
  { x:  90, y:  20, rotate: -15 },   // bottom-right
];

export default function TrickArea({ trick, playerCount, trickWinner, sweeping }: Props) {
  return (
    <div className="trick-area relative flex items-center justify-center"
         style={{ width: 320, height: 240 }}>

      {/* Centre glow circle */}
      <div className="absolute w-32 h-32 rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(218,165,32,0.1) 0%, transparent 70%)' }}/>

      {/* Suit lead indicator line */}
      {trick.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 left-1/2 -translate-x-1/2
                     text-xs text-gold/60 font-mughal tracking-widest uppercase whitespace-nowrap"
        >
          Led: {trick[0].card.suitName}
        </motion.div>
      )}

      {/* Played cards */}
      <AnimatePresence>
        {trick.map(({ playerId, card, username }, i) => {
          const pos = POSITIONS[i % POSITIONS.length];
          return (
            <motion.div
              key={`${playerId}-${card.id}`}
              initial={{ scale: 0.3, opacity: 0, rotate: pos.rotate - 90 }}
              animate={sweeping
                ? { scale: 0.1, opacity: 0, x: 0, y: 0 }
                : { scale: 1, opacity: 1, x: pos.x, y: pos.y, rotate: pos.rotate }
              }
              exit={{ scale: 0.1, opacity: 0, transition: { duration: 0.4 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.08 }}
              className="absolute"
              style={{ zIndex: i + 1 }}
            >
              <CardFace
                card={card}
                size={88}
                isLegal={false}
                disabled={true}
                showTooltip={true}
              />
              {/* Player label under card */}
              {username && (
                <p className="text-center text-xs text-ivory/50 mt-1 max-w-[90px] truncate">
                  {username}
                </p>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Winner flash */}
      <AnimatePresence>
        {trickWinner && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       bg-gold text-felt-dark font-mughal font-bold text-sm
                       px-4 py-2 rounded-full shadow-hukm z-50 whitespace-nowrap"
          >
            ✦ Trick Won!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {trick.length === 0 && (
        <p className="text-ivory/20 text-sm font-mughal tracking-wider">Waiting for lead card…</p>
      )}
    </div>
  );
}
