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
      include: [
        { 
          model: User, 
          as: "employer", 
          attributes: ["id", "name", "email", "companyName", "designation"] 
        }
      ],
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
      include: [
        { 
          model: User, 
          as: "employer", 
          attributes: ["id", "name", "email", "companyName", "designation"] 
        }
      ],
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
      include: [
        { 
          model: User, 
          as: "employer", 
          attributes: ["id", "name", "email", "companyName", "designation"] 
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    // Map companyName dynamically if present on employer relation
    const formattedJobs = jobs.map((job) => {
      const jobJson = job.toJSON();
      return {
        ...jobJson,
        companyName: jobJson.companyName || jobJson.employer?.companyName || req.user.companyName || "Your Company",
      };
    });

    res.status(200).json({ success: true, count: formattedJobs.length, jobs: formattedJobs });
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

    if (String(job.postedBy) !== String(req.user.id)) {
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

    if (String(job.postedBy) !== String(req.user.id)) {
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

    let savedJobs = user.savedJobs || [];
    if (typeof savedJobs === "string") {
      try {
        savedJobs = JSON.parse(savedJobs);
      } catch (e) {
        savedJobs = [];
      }
    }

    const jobIndex = savedJobs.indexOf(jobId);

    if (jobIndex > -1) {
      savedJobs.splice(jobIndex, 1);
    } else {
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