const express = require("express");
const router = express.Router();
const subjectController = require("../Controllers/subjectController");

router.post("/addSubject", subjectController.addSubject);
router.get("/getSubjects", subjectController.getSubjects);

module.exports = router;
