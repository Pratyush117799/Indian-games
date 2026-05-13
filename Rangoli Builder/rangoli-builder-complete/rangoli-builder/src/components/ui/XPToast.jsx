// src/components/ui/XPToast.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Floating XP notification — call show(xp, label) to trigger.
 * Exported as both a component and an imperative trigger via module state.
 */

// Module-level queue so any component can trigger it
let _trigger = null;
export function showXPToast(xp, label = "") {
  _trigger?.({ xp, label });
}

export default function XPToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _trigger = ({ xp, label }) => {
      const id = Date.now();
      setToasts(t => [...t, { id, xp, label }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
    };
    return () => { _trigger = null; };
  }, []);

  return (
    <div className="fixed top-20 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.8 }}
            animate={{ opacity: 1, x: 0,  scale: 1   }}
            exit={{    opacity: 0, x: 60, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
            style={{
              background: "linear-gradient(135deg,#1a0a2e,#2d1050)",
              border: "1px solid rgba(232,93,4,0.5)",
              boxShadow: "0 8px 32px rgba(232,93,4,0.25)",
            }}
          >
            {/* Burst icon */}
            <motion.span
              initial={{ rotate: -30, scale: 0 }}
              animate={{ rotate: 0,   scale: 1  }}
              transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
              className="text-2xl"
            >⭐</motion.span>

            <div>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="text-lg font-black tabular-nums leading-none"
                style={{ color: "#FFD700", textShadow: "0 0 12px #FFD70088" }}
              >
                +{toast.xp} XP
              </motion.p>
              {toast.label && (
                <p className="text-xs text-white/50 mt-0.5">{toast.label}</p>
              )}
            </div>

            {/* Particle dots */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ background: "#FFD700", left: `${20 + i * 15}%`, top: "10%" }}
                initial={{ opacity: 1, y: 0, scale: 1 }}
                animate={{ opacity: 0, y: -28 - i * 6, scale: 0, x: (i % 2 === 0 ? 1 : -1) * (8 + i * 4) }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.7 }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
