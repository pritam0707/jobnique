const { Application, Job, User } = require("../models");

exports.applyToJob = async (req, res, next) => {
  try {
    if (req.user.role !== "Job Seeker") {
      return res.status(403).json({ success: false, message: "Only job seekers can apply to jobs" });
    }

    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const existing = await Application.findOne({
      where: { jobId, applicantId: req.user.id },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already applied to this job" });
    }

    const application = await Application.create({
      jobId,
      applicantId: req.user.id,
      resumeUrl: req.user.resumeUrl || null,
      coverLetter,
    });

    res.status(201).json({ success: true, message: "Application submitted successfully", application });
  } catch (error) {
    next(error);
  }
};

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

    // Explicit string conversion prevents type comparison failure (e.g. 1 !== "1")
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