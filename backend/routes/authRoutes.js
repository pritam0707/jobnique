const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  uploadResume,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getCurrentUser);
router.put("/profile", isAuthenticated, updateProfile);
router.post("/upload-resume", isAuthenticated, uploadResume);

module.exports = router;
