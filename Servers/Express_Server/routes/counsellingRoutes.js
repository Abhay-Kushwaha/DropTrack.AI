const express = require("express");
const router = express.Router();
const counsellingController = require("../Controllers/counsellingController");


router.post("/meetrequest/:email", counsellingController.requestCounselling);
router.put("/schedule/:studentEmail", counsellingController.scheduleMeeting);
router.put("/addlink/:studentEmail", counsellingController.addMeetingLink);
router.put("/conclude/:studentEmail", counsellingController.concludeMeeting);
router.put("/satisfaction/:studentEmail", counsellingController.updateSatisfaction);
router.get("/school/:schoolEmail", counsellingController.getCounsellingBySchool);

module.exports = router;