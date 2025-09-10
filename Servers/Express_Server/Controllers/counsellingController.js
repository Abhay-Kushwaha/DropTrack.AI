const Counselling = require("../models/CounsellingModel");
const Student = require("../models/StudentModel");
const Mentor = require("../models/MentorModel");

// Step 1: Student makes a request for counselling
exports.requestCounselling = async (req, res) => {
    try {
        const { email } = req.params; // student email
        const { message } = req.body;

        // Check if student exists
        const student = await Student.findOne({ Email: email });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Pick a random mentor (or logic to select based on dept / availability)
        // const mentor = await Mentor.findOne();
        const mentor = await Mentor.findOne({ Name: "Rohan Verma" });
        if (!mentor) {
            return res.status(404).json({ message: "No mentor available" });
        }
        console.log("Assigned mentor:", mentor.Name);

        // Find counselling doc for school or create one
        let counselling = await Counselling.findOne({ School: student.Email });
        if (!counselling) {
            counselling = new Counselling({
                School: student.Email,
                Students: [],
            });
        }
        console.log("Counselling doc ready for school:", counselling);

        // Add student request
        counselling.Students.push({
            Student1: student.Email,
            Studentdetails: {
                name: student.Name,
                phone: student.ContactNumber,
                parentPhone: student.parentPhone || "",
                parentEmail: student.parentEmail || "",
            },
            Mentor: mentor.Email,
            MentorName: mentor.Name,
            Created_at: new Date(),
            Schedule_date: null,
            meetingLink: "",
            issue: message || "",
            is_Contacted: false,
            is_Satisfied: false,
        });

        await counselling.save();

        res.status(201).json({
            message: "Counselling request created successfully",
            counselling,
        });
    } catch (err) {
        console.error("❌ Error in requestCounselling:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// Step 2: Mentor schedules the meeting date
exports.scheduleMeeting = async (req, res) => {
    try {
        const { studentEmail } = req.params;
        const { scheduleDate } = req.body;

        const counselling = await Counselling.findOneAndUpdate(
            { "Students.Student1": studentEmail },
            { $set: { "Students.$.Schedule_date": scheduleDate, "Students.$.is_Contacted": true } },
            { new: true }
        );

        if (!counselling) {
            return res.status(404).json({ message: "Counselling request not found" });
        }

        res.json({ message: "Meeting scheduled successfully", counselling });
    } catch (err) {
        console.error("❌ Error in scheduleMeeting:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// Step 3: Mentor adds meeting link
exports.addMeetingLink = async (req, res) => {
    try {
        const { studentEmail } = req.params;
        const { meetingLink } = req.body;

        const counselling = await Counselling.findOneAndUpdate(
            { "Students.Student1": studentEmail },
            { $set: { "Students.$.meetingLink": meetingLink } },
            { new: true }
        );

        if (!counselling) {
            return res.status(404).json({ message: "Counselling request not found" });
        }

        res.json({ message: "Meeting link added successfully", counselling });
    } catch (err) {
        console.error("❌ Error in addMeetingLink:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// Step 4: Mentor concludes meeting with message
exports.concludeMeeting = async (req, res) => {
    try {
        const { studentEmail } = req.params;
        const { concludedMsg } = req.body;

        const counselling = await Counselling.findOneAndUpdate(
            { "Students.Student1": studentEmail },
            { $set: { "Students.$.Concluded_msg": concludedMsg } },
            { new: true }
        );

        if (!counselling) {
            return res.status(404).json({ message: "Counselling request not found" });
        }

        res.json({ message: "Meeting concluded successfully", counselling });
    } catch (err) {
        console.error("❌ Error in concludeMeeting:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// Step 5: Student marks satisfaction
exports.updateSatisfaction = async (req, res) => {
    try {
        const { studentEmail } = req.params;
        const { isSatisfied } = req.body;

        const counselling = await Counselling.findOneAndUpdate(
            { "Students.Student1": studentEmail },
            { $set: { "Students.$.is_Satisfied": isSatisfied } },
            { new: true }
        );

        if (!counselling) {
            return res.status(404).json({ message: "Counselling request not found" });
        }

        res.json({ message: "Satisfaction updated successfully", counselling });
    } catch (err) {
        console.error("❌ Error in updateSatisfaction:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// Step 6: Get all counselling records for a school
exports.getCounsellingBySchool = async (req, res) => {
    try {
        const { schoolEmail } = req.params;
        const counselling = await Counselling.findOne({ School: schoolEmail });

        if (!counselling) {
            return res.status(404).json({ message: "No counselling data found for school" });
        }

        res.json(counselling);
    } catch (err) {
        console.error("❌ Error in getCounsellingBySchool:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};
