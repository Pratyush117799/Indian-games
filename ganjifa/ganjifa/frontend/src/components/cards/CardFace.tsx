'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { GanjifaCard } from '@/types';

const CARDS_URL = process.env.NEXT_PUBLIC_CARDS_URL || 'http://localhost:5002';

interface Props {
  card:      GanjifaCard;
  size?:     number;         // px diameter, default 120
  isLegal?:  boolean;
  isSelected?: boolean;
  isPlayed?: boolean;
  isDealing?: boolean;
  dealDelay?: number;        // ms stagger for deal animation
  onClick?:  () => void;
  showTooltip?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function CardFace({
  card, size = 120, isLegal = true, isSelected, isPlayed,
  isDealing, dealDelay = 0, onClick, showTooltip = true,
  disabled, className,
}: Props) {
  const [imgError, setImgError]   = useState(false);
  const [triedSvg, setTriedSvg]   = useState(false);
  const [hovered,  setHovered]    = useState(false);

  const diameter = size;
  // Try PNG first, fall back to SVG placeholder, then rendered fallback
  const pngSrc   = `${CARDS_URL}${card.imageUrl}`;
  const svgSrc   = `${CARDS_URL}${card.imageUrl.replace('.png', '.svg')}`;
  const imgSrc   = (!imgError) ? pngSrc : (!triedSvg ? svgSrc : '');

  return (
    <motion.div
      layout
      initial={isDealing ? { y: -300, rotate: 15, scale: 0.3, opacity: 0 } : false}
      animate={isDealing ? { y: 0, rotate: 0, scale: 1, opacity: 1 } : { scale: isSelected ? 1.1 : 1 }}
      transition={isDealing
        ? { delay: dealDelay / 1000, type: 'spring', stiffness: 260, damping: 20 }
        : { type: 'spring', stiffness: 400, damping: 25 }
      }
      whileHover={!disabled && isLegal ? { y: -14, scale: 1.06 } : {}}
      whileTap={!disabled && isLegal ? { scale: 0.97 } : {}}
      onClick={disabled || !isLegal ? undefined : onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={clsx(
        'ganjifa-card relative flex-shrink-0',
        isSelected && 'selected',
        isLegal && !disabled ? 'legal cursor-pointer' : '',
        !isLegal && 'illegal',
        disabled && 'cursor-default',
        className,
      )}
      style={{ width: diameter, height: diameter }}
    >
      {/* Card image */}
      {(!imgError || !triedSvg) ? (
        <img
          src={imgSrc}
          alt={`${card.suitName} ${card.rank}`}
          onError={() => {
            if (!imgError) { setImgError(true); }          // PNG failed → try SVG
            else           { setTriedSvg(true); }           // SVG failed → show fallback
          }}
          className="w-full h-full rounded-full object-cover select-none pointer-events-none"
          draggable={false}
        />
      ) : (
        <FallbackCard card={card} size={diameter} />
      )}

      {/* Selected glow ring */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: '0 0 24px rgba(218,165,32,0.9), 0 0 8px rgba(218,165,32,0.4), 0 0 0 3px #DAA520' }}
        />
      )}

      {/* Legal move sparkle dots */}
      {isLegal && !isSelected && !disabled && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gold animate-pulse" />
      )}

      {/* Tooltip on hover */}
      {showTooltip && hovered && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-50
                     bg-black/90 border border-gold/40 rounded-lg px-3 py-1.5
                     text-xs text-ivory whitespace-nowrap pointer-events-none shadow-lg"
        >
          <p className="font-semibold text-gold">{card.suitName}</p>
          <p className="capitalize">{card.rank} · {card.type}</p>
          <p className="text-ivory/50">Strength: {card.strength}</p>
          {/* Tooltip arrow */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2
                          w-3 h-3 bg-black/90 border-r border-b border-gold/40
                          rotate-45" />
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Fallback when image is missing (placeholder) ──────────────
function FallbackCard({ card, size }: { card: GanjifaCard; size: number }) {
  const fontSize = Math.round(size * 0.25);
  return (
    <div
      className="w-full h-full rounded-full flex flex-col items-center justify-center
                 border-4 select-none"
      style={{ background: card.bgColor, borderColor: card.borderColor }}
    >
      {/* Outer gold ring */}
      <div className="absolute inset-2 rounded-full border-2"
           style={{ borderColor: card.borderColor, opacity: 0.6 }} />

      {/* Pip symbol */}
      <div style={{ fontSize: fontSize * 1.2 }}>{card.pipSymbol}</div>

      {/* Rank */}
      <div className="font-mughal font-bold" style={{ fontSize: Math.max(10, fontSize * 0.55), color: card.borderColor }}>
        {card.rank.toUpperCase()}
      </div>

      {/* Suit name */}
      <div className="text-center leading-tight"
           style={{ fontSize: Math.max(8, fontSize * 0.4), color: '#FFF8DC', opacity: 0.8 }}>
        {card.suitName}
      </div>
    </div>
  );
}
