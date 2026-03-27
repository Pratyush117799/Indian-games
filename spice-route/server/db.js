import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "spice-route.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT NOT NULL,
    gold INTEGER NOT NULL,
    cargo_pepper INTEGER NOT NULL DEFAULT 0,
    cargo_cardamom INTEGER NOT NULL DEFAULT 0,
    current_port_id TEXT,
    log_json TEXT NOT NULL DEFAULT '[]',
    game_mode TEXT NOT NULL,
    completed_at TEXT,
    goal_reached INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_games_player ON games(player_id);
  CREATE INDEX IF NOT EXISTS idx_games_created ON games(created_at DESC);
`);

export function saveGame(data) {
  const { playerId, gold, cargo, currentPortId, log, gameMode, completedAt, goalReached } = data;
  const logJson = JSON.stringify(log ?? []);
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO games (player_id, gold, cargo_pepper, cargo_cardamom, current_port_id, log_json, game_mode, completed_at, goal_reached, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    playerId,
    gold ?? 0,
    (cargo && cargo.Pepper) ?? 0,
    (cargo && cargo.Cardamom) ?? 0,
    currentPortId ?? null,
    logJson,
    gameMode ?? "practice",
    completedAt ?? null,
    goalReached ? 1 : 0,
    now,
    now
  );
  return { id: result.lastInsertRowid, createdAt: now };
}

export function updateGame(id, data) {
  const { gold, cargo, currentPortId, log, completedAt, goalReached } = data;
  const logJson = log ? JSON.stringify(log) : undefined;
  const now = new Date().toISOString();
  const updates = [];
  const values = [];
  if (gold !== undefined) { updates.push("gold = ?"); values.push(gold); }
  if (cargo !== undefined) {
    updates.push("cargo_pepper = ?", "cargo_cardamom = ?");
    values.push(cargo.Pepper ?? 0, cargo.Cardamom ?? 0);
  }
  if (currentPortId !== undefined) { updates.push("current_port_id = ?"); values.push(currentPortId); }
  if (logJson !== undefined) { updates.push("log_json = ?"); values.push(logJson); }
  if (completedAt !== undefined) { updates.push("completed_at = ?"); values.push(completedAt); }
  if (goalReached !== undefined) { updates.push("goal_reached = ?"); values.push(goalReached ? 1 : 0); }
  updates.push("updated_at = ?");
  values.push(now);
  values.push(id);
  const stmt = db.prepare(`UPDATE games SET ${updates.join(", ")} WHERE id = ?`);
  stmt.run(...values);
  return { updatedAt: now };
}

export function getProgress(playerId) {
  const stmt = db.prepare(`
    SELECT id, gold, cargo_pepper, cargo_cardamom, current_port_id, log_json, game_mode, created_at, updated_at
    FROM games
    WHERE player_id = ? AND completed_at IS NULL
    ORDER BY updated_at DESC
    LIMIT 1
  `);
  const row = stmt.get(playerId);
  if (!row) return null;
  let log = [];
  try {
    log = JSON.parse(row.log_json || "[]");
  } catch (_) {}
  return {
    id: row.id,
    gold: row.gold,
    cargo: { Pepper: row.cargo_pepper, Cardamom: row.cargo_cardamom },
    currentPortId: row.current_port_id,
    log,
    gameMode: row.game_mode,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getHistory(playerId, limit = 50) {
  const stmt = db.prepare(`
    SELECT id, gold, cargo_pepper, cargo_cardamom, current_port_id, game_mode, goal_reached, completed_at, created_at, updated_at
    FROM games
    WHERE player_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);
  const rows = stmt.all(playerId, limit);
  return rows.map((row) => ({
    id: row.id,
    gold: row.gold,
    cargo: { Pepper: row.cargo_pepper, Cardamom: row.cargo_cardamom },
    currentPortId: row.current_port_id,
    gameMode: row.game_mode,
    goalReached: !!row.goal_reached,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export function getGameById(id, playerId) {
  const stmt = db.prepare("SELECT * FROM games WHERE id = ? AND player_id = ?");
  const row = stmt.get(id, playerId);
  if (!row) return null;
  let log = [];
  try {
    log = JSON.parse(row.log_json || "[]");
  } catch (_) {}
  return {
    id: row.id,
    gold: row.gold,
    cargo: { Pepper: row.cargo_pepper, Cardamom: row.cargo_cardamom },
    currentPortId: row.current_port_id,
    log,
    gameMode: row.game_mode,
    goalReached: !!row.goal_reached,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default db;
