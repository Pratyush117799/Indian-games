import React from "react";
import { NavBar } from "./components/layout/NavBar";
import { LobbyScreen } from "./components/lobby/LobbyScreen";
import { WorldMap } from "./components/map/WorldMap";
import { PORTS } from "./data/ports";
import type { GameState, GameMode } from "./types/game";
import { getInitialGameState } from "./types/game";
import { getPlayerId, apiSave, apiGetProgress, apiGetHistory } from "./api/client";

type View = "lobby" | "map";

const App: React.FC = () => {
  const [view, setView] = React.useState<View>("lobby");
  const [gameState, setGameState] = React.useState<GameState | null>(null);
  const [gameMode, setGameMode] = React.useState<GameMode>("practice");
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const [progressAvailable, setProgressAvailable] = React.useState<boolean | null>(null);
  const [history, setHistory] = React.useState<Awaited<ReturnType<typeof apiGetHistory>> | null>(null);

  const startGame = React.useCallback((mode: GameMode) => {
    setGameMode(mode);
    setGameState(getInitialGameState(mode));
    setView("map");
  }, []);

  const loadProgress = React.useCallback(async () => {
    try {
      const progress = await apiGetProgress();
      if (progress) {
        setGameState({
          gold: progress.gold,
          cargo: progress.cargo,
          currentPortId: progress.currentPortId,
          phase: "idle",
          selectedPortId: null,
          log: progress.log,
          showTutorial: false,
          gameMode: progress.gameMode as GameMode,
          savedGameId: progress.id,
        });
        setGameMode(progress.gameMode as GameMode);
        setView("map");
        setProgressAvailable(false);
      }
    } catch (_) {
      setSaveStatus("error");
    }
  }, []);

  const checkProgress = React.useCallback(async () => {
    try {
      const progress = await apiGetProgress();
      setProgressAvailable(!!progress);
    } catch (_) {
      setProgressAvailable(false);
    }
  }, []);

  const saveGame = React.useCallback(async (finish: boolean) => {
    if (!gameState) return;
    setSaveStatus("saving");
    try {
      const playerId = getPlayerId();
      const res = await apiSave({
        playerId,
        gold: gameState.gold,
        cargo: gameState.cargo ?? { Pepper: 0, Cardamom: 0 },
        currentPortId: gameState.currentPortId,
        log: gameState.log ?? [],
        gameMode: gameState.gameMode,
        gameId: gameState.savedGameId ?? undefined,
        completedAt: finish ? new Date().toISOString() : null,
        goalReached: finish && gameState.gold >= 300,
      });
      if (res.gameId != null) {
        setGameState((prev) => prev ? { ...prev, savedGameId: res.gameId ?? undefined } : null);
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (_) {
      setSaveStatus("error");
    }
  }, [gameState]);

  const loadHistory = React.useCallback(async () => {
    try {
      const list = await apiGetHistory();
      setHistory(list);
    } catch (_) {
      setHistory([]);
    }
  }, []);

  const handleBuy = React.useCallback((spice: string, amount: number) => {
    const amt = Math.max(0, Math.floor(Number(amount)) || 0);
    if (amt <= 0) return;
    if (!gameState?.currentPortId) return;
    const port = PORTS.find((p) => p.id === gameState.currentPortId);
    if (!port) return;
    const price = (port.buyPrices[spice] ?? 0) * amt;
    const cargo = gameState.cargo ?? { Pepper: 0, Cardamom: 0 };
    const totalCargo = (cargo.Pepper ?? 0) + (cargo.Cardamom ?? 0);
    const space = 20 - totalCargo;
    if (space < amt || gameState.gold < price) return;
    setGameState((prev) => {
      if (!prev) return prev;
      const cur = prev.cargo ?? { Pepper: 0, Cardamom: 0 };
      const total = (cur.Pepper ?? 0) + (cur.Cardamom ?? 0);
      if (20 - total < amt || (prev.gold ?? 0) < price) return prev;
      const current = cur[spice as keyof typeof cur] ?? 0;
      const nextCargo = { ...cur, [spice]: current + amt };
      return {
        ...prev,
        gold: prev.gold - price,
        cargo: nextCargo,
        log: [...(prev.log ?? []), `Bought ${amt} ${spice} at ${port.name} for ${price} gold.`],
      };
    });
  }, [gameState?.currentPortId]);

  const handleSell = React.useCallback((spice: string, amount: number) => {
    const amt = Math.max(0, Math.floor(Number(amount)) || 0);
    if (amt <= 0) return;
    if (!gameState?.currentPortId) return;
    const port = PORTS.find((p) => p.id === gameState.currentPortId);
    if (!port) return;
    const cargo = gameState.cargo ?? { Pepper: 0, Cardamom: 0 };
    const have = cargo[spice as keyof typeof cargo] ?? 0;
    const sellAmount = Math.min(amt, have);
    if (sellAmount <= 0) return;
    const price = (port.sellPrices[spice] ?? 0) * sellAmount;
    setGameState((prev) => {
      if (!prev) return prev;
      const cur = prev.cargo ?? { Pepper: 0, Cardamom: 0 };
      const current = cur[spice as keyof typeof cur] ?? 0;
      const actualSell = Math.min(sellAmount, Math.max(0, current));
      if (actualSell <= 0) return prev;
      const nextCargo = { ...cur, [spice]: current - actualSell };
      const actualPrice = (port.sellPrices[spice] ?? 0) * actualSell;
      return {
        ...prev,
        gold: prev.gold + actualPrice,
        cargo: nextCargo,
        log: [...(prev.log ?? []), `Sold ${actualSell} ${spice} at ${port.name} for ${actualPrice} gold.`],
      };
    });
  }, [gameState?.currentPortId]);

  const handleSail = React.useCallback((portId: string) => {
    if (!gameState?.currentPortId || gameState.currentPortId === portId) return;
    const from = PORTS.find((p) => p.id === gameState.currentPortId);
    const to = PORTS.find((p) => p.id === portId);
    if (!from || !to) return;
    const travelCost = 5;
    setGameState((prev) => {
      if (!prev) return prev;
      const newGold = Math.max(0, (prev.gold ?? 0) - travelCost);
      return {
        ...prev,
        currentPortId: portId,
        gold: newGold,
        log: [...(prev.log ?? []), `Sailed ${from.name} → ${to.name}. Travel cost ${travelCost} gold. Arrived at ${to.name}.`],
      };
    });
  }, [gameState?.currentPortId]);

  const handleDismissTutorial = React.useCallback(() => {
    setGameState((prev) => prev ? { ...prev, showTutorial: false } : null);
  }, []);

  React.useEffect(() => {
    if (view === "lobby") checkProgress();
  }, [view, checkProgress]);

  const backToHarbor = React.useCallback(() => {
    setView("lobby");
    setGameState(null);
    setSaveStatus("idle");
    checkProgress();
  }, [checkProgress]);

  return (
    <div className="flex flex-col w-full min-h-0 flex-1">
      <NavBar currentView={view} onNavigate={setView} />
      {view === "lobby" ? (
        <LobbyScreen
          onPlayOnline={() => startGame("online")}
          onPlayFriends={() => startGame("friends")}
          onPlayAI={() => startGame("ai")}
          onPractice={() => startGame("practice")}
          onResume={loadProgress}
          progressAvailable={progressAvailable}
          onOpenHistory={loadHistory}
          history={history}
        />
      ) : gameState ? (
        <WorldMap
          onBackToHarbor={backToHarbor}
          gameState={gameState}
          onBuy={handleBuy}
          onSell={handleSell}
          onSail={handleSail}
          onDismissTutorial={handleDismissTutorial}
          onSaveGame={() => saveGame(false)}
          onSaveAndFinish={() => saveGame(true)}
          saveStatus={saveStatus}
        />
      ) : null}
    </div>
  );
};

export default App;
