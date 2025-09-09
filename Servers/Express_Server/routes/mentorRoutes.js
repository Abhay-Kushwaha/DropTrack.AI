const express = require("express");
const router = express.Router();
const MentorController = require("../Controllers/mentorController");
const multer = require("multer");
const MentorModel = require("../Models/MentorModel");
const { default: mongoose } = require("mongoose");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/getMentor", MentorController.getMentors);
router.post("/addMentor", MentorController.addMentors);
//add Mentor from excel sheet
router.post(
  "/addMentorExcel",
  upload.single("excelfile"),
  MentorController.addMentorsFromExcel
);

module.exports = router;
