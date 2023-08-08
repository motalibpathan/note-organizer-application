const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Import the fs module

// Define the path to the uploads folder
const uploadsFolderPath = path.join(__dirname, "../uploads");

// Create the uploads folder if it doesn't exist
if (!fs.existsSync(uploadsFolderPath)) {
  fs.mkdirSync(uploadsFolderPath);
}

// Define storage for the uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsFolderPath); // Use the uploadsFolderPath
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// Validate image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."), false);
  }
};

// Create the multer middleware for handling image uploads
const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
