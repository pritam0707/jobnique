const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  uploadResume,
  deleteResume, // 👈 Added import
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getCurrentUser);
router.put("/profile", isAuthenticated, updateProfile);
router.post("/upload-resume", isAuthenticated, uploadResume);
router.delete("/delete-resume", isAuthenticated, deleteResume); // 👈 Added route

module.exports = router;