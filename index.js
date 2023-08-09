// backend/index.js
require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");

const authenticate = require("./middlewares/authenticate");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const mongoURI = process.env.MONGODB_URI; // Use environment variable for MongoDB URI
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Serve static files from the "uploads" directory
app.use("/api/uploads", express.static("uploads"));

app.use("/api/upload", authenticate, require("./routes/uploadRoutes"));
app.use("/api/notes", authenticate, require("./routes/noteRoutes"));
app.use("/api/categories", authenticate, require("./routes/categoryRoutes"));

app.use("/api/auth", require("./routes/authRoutes"));

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "MongoDB connected" });
});

// serve client side
app.use(express.static("./client/dist"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  // Set a default status code and error message
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
