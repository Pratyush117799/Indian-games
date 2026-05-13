// backend/src/services/challengeService.js
const cron      = require("node-cron");
const Pattern   = require("../models/Pattern");
const Challenge = require("../models/Challenge");

const FESTIVALS = ["diwali","holi","makar-sankranti","raksha-bandhan",
                   "christmas","onam","navratri","karva-chauth"];

async function createDailyChallenge() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Already exists?
    const existing = await Challenge.findOne({ date: today });
    if (existing) return;

    // Pick festival by day-of-year rotation
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const festival  = FESTIVALS[dayOfYear % FESTIVALS.length];

    // Pick a random official medium pattern for this festival
    const patterns = await Pattern.find({ festival, isOfficial: true, difficulty: "medium" });
    if (!patterns.length) {
      console.warn(`No official patterns for ${festival} — skipping daily challenge`);
      return;
    }
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    await Challenge.create({
      date:      today,
      festival,
      patternId: pattern._id,
      difficulty:"medium",
      timeLimit: 600,
      bonusXP:   150,
    });
    console.log(`📅 Daily challenge created: ${festival} (${pattern.title})`);
  } catch (err) {
    console.error("challengeService error:", err);
  }
}

// Run at midnight every day
function startChallengeScheduler() {
  cron.schedule("0 0 * * *", createDailyChallenge, { timezone: "Asia/Kolkata" });
  // Also run on startup to ensure today's challenge exists
  createDailyChallenge();
  console.log("📅 Challenge scheduler started");
}

module.exports = { startChallengeScheduler, createDailyChallenge };
