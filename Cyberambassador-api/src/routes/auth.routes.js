const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

/**
 * ============================
 * NON-PROTECTED ROUTES
 * (No JWT required)
 * ============================
 */

// Register user (with optional profile photo)
router.post(
  "/auth/register",
  upload.single("profile_photo"),
  authController.register
);

// Login with mobile number & password
router.post("/auth/login", authController.login);

// Login with Google (stub / future implementation)
router.post("/auth/login/google", authController.googleLogin);

// Forgot password (send reset link)
router.post("/auth/forgot-password", authController.forgotPassword);

// Reset password using token
router.post("/auth/reset-password/:token", authController.resetPassword);

/**
 * ============================
 * PROTECTED ROUTES
 * (JWT required)
 * ============================
 */

// Get logged-in user profile
router.get("/profile", authMiddleware, authController.profile);

// Update profile (name, email, profile photo)
router.post(
  "/profile/update",
  authMiddleware,
  upload.single("profile_photo"),
  authController.profileUpdate
);

// Change password
router.put(
  "/profile/change-password",
  authMiddleware,
  authController.changePassword
);

module.exports = router;
