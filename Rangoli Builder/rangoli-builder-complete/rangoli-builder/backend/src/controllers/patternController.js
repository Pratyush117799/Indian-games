// backend/src/controllers/patternController.js
const Pattern = require("../models/Pattern");

// GET /api/patterns  (public, filterable)
async function listPatterns(req, res, next) {
  try {
    const { festival, difficulty, official, page = 1, limit = 20 } = req.query;
    const query = { isPublic: true };
    if (festival)   query.festival   = festival;
    if (difficulty) query.difficulty = difficulty;
    if (official)   query.isOfficial = official === "true";

    const [patterns, total] = await Promise.all([
      Pattern.find(query)
        .sort({ likes: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("authorId", "username avatar"),
      Pattern.countDocuments(query),
    ]);

    res.json({ patterns, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
}

// GET /api/patterns/:id
async function getPattern(req, res, next) {
  try {
    const p = await Pattern.findById(req.params.id).populate("authorId", "username avatar");
    if (!p) return res.status(404).json({ error: "Pattern not found" });
    p.completions += 1;
    await p.save();
    res.json(p);
  } catch (err) { next(err); }
}

// POST /api/patterns
async function createPattern(req, res, next) {
  try {
    const { title, festival, difficulty, symmetryAxes, tiles, isPublic, tags, estimatedTime } = req.body;
    if (!tiles?.length) return res.status(400).json({ error: "tiles array is required" });

    const pattern = await Pattern.create({
      title, festival, difficulty, symmetryAxes, tiles,
      isPublic: isPublic !== false,
      tags:     tags || [],
      estimatedTime: estimatedTime || 300,
      authorId: req.user._id,
    });
    res.status(201).json(pattern);
  } catch (err) { next(err); }
}

// PUT /api/patterns/:id
async function updatePattern(req, res, next) {
  try {
    const p = await Pattern.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Pattern not found" });
    if (!p.authorId.equals(req.user._id))
      return res.status(403).json({ error: "Not your pattern" });

    const allowed = ["title","isPublic","tags","estimatedTime"];
    allowed.forEach(k => { if (req.body[k] !== undefined) p[k] = req.body[k]; });
    await p.save();
    res.json(p);
  } catch (err) { next(err); }
}

// DELETE /api/patterns/:id
async function deletePattern(req, res, next) {
  try {
    const p = await Pattern.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Pattern not found" });
    if (!p.authorId.equals(req.user._id) && !req.user.isAdmin)
      return res.status(403).json({ error: "Not your pattern" });
    await p.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) { next(err); }
}

// POST /api/patterns/:id/like
async function toggleLike(req, res, next) {
  try {
    const p      = await Pattern.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Pattern not found" });
    const uid    = req.user._id;
    const liked  = p.likedBy.includes(uid);
    if (liked) {
      p.likedBy = p.likedBy.filter(id => !id.equals(uid));
      p.likes   = Math.max(0, p.likes - 1);
    } else {
      p.likedBy.push(uid);
      p.likes += 1;
    }
    await p.save();
    res.json({ likes: p.likes, liked: !liked });
  } catch (err) { next(err); }
}

module.exports = { listPatterns, getPattern, createPattern, updatePattern, deletePattern, toggleLike };
