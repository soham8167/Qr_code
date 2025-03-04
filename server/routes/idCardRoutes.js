const express = require("express");
const multer = require("multer");
const path = require("path");
const QRCode = require("qrcode");

// Create a new router
const router = express.Router();

// Configure storage for multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

// Multer middleware for handling file uploads
const upload = multer({ storage: storage });

// Route to handle ID card generation
router.post("/generate-id-card", upload.single("image"), async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);

  const { name, email, phno } = req.body;
  const image = req.file ? req.file.filename : null;

  const idCardData = {
    name,
    email,
    phno,
    image,
  };

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(idCardData)); // Generate QR code from ID card data
    idCardData.qrCode = qrCodeDataUrl; // Add QR code to the ID card data
    res.json(idCardData); // Send ID card data with QR code as response
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

module.exports = router;
