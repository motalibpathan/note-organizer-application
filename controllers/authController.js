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
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create and send an access token cookie
    const accessToken = generateToken(newUser);
    res.cookie("access-token", accessToken, {
      httpOnly: true,
      maxAge: 3600000, // Cookie expiration time in milliseconds
      secure: process.env.NODE_ENV === "production", // Set this based on your environment
    });

    return res.json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error registering:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    // Create and send an access token cookie
    const accessToken = generateToken(user);
    res.cookie("access-token", accessToken, {
      httpOnly: true,
      maxAge: 3600000, // Cookie expiration time in milliseconds
      secure: process.env.NODE_ENV === "production", // Set this based on your environment
    });

    return res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error logging in:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
exports.logoutUser = (req, res) => {
  // Clear the access token cookie
  res.clearCookie("access-token");

  return res.json({ success: true, message: "Logged out successfully." });
};
