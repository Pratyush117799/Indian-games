// backend/src/middleware/authMiddleware.js
const jwt  = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(payload.id).select("-passwordHash -refreshToken");
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Optional auth — attaches user if token present, continues regardless
async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return next();
  try {
    const token   = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user      = await User.findById(payload.id).select("-passwordHash -refreshToken");
  } catch { /* ignore */ }
  next();
}

module.exports = { protect, optionalAuth };
