const express = require("express");
const multer = require("multer");
const { uploadMarksExcel, getStudentMarks } = require("../Controllers/marksController");

const router = express.Router();

// Multer config (store in memory, not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route: Upload Excel
router.post("/marksupload/:schoolId", upload.single("file"), uploadMarksExcel);

// Route: Get Student Marks
router.get("/getStudentMarks", getStudentMarks);

module.exports = router;
