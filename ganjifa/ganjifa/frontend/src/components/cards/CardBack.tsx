'use client';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface Props {
  size?:     number;
  theme?:    string;
  isDealing?: boolean;
  dealDelay?: number;
  className?: string;
  label?:    string;  // player name label below card
}

export default function CardBack({
  size = 90, theme = 'dashavatara', isDealing, dealDelay = 0, className, label,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        initial={isDealing ? { y: -200, rotate: -15, scale: 0.3, opacity: 0 } : false}
        animate={isDealing ? { y: 0, rotate: 0, scale: 1, opacity: 1 } : { opacity: 1 }}
        transition={isDealing
          ? { delay: dealDelay / 1000, type: 'spring', stiffness: 280, damping: 22 }
          : {}}
        className={clsx('rounded-full flex-shrink-0 relative overflow-hidden', className)}
        style={{
          width:  size,
          height: size,
          boxShadow: '0 6px 24px rgba(0,0,0,0.5), 0 2px 6px rgba(218,165,32,0.2)',
        }}
      >
        {/* Patterned back */}
        <div className="card-back-pattern absolute inset-0 rounded-full" />

        {/* Outer gold ring */}
        <div className="absolute inset-0 rounded-full border-4"
             style={{ borderColor: 'rgba(218,165,32,0.5)' }} />

        {/* Inner ring */}
        <div className="absolute rounded-full border-2"
             style={{
               inset: size * 0.1,
               borderColor: 'rgba(218,165,32,0.25)',
               borderRadius: '50%',
             }} />

        {/* Centre ornament — theme-specific symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="select-none"
            style={{ fontSize: size * 0.28, opacity: 0.4 }}
          >
            {theme === 'dashavatara' ? '🪷'
              : theme === 'ramayana'   ? '🏹'
              : '🚀'}
          </span>
        </div>

        {/* Concentric dot ring (traditional Ganjifa decoration) */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle  = (i / 12) * 2 * Math.PI;
          const radius = size * 0.34;
          const cx     = size / 2 + radius * Math.cos(angle);
          const cy     = size / 2 + radius * Math.sin(angle);
          return (
            <div key={i}
              className="absolute rounded-full"
              style={{
                width: 3, height: 3,
                background: 'rgba(218,165,32,0.4)',
                left: cx - 1.5, top: cy - 1.5,
              }}
            />
          );
        })}
      </motion.div>

      {label && (
        <p className="text-xs text-ivory/40 truncate max-w-[100px] text-center">{label}</p>
      )}
    </div>
  );
}
