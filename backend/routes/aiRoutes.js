const express = require("express");
const { chatAssistant, analyzeResume, recommendJobs } = require("../controllers/aiController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

// Chat is open to any logged-in user (job seeker or employer)
router.post("/chat", isAuthenticated, chatAssistant);

// Resume analysis & recommendations are job-seeker focused, but we don't hard-block
// employers testing it out — controller just needs resumeText from body or profile.
router.post("/analyze-resume", isAuthenticated, analyzeResume);
router.post("/recommend-jobs", isAuthenticated, recommendJobs);

module.exports = router;
