import React from "react";

interface LobbyScreenProps {
  onPlayOnline: () => void;
  onPlayFriends: () => void;
  onPlayAI: () => void;
  onPractice: () => void;
}

interface PlayCardProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

const PlayModeCard: React.FC<PlayCardProps> = ({ title, subtitle, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full text-left px-4 py-3 rounded-2xl border border-amber-700/50 bg-amber-50/90 hover:bg-amber-100 shadow-sm transition flex items-center justify-between gap-3"
  >
    <div>
      <div className="text-sm font-semibold text-amber-900">{title}</div>
      <div className="text-[11px] text-amber-700">{subtitle}</div>
    </div>
    <span className="text-lg">➤</span>
  </button>
);

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  onPlayOnline,
  onPlayFriends,
  onPlayAI,
  onPractice
}) => {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[3fr_2fr]">
      <section className="relative map-background overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(254,243,199,0.4),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(254,243,199,0.5),transparent_55%)]" />
        <div className="relative max-w-md mx-6 parchment-panel rounded-3xl border border-amber-700/60 shadow-2xl p-5 space-y-3">
          <h1 className="text-xl font-semibold text-amber-900">
            Welcome, young merchant
          </h1>
          <p className="text-xs text-amber-900 leading-relaxed">
            The winds are changing over the Arabian Sea. From Kerala&apos;s pepper ports to
            Rome&apos;s golden markets, every route you choose will write a new story.
          </p>
          <p className="text-[11px] text-amber-800">
            Choose how you&apos;d like to set sail today.
          </p>
          <div className="space-y-2 mt-2">
            <PlayModeCard
              title="Play Online"
              subtitle="Trade spices with merchants around the world."
              onClick={onPlayOnline}
            />
            <PlayModeCard
              title="Play with Friends"
              subtitle="Share a room code and sail together."
              onClick={onPlayFriends}
            />
            <PlayModeCard
              title="Play vs AI Merchant"
              subtitle="Challenge a clever computer trader."
              onClick={onPlayAI}
            />
            <PlayModeCard
              title="Practice Routes (Tutorial)"
              subtitle="Learn the safest monsoon paths from Kerala."
              onClick={onPractice}
            />
          </div>
        </div>
      </section>
      <aside className="bg-amber-50/90 border-l border-amber-700/30 parchment-panel flex flex-col">
        <div className="p-4 border-b border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-amber-200 flex items-center justify-center shadow-inner">
              <div className="w-10 h-10 rounded-full bg-amber-500 ship-bob flex items-center justify-center text-amber-50 text-xs font-semibold">
                Ship
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-sm font-semibold text-amber-900">
                Captain (you)
              </div>
              <div className="text-[11px] text-amber-700">
                Title: Pepper Prince · Ship: Malabar Star
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3 text-[11px] text-amber-900 flex-1 overflow-auto">
          <div>
            <div className="font-semibold mb-1">Harbor log</div>
            <p>
              Last voyage: Calicut → Aden · Profit: +32 gold · Spices: Pepper, Cardamom.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-1">Titles unlocked</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Pepper Prince</li>
              <li>Monsoon Apprentice</li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

