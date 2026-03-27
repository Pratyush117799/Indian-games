import React from "react";
import type { HistoryEntry } from "../api/client";

interface LobbyScreenProps {
  onPlayOnline: () => void;
  onPlayFriends: () => void;
  onPlayAI: () => void;
  onPractice: () => void;
  onResume?: () => void;
  progressAvailable?: boolean | null;
  onOpenHistory?: () => void;
  history?: HistoryEntry[] | null;
}

interface PlayCardProps {
  title: string;
  subtitle: string;
  badge?: string;
  onClick: () => void;
}

const PlayModeCard: React.FC<PlayCardProps> = ({ title, subtitle, badge, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full text-left px-4 py-3 rounded-2xl border border-amber-700/50 bg-amber-50/90 hover:bg-amber-100 shadow-sm transition flex items-center justify-between gap-3"
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-amber-900">{title}</span>
        {badge && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 font-medium">
            {badge}
          </span>
        )}
      </div>
      <div className="text-[11px] text-amber-700 mt-0.5">{subtitle}</div>
    </div>
    <span className="text-lg shrink-0">➤</span>
  </button>
);

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  onPlayOnline,
  onPlayFriends,
  onPlayAI,
  onPractice,
  onResume,
  progressAvailable,
  onOpenHistory,
  history,
}) => {
  const [showHowToPlay, setShowHowToPlay] = React.useState(true);
  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-0">
      <section className="relative map-background overflow-auto flex items-start justify-center p-4">
        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(254,243,199,0.4),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(254,243,199,0.5),transparent_55%)]" />
        <div className="relative max-w-lg w-full parchment-panel rounded-3xl border border-amber-700/60 shadow-2xl p-5 space-y-4">
          <h1 className="text-xl font-semibold text-amber-900">
            Welcome, young merchant
          </h1>
          <p className="text-xs text-amber-900 leading-relaxed">
            The winds are changing over the Arabian Sea. From Kerala&apos;s pepper ports to
            Rome&apos;s golden markets, every route you choose will write a new story.
          </p>

          {/* How to Play - always visible */}
          <div className="rounded-xl border border-amber-600/40 bg-amber-100/80 p-3 space-y-2">
            <button
              type="button"
              onClick={() => setShowHowToPlay((v) => !v)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="text-sm font-semibold text-amber-900">How to Play</span>
              <span className="text-amber-700 text-xs">{showHowToPlay ? "▼" : "▶"}</span>
            </button>
            {showHowToPlay && (
              <ul className="text-[11px] text-amber-900 space-y-1 list-disc list-inside">
                <li><strong>Goal:</strong> Earn 300 gold by trading spices (buy low, sell high).</li>
                <li>You start in <strong>Calicut</strong> with 100 gold. Use the map to sail between ports.</li>
                <li>At each port: <strong>Buy</strong> spices (spend gold) or <strong>Sell</strong> (earn gold).</li>
                <li>Your ship holds 20 units. Fill it in Kerala, sail to Rome or Alexandria to sell for more.</li>
                <li>Click a port on the map to sail there. Each voyage costs 5 gold.</li>
              </ul>
            )}
          </div>

          {progressAvailable && onResume && (
            <div className="rounded-xl border-2 border-amber-500 bg-amber-100/90 p-3">
              <button
                type="button"
                onClick={onResume}
                className="w-full text-left px-4 py-3 rounded-2xl border border-amber-600 bg-amber-200/90 hover:bg-amber-300/90 font-semibold text-amber-900 flex items-center justify-between"
              >
                <span>Resume saved game</span>
                <span className="text-lg">➤</span>
              </button>
            </div>
          )}

          <p className="text-[11px] text-amber-800">
            Choose how you&apos;d like to set sail:
          </p>
          <div className="space-y-2">
            <PlayModeCard
              title="Practice (Tutorial)"
              subtitle="Learn the trade with a step-by-step guide. Recommended for first-time players."
              badge="Start here"
              onClick={onPractice}
            />
            <PlayModeCard
              title="Play vs AI Merchant"
              subtitle="Same trading game, race to 300 gold against a computer trader."
              onClick={onPlayAI}
            />
            <PlayModeCard
              title="Play with Friends"
              subtitle="Share a room code and trade together. (Same map, take turns.)"
              onClick={onPlayFriends}
            />
            <PlayModeCard
              title="Play Online"
              subtitle="Match with other merchants around the world."
              onClick={onPlayOnline}
            />
          </div>
        </div>
      </section>
      <aside className="bg-amber-50/90 border-l border-amber-700/30 parchment-panel flex flex-col overflow-auto">
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
          {onOpenHistory && (
            <div>
              <button
                type="button"
                onClick={() => { onOpenHistory(); setShowHistory(true); }}
                className="font-semibold mb-1 text-amber-800 hover:text-amber-900 underline"
              >
                Game history
              </button>
              <p className="text-amber-700">View and track your past voyages.</p>
            </div>
          )}
          <div>
            <div className="font-semibold mb-1">Titles unlocked</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Pepper Prince</li>
              <li>Monsoon Apprentice</li>
            </ul>
          </div>
        </div>
      </aside>

      {showHistory && (
        <div
          className="fixed inset-0 bg-amber-900/50 flex items-center justify-center z-30 p-4"
          onClick={() => setShowHistory(false)}
          role="dialog"
          aria-modal
        >
          <div
            className="bg-parchment rounded-2xl border-2 border-amber-700 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-amber-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-amber-900">Game history</h2>
              <button type="button" onClick={() => setShowHistory(false)} className="text-amber-700 hover:text-amber-900 text-xl leading-none">×</button>
            </div>
            <ul className="p-4 overflow-auto space-y-2 text-sm">
              {history == null ? (
                <li className="text-amber-700">Loading…</li>
              ) : history.length === 0 ? (
                <li className="text-amber-700">No voyages recorded yet. Save a game to see it here.</li>
              ) : (
                history.map((entry) => (
                  <li key={entry.id} className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-semibold text-amber-900">{entry.gold} gold</span>
                        {entry.goalReached && <span className="ml-2 text-emerald-700 text-[10px] font-medium">Goal reached</span>}
                        <div className="text-[11px] text-amber-700 mt-0.5">{formatDate(entry.createdAt)}</div>
                        <div className="text-[10px] text-amber-600">{entry.gameMode} · {entry.currentPortId ?? "—"}</div>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
