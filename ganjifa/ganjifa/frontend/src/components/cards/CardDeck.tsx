'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardBack from './CardBack';

interface Props {
  totalCards: number;
  theme:      string;
  isDealing?: boolean;
  onDealComplete?: () => void;
  size?: number;
}

export default function CardDeck({ totalCards, theme, isDealing, onDealComplete, size = 100 }: Props) {
  const [cardsLeft, setCardsLeft] = useState(totalCards);
  const [flyingCards, setFlyingCards] = useState<number[]>([]);

  useEffect(() => {
    if (!isDealing) return;

    // Animate cards flying off the deck
    let i = 0;
    const interval = setInterval(() => {
      setFlyingCards(prev => [...prev, i]);
      setCardsLeft(prev => Math.max(0, prev - Math.ceil(totalCards / 8)));
      i++;
      if (i >= 8) {
        clearInterval(interval);
        setTimeout(() => {
          setFlyingCards([]);
          setCardsLeft(0);
          onDealComplete?.();
        }, 600);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isDealing]);

  // Stack of 5 visible offset cards to give depth
  const stackDepth = Math.min(5, Math.ceil(cardsLeft / (totalCards / 5)));

  return (
    <div className="relative flex flex-col items-center gap-2" data-count={`${cardsLeft} cards`}>
      <p className="text-xs text-gold/40 font-mughal tracking-widest uppercase mb-1">Deck</p>

      {/* Stacked cards for depth illusion */}
      <div className="relative" style={{ width: size, height: size }}>
        {Array.from({ length: stackDepth }, (_, i) => (
          <div key={i}
            className="absolute rounded-full"
            style={{
              width: size, height: size,
              top:  -i * 1.5,
              left: -i * 0.5,
              zIndex: i,
            }}>
            <CardBack size={size} theme={theme} />
          </div>
        ))}

        {/* Flying deal animation cards */}
        <AnimatePresence>
          {flyingCards.map(id => (
            <motion.div key={`fly-${id}`}
              className="absolute rounded-full"
              style={{ width: size, height: size, zIndex: 20 }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: (Math.random() - 0.5) * 300,
                y: (Math.random() - 0.5) * 200,
                opacity: 0,
                scale: 0.6,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <CardBack size={size} theme={theme} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Card count */}
      <p className="text-xs text-gold/30 font-mono">{cardsLeft > 0 ? `${cardsLeft} left` : 'dealt'}</p>
    </div>
  );
}
