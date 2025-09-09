const Counselling = require("../models/counsellingModel");

// Add a new counselling record
exports.addCounselling = async (req, res) => {
    try {
        const { student_id, date, notes } = req.body;
    } catch (error) {
        console.error("Error adding counselling record:", error);
        res.status(500).json({ message: "Server Error" });
    }
}

// Get all counselling records
exports.getCounsellings = async (req, res) => {
    try {
        const counsellings = await Counselling.find().populate('student_id', 'Name');
        res.status(200).json(counsellings);
    } catch (error) {
        console.error("Error fetching counselling records:", error);
        res.status(500).json({ message: "Server Error" });
    }   
};