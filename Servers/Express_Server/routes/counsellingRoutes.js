const express = require("express");
const router = express.Router();
const counsellingController = require("../controllers/counsellingController");

router.post("/addCounselling", counsellingController.addCounselling);
router.get("/getCounsellings", counsellingController.getCounsellings);