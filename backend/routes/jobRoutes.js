const express = require("express");
const router = express.Router();
const {
  postJob,
  getAllJobs,
  getSingleJob,
  getEmployerJobs,
  updateJob,
  deleteJob,
  toggleSaveJob // <--- Add this import
} = require("../controllers/jobController");
const { isAuthenticated } = require("../middlewares/auth");

// Public & Job Seeker Routes
router.get("/", getAllJobs);
router.get("/single/:id", getSingleJob);
router.get("/getsingle/:id", getSingleJob);
router.get("/:id", getSingleJob);

// Bookmark / Save Job Route
router.post("/save/:id", isAuthenticated, toggleSaveJob);

// Employer Routes
router.post("/", isAuthenticated, postJob);
router.get("/getmyjobs", isAuthenticated, getEmployerJobs);
router.put("/update/:id", isAuthenticated, updateJob);
router.delete("/delete/:id", isAuthenticated, deleteJob);

module.exports = router;