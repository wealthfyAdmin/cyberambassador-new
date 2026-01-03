const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth/auth.controller");

// Show reset password form
router.get(
  "/reset-password/:token",
  authController.showResetPasswordForm
);

// Handle reset password form submit
router.post(
  "/reset-password/:token",
  authController.handleResetPasswordForm
);

module.exports = router;
