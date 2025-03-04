const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const idCardRoutes = require("./routes/idCardRoutes");

const app = express();

// Middleware to parse URL-encoded and JSON data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS Configuration
app.use(
  cors({
    origin: ["https://qr-codeclient.vercel.app", "http://localhost:5173"], // Added localhost for development
    methods: ["POST", "GET"],
    credentials: true,
  })
);

// Root route for testing
app.get("/", (req, res) => {
  res.json("Server is running...");
});

// Middleware to serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
app.use("/", idCardRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
