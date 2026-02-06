import React from "react";

interface StoryModalProps {
  open: boolean;
  onStart: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ open, onStart }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="max-w-xl mx-4 bg-amber-50 rounded-2xl border-2 border-amber-700 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="victory-shimmer" />
        </div>
        <div className="relative p-6 space-y-3">
          <h2 className="text-xl font-semibold text-amber-900 flex items-baseline gap-2">
            <span>Chakravyuh</span>
            <span className="text-lg text-amber-800">/ चक्रव्यूह</span>
          </h2>
          <p className="text-xs uppercase tracking-wide text-amber-700">
            A Mahabharata Tale of Strategy and Courage
          </p>
          <div className="space-y-2 text-sm text-amber-900 leading-relaxed max-h-72 overflow-y-auto pr-1">
            <p>
              In the Mahabharata, the Chakravyuh was a legendary multi-layered circular battle
              formation. Warriors arranged themselves in spiraling rings, drawing enemies inward
              into an ever-tightening maze of steel and strategy.
            </p>
            <p>
              Abhimanyu, the son of Arjuna and Subhadra, learned how to enter this deadly formation
              while still in his mother&apos;s womb. He knew the secrets of breaking into the
              Chakravyuh, but the knowledge of the final step &mdash; how to escape it &mdash; never
              reached him.
            </p>
            <p>
              On the thirteenth day of the Kurukshetra war, Abhimanyu bravely charged into the
              Chakravyuh to protect the Pandava army. He pierced through layer after layer, fighting
              alone against some of the greatest warriors of his time. Surrounded and outnumbered,
              he eventually fell, but his courage turned him into a timeless symbol of skill,
              sacrifice, and unbroken resolve.
            </p>
            <p>
              This game reimagines the Chakravyuh as a puzzle of paths, barriers, and choices.
              As the Architect, you design the formation; as the Warrior, you must find the way
              from entry to center and finally to freedom.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onStart}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-700 text-amber-50 shadow hover:bg-indigo-800"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

