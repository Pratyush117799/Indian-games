'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardFace from './CardFace';
import type { GanjifaCard } from '@/types';

interface Props {
  cards:       GanjifaCard[];
  legalPlays?: string[];          // card IDs the player can play
  isMyTurn?:   boolean;
  onPlay?:     (cardId: string) => void;
  isDealing?:  boolean;
  cardSize?:   number;
  maxVisible?: number;
  label?:      string;
}

export default function CardHand({
  cards, legalPlays = [], isMyTurn, onPlay, isDealing,
  cardSize = 110, maxVisible = 20, label,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const visible = cards.slice(0, maxVisible);
  const count   = visible.length;
  const spread  = Math.min(38, 680 / Math.max(count, 1));
  const maxTilt = Math.min(25, count * 2.5);

  // Fan geometry: evenly distribute rotation and horizontal offset
  const getTransform = (i: number) => {
    const center   = (count - 1) / 2;
    const offset   = i - center;
    const rotate   = (offset / Math.max(center, 1)) * maxTilt;
    const tx       = offset * spread;
    const ty       = Math.abs(offset) * Math.abs(offset) * 0.3; // arc lift
    return { rotate, tx, ty };
  };

  function handleClick(card: GanjifaCard) {
    if (!isMyTurn) return;
    const legal = legalPlays.includes(card.id);
    if (!legal) return;

    if (selected === card.id) {
      // Second click = confirm play
      onPlay?.(card.id);
      setSelected(null);
    } else {
      setSelected(card.id);
    }
  }

  // Sort: legal cards to front
  const sorted = useMemo(() => {
    if (!isMyTurn) return visible;
    return [...visible].sort((a, b) => {
      const aL = legalPlays.includes(a.id) ? 1 : 0;
      const bL = legalPlays.includes(b.id) ? 1 : 0;
      return bL - aL;
    });
  }, [visible, legalPlays, isMyTurn]);

  const totalWidth  = spread * (count - 1) + cardSize;
  const totalHeight = cardSize + maxTilt * 2;

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <p className="text-xs text-gold/60 font-mughal tracking-wider uppercase">{label}</p>
      )}

      <div
        className="relative flex items-end justify-center"
        style={{ width: Math.min(totalWidth + 60, 800), height: totalHeight + 30 }}
      >
        <AnimatePresence>
          {sorted.map((card, i) => {
            const { rotate, tx, ty } = getTransform(i);
            const isLegal    = isMyTurn ? legalPlays.includes(card.id) : true;
            const isSelected = selected === card.id;
            const zIndex     = isSelected ? 50 : i + 1;

            return (
              <motion.div
                key={card.id}
                layout
                initial={isDealing ? { y: -250, rotate: 0, opacity: 0 } : false}
                animate={{
                  x:        tx,
                  y:        isSelected ? ty - 24 : ty,
                  rotate:   isSelected ? 0 : rotate,
                  opacity:  1,
                  scale:    isSelected ? 1.1 : 1,
                }}
                transition={{
                  delay:   isDealing ? i * 0.06 : 0,
                  type:    'spring',
                  stiffness: 300,
                  damping:   22,
                }}
                style={{
                  position:  'absolute',
                  bottom:    0,
                  zIndex,
                  transformOrigin: 'bottom center',
                }}
              >
                <CardFace
                  card={card}
                  size={cardSize}
                  isLegal={isLegal}
                  isSelected={isSelected}
                  disabled={!isMyTurn}
                  showTooltip={true}
                  onClick={() => handleClick(card)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Card count badge */}
      <div className="text-xs text-ivory/40 mt-1">
        {count} card{count !== 1 ? 's' : ''}
        {isMyTurn && legalPlays.length > 0 && (
          <span className="text-gold ml-2">
            · {legalPlays.length} playable
            {selected && <span className="text-gold-light"> · Click again to play</span>}
          </span>
        )}
      </div>
    </div>
  );
}
