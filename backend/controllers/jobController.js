const { Job, User } = require("../models");

// Robust helper to parse savedJobs regardless of DB storage format
const parseSavedJobIds = (rawInput) => {
  if (!rawInput) return [];

  let input = rawInput;

  // Handles double-escaped JSON strings from SQL text columns
  while (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return [];

    try {
      input = JSON.parse(trimmed);
    } catch (e) {
      // Fallback for comma-separated strings like "1,2,3"
      input = trimmed.split(",");
      break;
    }
  }

  if (!Array.isArray(input)) {
    input = [input];
  }

  // Extract clean ID strings, strip quotes, and filter out nulls/empties
  return input
    .map((item) => {
      let strId = "";
      if (typeof item === "object" && item !== null) {
        strId = String(item.id || item._id || "").trim();
      } else {
        strId = String(item).trim();
      }
      // Remove accidental literal quotes e.g. '"1"' -> '1'
      return strId.replace(/^["']|["']$/g, "").trim();
    })
    .filter((id) => id && id !== "null" && id !== "undefined");
};

// Helper function to fetch populated job records
const getPopulatedSavedJobs = async (userSavedJobs) => {
  const cleanIds = parseSavedJobIds(userSavedJobs);

  if (cleanIds.length === 0) return [];

  return await Job.findAll({
    where: { id: cleanIds },
    include: [{ model: User, as: "employer", attributes: ["id", "name", "email", "companyName", "designation"] }],
  });
};

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

    const hasFixed = Boolean(fixedSalary);
    const hasRange = Boolean(salaryFrom || salaryTo);

    if ((!hasFixed && !hasRange) || (hasFixed && hasRange)) {
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
      fixedSalary: fixedSalary || null,
      salaryFrom: salaryFrom || null,
      salaryTo: salaryTo || null,
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

    // Clean and normalize target ID from req.params.id
    const targetJobId = String(req.params.id).replace(/^["']|["']$/g, "").trim();

    // 1. Clean and parse existing IDs
    const existingIds = parseSavedJobIds(user.savedJobs);

    // 2. Loose check to see if target ID exists in saved list
    const isAlreadySaved = existingIds.some((id) => String(id) === targetJobId);

    let updatedSavedIds = [];
    if (isAlreadySaved) {
      // UNSAVE: Remove all instances matching target ID
      updatedSavedIds = existingIds.filter((id) => String(id) !== targetJobId);
    } else {
      // SAVE: Add target ID (ensure uniqueness)
      updatedSavedIds = Array.from(new Set([...existingIds, targetJobId]));
    }

    // 3. Format payload based on column behavior
    const isJsonColumn = Array.isArray(user.savedJobs) || typeof user.savedJobs === "object";
    const valueToSave = isJsonColumn && user.savedJobs !== null
      ? updatedSavedIds
      : JSON.stringify(updatedSavedIds);

    // 4. Force direct DB update to prevent Sequelize instance change-tracking skip on unsave
    await User.update(
      { savedJobs: valueToSave },
      { where: { id: req.user.id } }
    );

    // 5. Retrieve populated job models for Redux/UI state sync
    const populatedSavedJobs = await getPopulatedSavedJobs(updatedSavedIds);

    return res.status(200).json({
      success: true,
      message: isAlreadySaved ? "Job removed from saved items" : "Job saved successfully",
      savedJobs: populatedSavedJobs,
    });
  } catch (error) {
    next(error);
  }
};