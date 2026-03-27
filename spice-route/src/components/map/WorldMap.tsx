import React from "react";
import { SpiceRouteMapSVG } from "./SpiceRouteMapSVG";
import { PORTS, CARGO_CAPACITY, GOAL_GOLD } from "../../data/ports";
import type { GameState, Cargo } from "../../types/game";

interface WorldMapProps {
  onBackToHarbor: () => void;
  gameState: GameState;
  onBuy: (spice: string, amount: number) => void;
  onSell: (spice: string, amount: number) => void;
  onSail: (portId: string) => void;
  onDismissTutorial: () => void;
  onSaveGame?: () => void;
  onSaveAndFinish?: () => void;
  saveStatus?: "idle" | "saving" | "saved" | "error";
}

function cargoTotal(c: Cargo): number {
  return c.Pepper + c.Cardamom;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  onBackToHarbor,
  gameState,
  onBuy,
  onSell,
  onSail,
  onDismissTutorial,
  onSaveGame,
  onSaveAndFinish,
  saveStatus = "idle",
}) => {
  const { gold, cargo: rawCargo, currentPortId, selectedPortId, log: rawLog, showTutorial, gameMode } = gameState;
  const cargo = rawCargo ?? { Pepper: 0, Cardamom: 0 };
  const emptyLog: string[] = [];
  const log = Array.isArray(rawLog) ? rawLog : emptyLog;
  const currentPort = currentPortId ? (PORTS.find((p) => p.id === currentPortId) ?? null) : null;
  const selectedPort = selectedPortId ? (PORTS.find((p) => p.id === selectedPortId) ?? null) : null;
  const atPort = currentPort !== null;
  const cargoUsed = cargoTotal(cargo);
  const space = CARGO_CAPACITY - cargoUsed;
  const reachedGoal = gold >= GOAL_GOLD;
  const gameOver = gold === 0 && cargo.Pepper === 0 && cargo.Cardamom === 0;

  return (
    <div className="flex-1 relative bg-parchment overflow-hidden flex flex-col">
      {/* Game Over overlay */}
      {gameOver && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-amber-900/70">
          <span className="text-4xl font-bold text-red-500 drop-shadow-lg" style={{ textShadow: "0 0 8px rgba(0,0,0,0.8)" }}>
            Game Over!
          </span>
          <button
            type="button"
            onClick={onBackToHarbor}
            className="px-4 py-2 rounded-xl bg-amber-100 border border-amber-600 text-amber-900 font-medium hover:bg-amber-200"
          >
            Back to Harbor
          </button>
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 text-xs bg-amber-50/95 border-b border-amber-700/30 shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-amber-900">Spice Route · Ancient Trade</span>
          <span className="text-amber-700">
            Gold: <strong className="text-amber-900">{gold}</strong> / {GOAL_GOLD}
          </span>
          <span className="text-amber-700">
            Cargo: <strong className="text-amber-900">{cargoUsed}/{CARGO_CAPACITY}</strong>
          </span>
          {currentPort && (
            <span className="text-amber-800">
              At: <strong>{currentPort.name}</strong>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {reachedGoal && (
            <span className="px-2 py-1 rounded bg-emerald-200 text-emerald-900 font-semibold">
              Goal reached! {gold} gold
            </span>
          )}
          {onSaveGame && (
            <button
              type="button"
              onClick={onSaveGame}
              disabled={saveStatus === "saving"}
              className="px-3 py-1.5 rounded-full border border-amber-600 text-amber-900 bg-amber-100 hover:bg-amber-200 disabled:opacity-60 text-[11px]"
            >
              {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved ✓" : saveStatus === "error" ? "Save failed (retry)" : "Save game"}
            </button>
          )}
          {onSaveAndFinish && (
            <button
              type="button"
              onClick={onSaveAndFinish}
              disabled={saveStatus === "saving"}
              className="px-3 py-1.5 rounded-full border border-amber-700 bg-amber-200 text-amber-900 hover:bg-amber-300 disabled:opacity-60 text-[11px]"
            >
              Save & finish
            </button>
          )}
          <button
            type="button"
            onClick={onBackToHarbor}
            className="px-3 py-1.5 rounded-full border border-amber-500 text-amber-900 bg-amber-100 hover:bg-amber-200"
          >
            ← Back to Harbor
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Map area - same aspect ratio as SVG viewBox 800x500 */}
        <div className="relative flex-1 min-w-0 flex items-center justify-center p-2">
          <div className="relative w-full max-h-full" style={{ aspectRatio: "800/500" }}>
            <SpiceRouteMapSVG className="w-full h-full rounded-2xl border-2 border-amber-800/50 shadow-xl" />
            {/* Port markers overlaid */}
            {PORTS.map((port) => {
              const isCurrent = port.id === currentPortId;
              const isSelected = port.id === selectedPortId;
              const canSail = atPort && port.id !== currentPortId;
              return (
                <button
                  key={port.id}
                  type="button"
                  onClick={() => {
                    if (canSail) onSail(port.id);
                    else if (!atPort || port.id !== currentPortId) {
                      // Select for sailing
                      if (atPort) onSail(port.id);
                    }
                  }}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => {}}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition transform hover:scale-110"
                  style={{ left: `${port.x}%`, top: `${port.y}%` }}
                  title={canSail ? `Sail to ${port.name}` : `${port.name} (${port.region})`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 shadow-lg ${
                      isCurrent
                        ? "bg-amber-400 border-amber-800 ring-4 ring-amber-300/80"
                        : isSelected
                        ? "bg-amber-300 border-amber-700"
                        : port.risk === "low"
                        ? "bg-emerald-400 border-emerald-700"
                        : port.risk === "medium"
                        ? "bg-amber-400 border-amber-700"
                        : "bg-red-400 border-red-700"
                    }`}
                  />
                  <span className="absolute left-1/2 -translate-x-1/2 top-5 whitespace-nowrap px-1.5 py-0.5 rounded bg-amber-900/90 text-amber-50 text-[10px] font-medium">
                    {port.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right panel: actions + log */}
        <aside className="w-80 shrink-0 flex flex-col border-l border-amber-700/30 bg-amber-50/95 overflow-hidden">
          {/* How to Play - collapsible */}
          <details className="border-b border-amber-200" open={showTutorial}>
            <summary className="px-4 py-2 text-xs font-semibold text-amber-900 cursor-pointer list-none flex items-center justify-between">
              How to Play
              <span className="text-amber-600 text-[10px]">▼</span>
            </summary>
            <div className="px-4 pb-3 text-[11px] text-amber-900 space-y-2">
              <p><strong>Goal:</strong> Earn <strong>{GOAL_GOLD} gold</strong> by trading spices. Buy cheap in Kerala, sell dear in Rome.</p>
              <p><strong>1.</strong> Click a <strong>port</strong> to sail there (you start at Calicut).</p>
              <p><strong>2.</strong> At a port, <strong>Buy</strong> spices (spend gold) or <strong>Sell</strong> (earn gold).</p>
              <p><strong>3.</strong> Your ship holds {CARGO_CAPACITY} units. Fill it and sail to a port where prices are higher!</p>
              <p><strong>4.</strong> Risk: low = safe, high = storms may cost extra. Plan your route.</p>
              {showTutorial && gameMode === "practice" && (
                <button
                  type="button"
                  onClick={onDismissTutorial}
                  className="mt-2 px-2 py-1 rounded bg-amber-200 text-amber-900 text-[10px] font-medium"
                >
                  Got it — start trading
                </button>
              )}
            </div>
          </details>

          {/* At port: Buy / Sell */}
          {currentPort && (
            <div className="p-3 border-b border-amber-200 space-y-3">
              <div className="text-xs font-semibold text-amber-900">
                At {currentPort.name}
              </div>
              <div className="space-y-2 text-[11px]">
                {(["Pepper", "Cardamom"] as const).map((spice) => {
                  const buyPrice = currentPort.buyPrices[spice] ?? 0;
                  const sellPrice = currentPort.sellPrices[spice] ?? 0;
                  const canBuyOne = space > 0 && gold >= buyPrice;
                  const buyFive = buyPrice > 0 ? Math.min(5, space, Math.floor(gold / buyPrice)) : 0;
                  const canBuy5 = buyFive >= 1;
                  const have = cargo[spice] ?? 0;
                  const canSellOne = have > 0;
                  return (
                    <div key={spice} className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-amber-800">{spice}:</span>
                      <div className="flex items-center gap-1 flex-wrap">
                        <button
                          type="button"
                          disabled={!canBuyOne}
                          onClick={() => onBuy(spice, 1)}
                          className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Buy 1
                        </button>
                        <button
                          type="button"
                          disabled={!canBuy5}
                          onClick={() => onBuy(spice, buyFive)}
                          className="px-2 py-0.5 rounded bg-emerald-700 text-white text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Buy 5
                        </button>
                        <button
                          type="button"
                          disabled={!canSellOne}
                          onClick={() => onSell(spice, 1)}
                          className="px-2 py-0.5 rounded bg-amber-600 text-white text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Sell 1
                        </button>
                        <button
                          type="button"
                          disabled={have === 0}
                          onClick={() => onSell(spice, Math.max(0, have))}
                          className="px-2 py-0.5 rounded bg-amber-700 text-white text-[10px] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Sell all
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="text-[10px] text-amber-700">
                Your cargo: Pepper {cargo.Pepper}, Cardamom {cargo.Cardamom}
              </div>
            </div>
          )}

          {/* Sail to... hint */}
          {currentPort && (
            <div className="px-3 py-1 text-[10px] text-amber-700 border-b border-amber-100">
              Click another port on the map to sail there.
            </div>
          )}

          {/* Log */}
          <div className="flex-1 overflow-auto p-3">
            <div className="text-[10px] font-semibold text-amber-900 mb-1">Harbor log</div>
            <ul className="space-y-0.5 text-[11px] text-amber-800">
              {log.length === 0 && (
                <li className="italic">Your journey begins…</li>
              )}
              {[...log].reverse().slice(0, 20).map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Full-screen tutorial overlay for first-time practice */}
      {showTutorial && gameMode === "practice" && (
        <div
          className="absolute inset-0 bg-amber-900/60 flex items-center justify-center z-20 p-6"
          aria-modal
          role="dialog"
        >
          <div className="max-w-md parchment-panel rounded-2xl border-2 border-amber-700 shadow-2xl p-5 text-amber-900">
            <h2 className="text-lg font-semibold mb-2">Welcome, Merchant</h2>
            <p className="text-sm mb-3">
              You start in <strong>Calicut</strong> with 100 gold. Buy pepper and cardamom here, then sail to <strong>Aden</strong>, <strong>Alexandria</strong>, or <strong>Rome</strong> to sell for more gold.
            </p>
            <p className="text-sm mb-3">
              <strong>Goal:</strong> Reach {GOAL_GOLD} gold. Click ports to sail; at each port use Buy/Sell in the right panel.
            </p>
            <button
              type="button"
              onClick={onDismissTutorial}
              className="w-full py-2 rounded-xl bg-amber-600 text-amber-50 font-semibold hover:bg-amber-700"
            >
              Start trading
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
