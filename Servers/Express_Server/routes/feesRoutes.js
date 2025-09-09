const express = require("express");
const multer = require("multer");
const { uploadFeesExcel } = require("../Controllers/feesController");

const router = express.Router();

// Multer config (store in memory, not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route: Upload Excel
router.post("/feeupload/:schoolId", upload.single("file"), uploadFeesExcel);

module.exports = router;
