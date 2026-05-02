'use client';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import CardBack from '../cards/CardBack';

interface Props {
  playerId:    string;
  username:    string;
  cardCount:   number;
  tricksWon:   number;
  sessionScore: number;
  isActive:    boolean;   // it's this player's turn
  isLeader:    boolean;   // current trick leader
  isAi?:       boolean;
  theme:       string;
  position:    'top' | 'left' | 'right' | 'top-left' | 'top-right';
  isDealing?:  boolean;
}

// Fan angles per position
const FAN_ANGLES: Record<Props['position'], number> = {
  top:       180,
  left:      90,
  right:     -90,
  'top-left': 135,
  'top-right': -135,
};

export default function PlayerZone({
  playerId, username, cardCount, tricksWon, sessionScore,
  isActive, isLeader, isAi, theme, position, isDealing,
}: Props) {
  const isVertical   = position === 'left' || position === 'right';
  const cardSize     = 52;
  const maxVisible   = Math.min(cardCount, 8);
  const spread       = Math.min(18, 140 / Math.max(maxVisible, 1));
  const baseTilt     = FAN_ANGLES[position];

  return (
    <div className={clsx(
      'flex flex-col items-center gap-1.5',
      isVertical && 'flex-row',
    )}>
      {/* Name plate */}
      <motion.div
        animate={isActive ? { scale: 1.05 } : { scale: 1 }}
        className={clsx(
          'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all',
          'border backdrop-blur-sm',
          isActive
            ? 'border-gold bg-gold/15 text-gold seat-active'
            : 'border-white/10 bg-black/30 text-ivory/50',
        )}
      >
        <span className="flex items-center gap-1">
          {isAi && <span className="text-[10px] text-gold/50">AI</span>}
          {isLeader && <span className="text-gold">♔</span>}
          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse inline-block"/>}
          <span className="max-w-[70px] truncate">{username}</span>
        </span>
        <span className="text-[10px] text-ivory/30 block mt-0.5">
          {tricksWon}T · {sessionScore}pt
        </span>
      </motion.div>

      {/* Face-down hand fan */}
      <div className="relative" style={{
        width:  isVertical ? 60  : Math.min(maxVisible * spread + cardSize, 180),
        height: isVertical ? Math.min(maxVisible * spread + cardSize, 180) : 60,
      }}>
        {Array.from({ length: maxVisible }, (_, i) => {
          const center = (maxVisible - 1) / 2;
          const offset = i - center;
          const rotate = baseTilt + offset * (isVertical ? 5 : 6);
          const tx     = isVertical ? 0 : offset * spread;
          const ty     = isVertical ? offset * spread : 0;

          return (
            <motion.div key={i}
              className="absolute"
              style={{
                left:   isVertical ? 0 : '50%',
                top:    isVertical ? '50%' : 0,
                transform: `translate(${tx - (isVertical ? 0 : cardSize/2)}px, ${ty - (isVertical ? cardSize/2 : 0)}px) rotate(${rotate}deg)`,
                transformOrigin: isVertical ? 'center right' : 'bottom center',
                zIndex: i,
              }}
              initial={isDealing ? { opacity: 0, scale: 0.3 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 + 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <CardBack size={cardSize} theme={theme} />
            </motion.div>
          );
        })}

        {/* Card count badge */}
        {cardCount > maxVisible && (
          <div className="absolute bottom-0 right-0 text-[9px] text-gold/40 font-mono">
            +{cardCount - maxVisible}
          </div>
        )}
      </div>
    </div>
  );
}
