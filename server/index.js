const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const idCardRoutes = require("./routes/idCardRoutes");


const app = express();

// Middleware to parse URL-encoded data

app.use(bodyParser.urlencoded({ extended: false }));

// Middleware to parse JSON data

app.use(bodyParser.json());

// Middleware to enable cross-origin resource sharing

app.use(cors(
  {
    origin:[""],
    methods:["POST", "GET"],
    credentials: true
  }
));

// Middleware to serve static files from the uploads directory

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import the routes from the routes file

app.use("/", idCardRoutes);

// Start the server

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {

  console.log(`Server started on port ${PORT}`);

});
