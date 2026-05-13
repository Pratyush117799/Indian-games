// game.js
const express = require("express");
const { submitSession, getSessions } = require("../controllers/gameController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/submit",  protect, submitSession);
router.get("/sessions", protect, getSessions);
module.exports = router;
