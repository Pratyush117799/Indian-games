const { query } = require('../config/db');
const { v4: uuid } = require('uuid');

const MAP_ORDER = ['mumbai','delhi','himalaya','rajasthan','chennai'];

async function createOrGet({ username, displayName, carColor }) {
  const id = uuid();
  const { rows } = await query(
    `INSERT INTO players (id,username,display_name,car_color) VALUES ($1,$2,$3,$4)
     ON CONFLICT (username) DO UPDATE SET last_seen=NOW(),display_name=COALESCE($3,players.display_name)
     RETURNING id,username,display_name,car_color,total_races,total_wins,best_speed,unlocked_maps,unlocked_modes`,
    [id, username.trim(), displayName||username.trim(), carColor||'#e74c3c']
  );
  return rows[0];
}

async function getPlayer(id) {
  const { rows } = await query(
    `SELECT id,username,display_name,car_color,total_races,total_wins,best_speed,
            near_misses,police_escaped,crashes,total_dist_m,unlocked_maps,unlocked_modes
     FROM players WHERE id=$1`, [id]
  );
  return rows[0]||null;
}

async function recordRaceStats({ playerId, distM, maxSpeed, nearMisses, policeEscaped, crashes, won }) {
  await query(
    `UPDATE players SET total_races=total_races+1,total_wins=total_wins+$2,
       total_dist_m=total_dist_m+$3,best_speed=GREATEST(best_speed,$4),
       near_misses=near_misses+$5,police_escaped=police_escaped+$6,
       crashes=crashes+$7,last_seen=NOW() WHERE id=$1`,
    [playerId, won?1:0, distM, maxSpeed, nearMisses, policeEscaped, crashes]
  );
}

async function updateProgress({ playerId, mapId, mode, completed, timeMs, score }) {
  await query(
    `INSERT INTO player_progress (player_id,map_id,mode,completed,best_time_ms,best_score,attempts,first_cleared)
     VALUES ($1,$2,$3,$4,$5,$6,1,$7)
     ON CONFLICT (player_id,map_id,mode) DO UPDATE SET
       completed=GREATEST(player_progress.completed,EXCLUDED.completed),
       best_time_ms=CASE WHEN EXCLUDED.best_time_ms IS NOT NULL AND
         (player_progress.best_time_ms IS NULL OR EXCLUDED.best_time_ms<player_progress.best_time_ms)
         THEN EXCLUDED.best_time_ms ELSE player_progress.best_time_ms END,
       best_score=GREATEST(player_progress.best_score,EXCLUDED.best_score),
       attempts=player_progress.attempts+1,
       first_cleared=CASE WHEN player_progress.first_cleared IS NULL AND EXCLUDED.completed THEN NOW() ELSE player_progress.first_cleared END`,
    [playerId, mapId, mode, completed, timeMs||null, score||0, completed?new Date().toISOString():null]
  );
  if (completed) {
    const idx = MAP_ORDER.indexOf(mapId);
    if (idx>=0 && idx<MAP_ORDER.length-1) {
      const next = MAP_ORDER[idx+1];
      await query(`UPDATE players SET unlocked_maps=CASE WHEN NOT(unlocked_maps@>$2::jsonb) THEN unlocked_maps||$2::jsonb ELSE unlocked_maps END WHERE id=$1`,
        [playerId, JSON.stringify([next])]);
    }
    if (idx===MAP_ORDER.length-1) {
      await query(`UPDATE players SET unlocked_modes=unlocked_modes||'["topdown"]'::jsonb WHERE id=$1 AND NOT(unlocked_modes@>'["topdown"]')`, [playerId]);
    }
  }
}

module.exports = { createOrGet, getPlayer, recordRaceStats, updateProgress };
