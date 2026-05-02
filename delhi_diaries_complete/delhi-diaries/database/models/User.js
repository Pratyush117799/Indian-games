'use strict';
const bcrypt = require('bcryptjs');

class UserModel {
  constructor(pool) { this.pool = pool; }

  async create(username, password) {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await this.pool.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2) RETURNING id, username, created_at`,
      [username, hash]
    );
    return rows[0];
  }

  async findByUsername(username) {
    const { rows } = await this.pool.query(
      'SELECT * FROM users WHERE username = $1', [username]
    );
    return rows[0] || null;
  }

  async findById(id) {
    const { rows } = await this.pool.query(
      'SELECT id, username, created_at, last_login FROM users WHERE id = $1', [id]
    );
    return rows[0] || null;
  }

  async updateLastLogin(id) {
    await this.pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1', [id]
    );
  }

  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = UserModel;
