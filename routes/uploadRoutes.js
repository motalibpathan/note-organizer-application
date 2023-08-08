const express = require("express");
const router = express.Router();
const upload = require("../helpers/imageUpload");

// POST route to handle file uploads
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const uploadedImages = req.files.map((file) => {
      return {
        originalName: file.originalname,
        filename: file.filename, // You can use this as the URL
      };
    });
    console.log(
      "🚀 ~ file: uploadRoutes.js:14 ~ uploadedImages ~ uploadedImages:",
      uploadedImages
    );
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 5000);
    });
    res.json({ success: true, images: uploadedImages });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ success: false, message: "Error uploading images" });
  }
});

module.exports = router;
