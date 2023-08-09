const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res
      .status(401)
      .json({ success: false, message: "Access token not provided" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET); // Verify the token using your secret key

    req.userId = decoded.id; // Add the decoded user ID to the request
    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error("Error verifying access token:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid access token" });
  }
};

module.exports = authenticate;
