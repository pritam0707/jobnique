const { Job, User } = require("../models");

// Post a new job posting (Employers only)
exports.postJob = async (req, res, next) => {
  try {
    if (req.user.role !== "Employer") {
      return res.status(403).json({ success: false, message: "Only employers can post jobs" });
    }

    const {
      title,
      description,
      category,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
    } = req.body;

    if (!title || !description || !category || !country || !city) {
      return res.status(400).json({ success: false, message: "Please provide all required job details" });
    }

    if ((!fixedSalary && (!salaryFrom || !salaryTo)) && (fixedSalary && (salaryFrom || salaryTo))) {
      return res.status(400).json({
        success: false,
        message: "Provide either a fixed salary or a salary range, not both",
      });
    }

    const job = await Job.create({
      title,
      description,
      category,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
      postedBy: req.user.id,
    });

    res.status(201).json({ success: true, message: "Job posted successfully", job });
  } catch (error) {
    next(error);
  }
};

// Get all active job listings
exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({
      where: { expired: false },
      include: [{ model: User, as: "employer", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

// Get details for a single job
exports.getSingleJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{ model: User, as: "employer", attributes: ["id", "name", "email"] }],
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// Get all jobs posted by the currently logged-in employer
exports.getEmployerJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({
      where: { postedBy: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

// Update an existing job listing
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.postedBy !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this job" });
    }

    await job.update(req.body);

    res.status(200).json({ success: true, message: "Job updated successfully", job });
  } catch (error) {
    next(error);
  }
};

// Delete a job listing
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.postedBy !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this job" });
    }

    await job.destroy();

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Toggle Save / Unsave a job for the logged-in user
exports.toggleSaveJob = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const jobId = req.params.id;

    // Handle initial state if savedJobs is null or stringified JSON
    let savedJobs = user.savedJobs || [];
    if (typeof savedJobs === "string") {
      savedJobs = JSON.parse(savedJobs);
    }

    const jobIndex = savedJobs.indexOf(jobId);

    if (jobIndex > -1) {
      // Remove from saved jobs if already present
      savedJobs.splice(jobIndex, 1);
    } else {
      // Add to saved jobs if not present
      savedJobs.push(jobId);
    }

    user.savedJobs = savedJobs;
    await user.save();

    res.status(200).json({
      success: true,
      message: jobIndex > -1 ? "Job removed from saved items" : "Job saved successfully",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    next(error);
  }
};