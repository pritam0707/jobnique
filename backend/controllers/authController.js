const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { User, Job } = require("../models");
const sendToken = require("../utils/sendToken");

// Helper function to safely parse savedJobIds and fetch populated Job objects
const getPopulatedSavedJobs = async (userSavedJobs) => {
  let savedJobIds = userSavedJobs || [];

  if (typeof savedJobIds === "string") {
    try {
      savedJobIds = JSON.parse(savedJobIds);
    } catch (e) {
      savedJobIds = savedJobIds.split(",");
    }
  }

  if (!Array.isArray(savedJobIds) || savedJobIds.length === 0) {
    return [];
  }

  // Clean IDs of accidental extra quotes or whitespace
  const cleanIds = savedJobIds
    .map((item) => {
      let strId = typeof item === "object" && item !== null ? item.id || item._id : item;
      return String(strId).replace(/^["']|["']$/g, "").trim();
    })
    .filter(Boolean);

  if (cleanIds.length === 0) return [];

  return await Job.findAll({
    where: { id: cleanIds },
    include: [{ model: User, as: "employer", attributes: ["name", "email"] }],
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, companyName, designation } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Please fill all required fields" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      companyName: companyName || null,
      designation: designation || null,
    });

    // Pass the Sequelize 'user' model instance directly so user.getJWTToken() works
    await sendToken(user, 201, res, "User registered successfully");
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

    // Pass the Sequelize 'user' model instance directly so user.getJWTToken() works
    await sendToken(user, 200, res, "Login successful");
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

// Updated to attach populated savedJobs object array to req.user for Redux sync
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = user.toJSON();
    userData.savedJobs = await getPopulatedSavedJobs(user.savedJobs);

    res.status(200).json({ success: true, user: userData });
  } catch (error) {
    next(error);
  }
};

// Profile update handler saves companyName & designation and returns populated savedJobs
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, companyName, designation } = req.body;

    if (name) req.user.name = name;
    if (phone !== undefined) req.user.phone = phone;
    if (companyName !== undefined) req.user.companyName = companyName;
    if (designation !== undefined) req.user.designation = designation;

    await req.user.save();

    const userData = req.user.toJSON();
    userData.savedJobs = await getPopulatedSavedJobs(req.user.savedJobs);

    res.status(200).json({ success: true, message: "Profile updated successfully", user: userData });
  } catch (error) {
    next(error);
  }
};

// Stores resume locally and extracts plain text for AI processing
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
    req.user.resumeText = resumeText.slice(0, 20000); // Guard against huge files
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

// Delete user's active resume file and clear DB references
exports.deleteResume = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user || !user.resumeUrl) {
      return res.status(404).json({ success: false, message: "No active resume found to delete" });
    }

    // Delete local physical file if present
    if (user.resumeUrl.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", user.resumeUrl);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (fileErr) {
          console.error("Failed to delete local resume file:", fileErr.message);
        }
      }
    }

    // Reset database fields
    user.resumeUrl = null;
    user.resumePublicId = null;
    user.resumeText = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userData = user.toJSON();
    userData.savedJobs = await getPopulatedSavedJobs(user.savedJobs);

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};