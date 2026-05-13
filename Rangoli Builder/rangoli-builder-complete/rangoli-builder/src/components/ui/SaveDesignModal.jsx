// src/components/ui/SaveDesignModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Globe, Lock } from "lucide-react";
import useCanvasStore from "../../store/canvasStore";
import useUserStore   from "../../store/userStore";
import { patternAPI } from "../../utils/apiClient";
import { FESTIVALS }  from "../../data/festivals";

export default function SaveDesignModal({ festivalId, onClose, onSaved }) {
  const { tiles, symmetryAxes } = useCanvasStore();
  const { isAuthenticated }     = useUserStore();
  const festival = FESTIVALS.find(f => f.id === festivalId) || FESTIVALS[0];

  const [title,    setTitle]    = useState(`My ${festival.name} Rangoli`);
  const [isPublic, setIsPublic] = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [saved,    setSaved]    = useState(false);

  const handleSave = async () => {
    if (!isAuthenticated) return setError("Please sign in to save designs.");
    if (tiles.length < 3)  return setError("Add at least 3 tiles before saving.");
    if (!title.trim())      return setError("Please give your design a title.");

    setSaving(true);
    setError("");
    try {
      await patternAPI.create({
        title:         title.trim(),
        festival:      festivalId,
        symmetryAxes,
        tiles:         tiles.map(({ id, placedAt, ...t }) => t),
        isPublic,
        difficulty:    "easy",
        estimatedTime: 300,
        tags:          [festivalId],
      });
      setSaved(true);
      setTimeout(() => { onSaved?.(); onClose(); }, 1400);
    } catch (e) {
      setError(e.response?.data?.error || "Save failed — is the backend running?");
    }
    setSaving(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-sm mx-4 rounded-3xl p-7"
          style={{
            background: "linear-gradient(135deg,#1a0a2e,#0f0a1e)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: `0 0 60px ${festival.glowColor}`,
          }}
          initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.88, y: 30 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors">
            <X size={18} />
          </button>

          {saved ? (
            <div className="text-center py-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }} className="text-6xl mb-3">🎉</motion.div>
              <p className="text-lg font-bold text-white">Saved to Gallery!</p>
              <p className="text-white/40 text-sm mt-1">{title}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{festival.emoji}</span>
                <div>
                  <h2 className="text-base font-bold text-white">Save Design</h2>
                  <p className="text-xs text-white/40">{tiles.length} tiles · {symmetryAxes}-axis symmetry</p>
                </div>
              </div>

              {/* Title input */}
              <label className="text-xs text-white/50 mb-1.5 block">Title</label>
              <input
                value={title} onChange={e => setTitle(e.target.value)}
                maxLength={60}
                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-2.5
                           text-white text-sm placeholder-white/25 focus:outline-none
                           focus:border-saffron/60 transition-colors mb-4"
              />

              {/* Visibility toggle */}
              <label className="text-xs text-white/50 mb-2 block">Visibility</label>
              <div className="flex gap-2 mb-5">
                {[
                  { val: true,  icon: <Globe size={13}/>, label: "Public gallery" },
                  { val: false, icon: <Lock  size={13}/>, label: "Only me" },
                ].map(o => (
                  <button key={String(o.val)} onClick={() => setIsPublic(o.val)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl
                                text-sm font-medium transition-all border
                                ${isPublic === o.val
                                  ? "bg-saffron/20 border-saffron/50 text-white"
                                  : "bg-white/5 border-white/10 text-white/50 hover:text-white/80"}`}>
                    {o.icon}{o.label}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20
                               rounded-xl px-3 py-2 mb-4">{error}</p>
              )}

              <button onClick={handleSave} disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
                           font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                style={{ background: `linear-gradient(135deg,${festival.accentColor},${festival.accentColor}99)` }}>
                <Save size={16} />
                {saving ? "Saving…" : "Save to Gallery"}
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
