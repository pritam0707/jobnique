const fs = require("fs");
const path = require("path");
const { Application, Job, User } = require("../models");

// ==========================================
// Apply to a Job (Job Seekers only)
// ==========================================
exports.applyToJob = async (req, res, next) => {
  try {
    if (req.user.role !== "Job Seeker") {
      return res.status(403).json({ success: false, message: "Only job seekers can apply to jobs" });
    }

    const { jobId } = req.params;
    const { coverLetter } = req.body;

    let resumeUrl = req.body.resumeUrl || null;

    // 1. Check if a PDF file was uploaded via express-fileupload
    if (req.files && req.files.resume) {
      const file = req.files.resume;

      // Validate PDF MIME type and file extension
      const isPdf =
        file.mimetype === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPdf) {
        return res.status(400).json({
          success: false,
          message: "Please upload a valid PDF document (.pdf)",
        });
      }

      // Ensure upload directory exists: backend/uploads/resumes
      const uploadDir = path.join(__dirname, "../uploads/resumes");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Generate a unique, web-safe filename
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueFileName = `${Date.now()}_${cleanFileName}`;
      const savePath = path.join(uploadDir, uniqueFileName);

      // Move uploaded file from temp storage to the permanent uploads folder
      await file.mv(savePath);

      // Store relative path for static serving
      resumeUrl = `/uploads/resumes/${uniqueFileName}`;
    }

    // 2. Validate Job Existence
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // 3. Prevent duplicate applications
    const existing = await Application.findOne({
      where: { jobId, applicantId: req.user.id },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already applied to this job" });
    }

    // 4. Create Application record
    const application = await Application.create({
      jobId,
      applicantId: req.user.id,
      resumeUrl: resumeUrl || req.user.resumeUrl || null,
      coverLetter,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Logged-in User's Applications
// ==========================================
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      where: { applicantId: req.user.id },
      include: [{ model: Job, as: "job" }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get All Applications for a Specific Job
// ==========================================
exports.getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (String(job.postedBy) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Not authorized to view these applications" });
    }

    const applications = await Application.findAll({
      where: { jobId },
      include: [{ model: User, as: "applicant", attributes: ["id", "name", "email", "phone", "resumeUrl"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Application Status (Accept / Reject / Hire)
// ==========================================
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appId = req.params.id || req.params.applicationId;

    const validStatuses = ["Pending", "Reviewed", "Accepted", "Rejected", "Hired"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const application = await Application.findByPk(appId, {
      include: [{ model: Job, as: "job" }],
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.job && String(application.job.postedBy) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, message: `Application status updated to ${status}`, application });
  } catch (error) {
    next(error);
  }
};