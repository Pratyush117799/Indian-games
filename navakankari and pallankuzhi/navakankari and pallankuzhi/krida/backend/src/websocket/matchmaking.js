/**
 * matchmaking.js
 * Queue-based matchmaking for ranked games.
 * Stores waiting players per game type, pairs them when 2 are available.
 */

// queues: { navakankari: [{ socketId, tagId, ts }], pallankuzhi: [...] }
const queues = { navakankari: [], pallankuzhi: [] }

/**
 * Add a player to the matchmaking queue for a game type.
 * Returns a matched pair [p1, p2] or null if still waiting.
 */
export const enqueue = (gameType, player) => {
  const q = queues[gameType]
  if (!q) return null

  // Remove any stale entry for this socket (reconnect case)
  const existing = q.findIndex(p => p.socketId === player.socketId)
  if (existing !== -1) q.splice(existing, 1)

  q.push({ ...player, ts: Date.now() })

  if (q.length >= 2) {
    const p1 = q.shift()
    const p2 = q.shift()
    return [p1, p2]
  }
  return null
}

/**
 * Remove a player from all queues (on disconnect).
 */
export const dequeue = (socketId) => {
  for (const q of Object.values(queues)) {
    const idx = q.findIndex(p => p.socketId === socketId)
    if (idx !== -1) q.splice(idx, 1)
  }
}

/**
 * Return current queue lengths for monitoring.
 */
export const queueStats = () =>
  Object.fromEntries(
    Object.entries(queues).map(([k, v]) => [k, v.length])
  )
