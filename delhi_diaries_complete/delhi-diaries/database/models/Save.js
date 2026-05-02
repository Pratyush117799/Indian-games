'use strict';

class SaveModel {
  constructor(pool) { this.pool = pool; }

  async save(userId, gameState) {
    const { rows } = await this.pool.query(
      `INSERT INTO saves (user_id, game_state, saved_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET game_state = $2, saved_at = NOW()
       RETURNING id, saved_at`,
      [userId, JSON.stringify(gameState)]
    );
    return rows[0];
  }

  async load(userId) {
    const { rows } = await this.pool.query(
      'SELECT game_state, saved_at FROM saves WHERE user_id = $1', [userId]
    );
    return rows[0] || null;
  }

  async delete(userId) {
    await this.pool.query('DELETE FROM saves WHERE user_id = $1', [userId]);
  }

  async leaderboard(limit = 10) {
    const { rows } = await this.pool.query(
      `SELECT username, money, level, xp, day, club_score, saved_at
       FROM leaderboard LIMIT $1`, [limit]
    );
    return rows;
  }
}

module.exports = SaveModel;
