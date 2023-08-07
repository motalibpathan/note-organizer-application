// backend/index.js
require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const mongoURI = process.env.MONGODB_URI; // Use environment variable for MongoDB URI
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "MongoDB connected" });
});

// serve client side
app.use(express.static("./client/dist"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
