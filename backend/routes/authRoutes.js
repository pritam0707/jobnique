const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  uploadResume,
  deleteResume,
  forgotPassword, // 👈 Added
  resetPassword,  // 👈 Added
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

// Public Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword); // 👈 Added route for forgot password
router.post("/reset-password/:token", resetPassword); // 👈 Added route for reset password

// Protected Routes (Require Authentication)
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getCurrentUser);
router.put("/profile", isAuthenticated, updateProfile);
router.post("/upload-resume", isAuthenticated, uploadResume);
router.delete("/delete-resume", isAuthenticated, deleteResume);

module.exports = router;