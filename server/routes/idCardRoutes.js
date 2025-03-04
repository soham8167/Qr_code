const express = require("express");
const multer = require("multer");
const path = require("path");
const QRCode = require("qrcode");
const fs = require("fs");

const router = express.Router();

// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer middleware with file validation
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (JPG, PNG, GIF) are allowed"));
    }
  },
});

// Route to handle ID card generation
router.post("/generate-id-card", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { name, email, phno } = req.body;
    if (!name || !email || !phno) {
      return res.status(400).json({ error: "Name, email, and phone number are required" });
    }

    const image = req.file ? req.file.filename : null;

    const idCardData = { name, email, phno, image };

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(idCardData));
    idCardData.qrCode = qrCodeDataUrl;

    res.json(idCardData);
  } catch (error) {
    console.error("Error generating ID card:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
