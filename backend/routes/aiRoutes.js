const express = require("express");
const {
  chatAssistant,
  analyzeResume,
  recommendJobs,
  generateQuestions,
  evaluateAnswer,
} = require("../controllers/aiController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

// Chat is open to any logged-in user (job seeker or employer)
router.post("/chat", isAuthenticated, chatAssistant);

// Resume analysis & recommendations
router.post("/analyze-resume", isAuthenticated, analyzeResume);
router.post("/recommend-jobs", isAuthenticated, recommendJobs);

// Interview Prep Kit (Groq AI)
router.post("/generate-questions", isAuthenticated, generateQuestions);
router.post("/evaluate-answer", isAuthenticated, evaluateAnswer);

module.exports = router;