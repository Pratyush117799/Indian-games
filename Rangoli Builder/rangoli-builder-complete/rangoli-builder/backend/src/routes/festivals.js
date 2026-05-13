const express   = require("express");
const Pattern   = require("../models/Pattern");
const Challenge = require("../models/Challenge");
const router    = express.Router();

// GET /api/festivals
router.get("/", (_req, res) => {
  res.json(["diwali","holi","makar-sankranti","raksha-bandhan",
            "christmas","onam","navratri","karva-chauth"]);
});

// GET /api/festivals/:slug/patterns
router.get("/:slug/patterns", async (req, res, next) => {
  try {
    const patterns = await Pattern.find({ festival: req.params.slug, isPublic: true })
      .sort({ isOfficial: -1, likes: -1 }).limit(50);
    res.json(patterns);
  } catch (err) { next(err); }
});

// GET /api/challenges/today
router.get("/challenges/today", async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const challenge = await Challenge.findOne({ date: today }).populate("patternId");
    res.json(challenge || null);
  } catch (err) { next(err); }
});

module.exports = router;
