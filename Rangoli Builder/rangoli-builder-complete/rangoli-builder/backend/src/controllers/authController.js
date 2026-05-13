// backend/src/controllers/authController.js
const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const signAccess   = (id) => jwt.sign({ id }, process.env.JWT_SECRET,         { expiresIn: "15m" });
const signRefresh  = (id) => jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d"  });

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "username, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const user          = new User({ username, email, passwordHash: password });
    const refreshToken  = signRefresh(user._id);
    user.refreshToken   = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ accessToken: signAccess(user._id), user: user.toPublic() });
  } catch (err) { next(err); }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid credentials" });

    const refreshToken = signRefresh(user._id);
    user.refreshToken  = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: signAccess(user._id), user: user.toPublic() });
  } catch (err) { next(err); }
}

// POST /api/auth/refresh
async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token" });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user    = await User.findById(payload.id);
    if (!user || user.refreshToken !== token)
      return res.status(401).json({ error: "Invalid refresh token" });

    res.json({ accessToken: signAccess(user._id) });
  } catch (err) { next(err); }
}

// POST /api/auth/logout
async function logout(req, res, next) {
  try {
    if (req.user) {
      req.user.refreshToken = null;
      await req.user.save();
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) { next(err); }
}

module.exports = { register, login, refresh, logout };
