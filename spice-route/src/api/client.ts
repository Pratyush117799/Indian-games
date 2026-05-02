const API_BASE = "/api";

function getPlayerId(): string {
  let id = localStorage.getItem("spice-route-player-id");
  if (!id) {
    id = "p-" + Math.random().toString(36).slice(2, 12) + "-" + Date.now().toString(36);
    localStorage.setItem("spice-route-player-id", id);
  }
  return id;
}

export { getPlayerId };

export interface SavePayload {
  playerId: string;
  gold: number;
  cargo: { Pepper: number; Cardamom: number };
  currentPortId: string | null;
  log: string[];
  gameMode: string;
  completedAt?: string | null;
  goalReached?: boolean;
  gameId?: number;
}

export async function apiSave(payload: SavePayload): Promise<{ ok: boolean; gameId?: number; createdAt?: string; updated?: boolean }> {
  const res = await fetch(API_BASE + "/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || res.statusText);
  }
  return res.json();
}

export interface ProgressSnapshot {
  id: number;
  gold: number;
  cargo: { Pepper: number; Cardamom: number };
  currentPortId: string | null;
  log: string[];
  gameMode: string;
  createdAt: string;
  updatedAt: string;
}

export async function apiGetProgress(): Promise<ProgressSnapshot | null> {
  const playerId = getPlayerId();
  const res = await fetch(API_BASE + "/progress?playerId=" + encodeURIComponent(playerId));
  if (!res.ok) throw new Error("Failed to load progress");
  const data = await res.json();
  return (data as { progress: ProgressSnapshot | null }).progress ?? null;
}

export interface HistoryEntry {
  id: number;
  gold: number;
  cargo: { Pepper: number; Cardamom: number };
  currentPortId: string | null;
  gameMode: string;
  goalReached: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function apiGetHistory(limit?: number): Promise<HistoryEntry[]> {
  const playerId = getPlayerId();
  let url = API_BASE + "/history?playerId=" + encodeURIComponent(playerId);
  if (limit != null) url += "&limit=" + limit;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load history");
  const data = await res.json();
  return (data as { history: HistoryEntry[] }).history ?? [];
}
