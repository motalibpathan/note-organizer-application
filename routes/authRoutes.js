const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// @desc    Register a new user
// @route   POST /api/register
router.post("/register", registerUser);

// @desc    Login a user
// @route   POST /api/login
router.post("/login", loginUser);

module.exports = router;
