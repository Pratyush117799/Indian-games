'use strict';
const express = require('express');
const router  = express.Router();
const UserModel = require('../../database/models/User');
const { signToken } = require('../middleware/auth');

const getUser = req => new UserModel(req.app.locals.pool);

/* POST /api/auth/register */
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });
  if (username.length < 3 || username.length > 32)
    return res.status(400).json({ error: 'Username must be 3–32 characters' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return res.status(400).json({ error: 'Username: letters, numbers, underscore only' });

  try {
    const existing = await getUser(req).findByUsername(username);
    if (existing) return res.status(409).json({ error: 'Username already taken' });
    const user = await getUser(req).create(username, password);
    const token = signToken({ id: user.id, username: user.username });
    res.status(201).json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/* POST /api/auth/login */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  try {
    const userModel = getUser(req);
    const user = await userModel.findByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await userModel.verifyPassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    await userModel.updateLastLogin(user.id);
    const token = signToken({ id: user.id, username: user.username });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
