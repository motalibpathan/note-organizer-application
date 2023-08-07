const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Function to generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
}

// @desc    Register a new user
// @route   POST /api/register
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate if username, email, and password are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required.",
      });
    }

    // Create a new user in the database
    const newUser = await User.create({ username, email, password });

    // Generate JWT token
    const token = generateToken(newUser);

    // Return response with the newly registered user data and token
    res.status(201).json({ success: true, data: newUser, token });
  } catch (error) {
    // Handle errors during user registration
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

// @desc    Login a user
// @route   POST /api/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email in the database
    const user = await User.findOne({ email });

    // Validate if user exists and if password is correct
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return response with the generated JWT token
    res.json({ success: true, token });
  } catch (error) {
    // Handle errors during user login
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// @desc    Register a new user
// @route   POST /api/register
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate if username, email, and password are provided
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required.",
      });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database with the hashed password
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = generateToken(newUser);

    // Return response with the newly registered user data and token
    res.status(201).json({ success: true, data: newUser, token });
  } catch (error) {
    // Handle errors during user registration
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

// @desc    Login a user
// @route   POST /api/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email in the database
    const user = await User.findOne({ email });

    // Validate if user exists and if password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return response with the generated JWT token
    res.json({ success: true, token });
  } catch (error) {
    // Handle errors during user login
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};
