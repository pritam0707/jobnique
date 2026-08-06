const { Job } = require("../models");
const { groqChat } = require("../utils/groqClient");

// General AI career/job assistant chat.
exports.chatAssistant = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const systemPrompt = {
      role: "system",
      content:
        "You are the Jobnique AI Assistant, a helpful career and recruitment assistant embedded in a job portal called Jobnique. " +
        "Help users with career advice, interview prep, resume tips, and questions about using the platform (searching jobs, applying, posting jobs as an employer). " +
        "Keep answers concise and practical.",
    };

    const priorMessages = Array.isArray(history)
      ? history.slice(-10).map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content || "").slice(0, 2000),
        }))
      : [];

    const messages = [systemPrompt, ...priorMessages, { role: "user", content: message }];

    const reply = await groqChat(messages);

    res.status(200).json({ success: true, reply });
  } catch (error) {
    next(error);
  }
};

// Analyze a job seeker's resume text and return structured feedback.
exports.analyzeResume = async (req, res, next) => {
  try {
    const resumeText = req.body.resumeText || req.user.resumeText;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "No resume text found. Upload a resume first or paste your resume text.",
      });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are an expert resume reviewer. Given a resume's text, provide constructive feedback in this exact structure:\n" +
          "1. **Strengths** (2-4 bullet points)\n" +
          "2. **Areas to Improve** (2-4 bullet points)\n" +
          "3. **Suggested Keywords/Skills to Add** (short list, if relevant)\n" +
          "4. **Overall Score** (out of 10, with a one-line justification)\n" +
          "Be specific and actionable, not generic.",
      },
      { role: "user", content: resumeText.slice(0, 8000) },
    ];

    const feedback = await groqChat(messages, { temperature: 0.4, max_tokens: 900 });

    res.status(200).json({ success: true, feedback });
  } catch (error) {
    next(error);
  }
};

// Recommend the best-matching open jobs for a job seeker based on their resume text.
exports.recommendJobs = async (req, res, next) => {
  try {
    const resumeText = req.body.resumeText || req.user.resumeText;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "No resume text found. Upload a resume first to get recommendations.",
      });
    }

    const jobs = await Job.findAll({
      where: { expired: false },
      attributes: ["id", "title", "description", "category", "city", "country"],
      limit: 30,
      order: [["createdAt", "DESC"]],
    });

    if (jobs.length === 0) {
      return res.status(200).json({ success: true, recommendations: [] });
    }

    const jobList = jobs
      .map((j) => `ID:${j.id} | ${j.title} | ${j.category} | ${j.city}, ${j.country}\n${j.description.slice(0, 300)}`)
      .join("\n---\n");

    const messages = [
      {
        role: "system",
        content:
          "You are a job-matching engine. Given a candidate's resume and a list of open jobs (each with an ID), " +
          "return ONLY a JSON array (no markdown, no prose) of the top matches, best first, max 5 items, in this exact format: " +
          '[{"id": <job id as number>, "reason": "<one short sentence why it fits>"}]. ' +
          "Only include jobs that are genuinely relevant based on skills/experience implied by the resume.",
      },
      {
        role: "user",
        content: `RESUME:\n${resumeText.slice(0, 4000)}\n\nOPEN JOBS:\n${jobList}`,
      },
    ];

    const raw = await groqChat(messages, { temperature: 0.3, max_tokens: 700 });

    let parsed = [];
    try {
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch (e) {
      return res.status(200).json({ success: true, recommendations: [], raw });
    }

    const jobsById = Object.fromEntries(jobs.map((j) => [j.id, j]));
    const recommendations = parsed
      .filter((r) => jobsById[r.id])
      .map((r) => ({ job: jobsById[r.id], reason: r.reason }));

    res.status(200).json({ success: true, recommendations });
  } catch (error) {
    next(error);
  }
};
