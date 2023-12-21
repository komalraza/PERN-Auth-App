const express = require("express");
const {
  RegisterUser,
  ForgetPassword,
  LoginUser,
  RefreshToken,
  ResetPassword,
} = require("../../controllers/AuthController/AuthController.js");
const requiredAuth = require("../../middleware/authMiddleware.js");

const router = express.Router();

// Sign up Route
router.post("/signup", RegisterUser);

// Sign in Route
router.post("/signin", LoginUser);

// Refresh token after 5 min

router.post("/refresh", RefreshToken);
// Log out Route

// Forgot Password Route

router.post("/forgot-password", ForgetPassword);

router.post("/reset-password", requiredAuth, ResetPassword);

module.exports = router;
