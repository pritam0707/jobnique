const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { User, Job } = require("../models");
const sendToken = require("../utils/sendToken");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, phone, role });

    sendToken(user, 201, res, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "Please provide email, password, and role" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (user.role !== role) {
      return res.status(401).json({ success: false, message: `No ${role} account found with this email` });
    }

    sendToken(user, 200, res, "Login successful");
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res
      .status(200)
      .cookie("token", "", { expires: new Date(Date.now()), httpOnly: true })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (name) req.user.name = name;
    if (phone !== undefined) req.user.phone = phone;

    await req.user.save();

    res.status(200).json({ success: true, message: "Profile updated", user: req.user });
  } catch (error) {
    next(error);
  }
};

// Stores the resume locally on disk (backend/uploads/resumes) — no external
// storage service or extra API key required. Extracts plain text from PDF/TXT
// files so the AI resume-analysis and job-recommendation features have
// something to read.
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ success: false, message: "Please attach a resume file" });
    }

    const file = req.files.resume;
    const allowedExt = [".pdf", ".txt"];
    const ext = path.extname(file.name).toLowerCase();

    if (!allowedExt.includes(ext)) {
      return res.status(400).json({
        success: false,
        message: "Only PDF or TXT resumes are supported",
      });
    }

    const uploadsDir = path.join(__dirname, "..", "uploads", "resumes");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${req.user.id}-${Date.now()}${ext}`;
    const destPath = path.join(uploadsDir, fileName);

    await file.mv(destPath);

    // Extract plain text for AI features
    let resumeText = "";
    try {
      if (ext === ".pdf") {
        const dataBuffer = fs.readFileSync(destPath);
        const parsed = await pdfParse(dataBuffer);
        resumeText = parsed.text;
      } else {
        resumeText = fs.readFileSync(destPath, "utf-8");
      }
    } catch (parseErr) {
      console.error("Resume text extraction failed:", parseErr.message);
    }

    req.user.resumeUrl = `/uploads/resumes/${fileName}`;
    req.user.resumeText = resumeText.slice(0, 20000); // guard against huge files
    await req.user.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resumeUrl: req.user.resumeUrl,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Parse array if stored as string JSON in DB
    let savedJobIds = user.savedJobs || [];
    if (typeof savedJobIds === "string") {
      try {
        savedJobIds = JSON.parse(savedJobIds);
      } catch (e) {
        savedJobIds = [];
      }
    }

    // Fetch details for bookmarked jobs
    const savedJobs = await Job.findAll({
      where: { id: savedJobIds },
      include: [{ model: User, as: "employer", attributes: ["name", "email"] }]
    });

    const userData = user.toJSON();
    userData.savedJobs = savedJobs; // Attach populated job objects

    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    next(error);
  }
};
