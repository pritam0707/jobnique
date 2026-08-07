const express = require("express");
const router = express.Router();
const {
  postJob,
  getAllJobs,
  getSingleJob,
  getEmployerJobs,
  updateJob,
  deleteJob,
  toggleSaveJob,
} = require("../controllers/jobController");
const { isAuthenticated } = require("../middlewares/auth");

// 1. PUBLIC / LISTING ROUTES
router.get("/", getAllJobs);
router.get("/getall", getAllJobs);

// 2. EMPLOYER SPECIFIC NAMED ROUTES (MUST BE BEFORE REQ.PARAMS /:id)
router.get("/employer/my-jobs", isAuthenticated, getEmployerJobs);
router.get("/getmyjobs", isAuthenticated, getEmployerJobs);
router.post("/post", isAuthenticated, postJob);
router.post("/", isAuthenticated, postJob);

// 3. BOOKMARK / SAVE ROUTE
router.post("/save/:id", isAuthenticated, toggleSaveJob);

// 4. DYNAMIC SINGLE JOB & UPDATE / DELETE ROUTES (Handles /5, /single/5, etc.)
router.get("/single/:id", getSingleJob);
router.get("/getsingle/:id", getSingleJob);
router.get("/:id", getSingleJob); // Handles GET /api/v1/jobs/5

router.put("/update/:id", isAuthenticated, updateJob);
router.put("/:id", isAuthenticated, updateJob); // Handles PUT /api/v1/jobs/5

router.delete("/delete/:id", isAuthenticated, deleteJob);
router.delete("/:id", isAuthenticated, deleteJob); // Handles DELETE /api/v1/jobs/5

module.exports = router;