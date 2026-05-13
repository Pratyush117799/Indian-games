const express = require("express");
const { getFestivalLeaderboard, getGlobalLeaderboard } = require("../controllers/leaderboardController");
const router = express.Router();
router.get("/global",    getGlobalLeaderboard);
router.get("/:festival", getFestivalLeaderboard);
module.exports = router;
