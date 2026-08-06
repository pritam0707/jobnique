const express = require("express");
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.post("/:jobId/apply", isAuthenticated, authorizeRoles("Job Seeker"), applyToJob);
router.get("/my-applications", isAuthenticated, authorizeRoles("Job Seeker"), getMyApplications);
router.get("/job/:jobId", isAuthenticated, authorizeRoles("Employer"), getJobApplications);
router.put("/:id/status", isAuthenticated, authorizeRoles("Employer"), updateApplicationStatus);

module.exports = router;
