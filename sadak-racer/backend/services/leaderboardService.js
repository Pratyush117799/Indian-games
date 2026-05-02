const { query } = require('../config/db');

async function getGlobal(limit=50) {
  const {rows} = await query(`SELECT id,username,display_name,car_color,total_races,total_wins,best_speed,win_pct,rank FROM leaderboard_global LIMIT $1`,[limit]);
  return rows;
}

async function getByMap(mapId, mode='side', limit=20) {
  const {rows} = await query(`SELECT player_id,username,display_name,car_color,best_time_ms,best_score,top_speed,rank FROM leaderboard_by_map WHERE map_id=$1 AND mode=$2 ORDER BY rank ASC LIMIT $3`,[mapId,mode,limit]);
  return rows;
}

async function submitRace({playerId,mapId,mode,completed,timeMs,distM,maxSpeed,avgSpeed,damage,nearMisses,policeEscaped,crashes,score,position}) {
  const {rows} = await query(
    `INSERT INTO race_results (player_id,map_id,mode,completed,time_ms,distance_m,max_speed_kph,avg_speed_kph,damage_taken,near_misses,police_escaped,crashes,score,position)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
    [playerId,mapId,mode,completed,timeMs||null,distM,maxSpeed,avgSpeed,damage,nearMisses,policeEscaped,crashes,score,position||null]
  );
  return rows[0]?.id;
}

module.exports = { getGlobal, getByMap, submitRace };
