const Counselling = require("../models/CounsellingModel");
const Student = require("../models/StudentModel");
const Mentor = require("../models/MentorModel");
const mongoose = require("mongoose");
const { notifyByStudent } = require("../Controllers/notificationController");
const { notifyMentor } = require("../Controllers/mentorNotificationController");
const { notifySchool } = require("../Controllers/schoolNotificationController");

// Step 1: Student makes a request for counselling
exports.requestCounselling = async (req, res) => {
    try {
        const { school_obj_id } = req.params; // student object ID
        const { message } = req.body;
        const { email } = req.body;

        // Check if student exists
        const student = await Student.findOne({
            Email: email,
            $expr: {
                $eq: [
                    { $arrayElemAt: ["$SchoolID", -1] },
                    new mongoose.Types.ObjectId(school_obj_id)
                ]
            }
        });

        // Pick a random mentor (or logic to select based on dept / availability)
        // const mentor = await Mentor.findOne();
        const mentor = await Mentor.findOne({ Name: "Rohan Verma" });
        if (!mentor) {
            return res.status(404).json({ message: "No mentor available" });
        }
        console.log("Assigned mentor:", mentor.Name);

        // Find counselling doc for school or create one
        let counselling = await Counselling.findOne({ SchoolID: school_obj_id });
        if (!counselling) {
            counselling = new Counselling({
                School: school_obj_id,
                Students: [],
            });
        }
        console.log("Counselling doc ready for school:", counselling);

        // Add student request
        counselling.Students.push({
            Student1: email,
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

        // Student notification (schema is student-centric)
        await notifyByStudent(student._id, `Your Request for counselling is accepted and Mr. ${mentor.Name} has been assigned to you`);
        // Mentor notification
        await notifyMentor(mentor._id, `New counselling request from ${student.Name}.`);
        // School notification
        if (Array.isArray(student.SchoolID) && student.SchoolID.length > 0) {
            const lastSchoolId = student.SchoolID[student.SchoolID.length - 1];
            await notifySchool(lastSchoolId, `Student ${student.Name} request for Counselling and Mr. ${mentor.Name} is assigned`);
        }

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
        const { meetID } = req.params;
        const { scheduleDate } = req.body;

        console.log("Scheduling meeting for:", meetID, scheduleDate);
        const counselling = await Counselling.findOneAndUpdate(
            { "Students._id": meetID },
            { $set: { "Students.$.Schedule_date": scheduleDate } },
            { new: true }
        );

        if (!counselling) {
            return res.status(404).json({ message: "Counselling request not found" });
        }

        // Student notification
        const student = await Student.findOne({ Email: studentEmail });
        if (student) {
            await notifyByStudent(student._id, "Your Meeting is Scheduled");
            // School notification
            if (Array.isArray(student.SchoolID) && student.SchoolID.length > 0) {
                const lastSchoolId = student.SchoolID[student.SchoolID.length - 1];
                await notifySchool(lastSchoolId, `Meeting schedule of Student ${student.Name}`);
            }
        }

        // Mentor notification
        const mentorEmail = counselling.Students.find(s => s.Student1 === studentEmail)?.Mentor;
        const mentor = mentorEmail ? await Mentor.findOne({ Email: mentorEmail }) : null;
        if (mentor && student) {
            await notifyMentor(mentor._id, `Meeting scheduled for Student ${student.Name}.`);
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
        const { meetID } = req.params;
        const { meetingLink } = req.body;

        const counselling = await Counselling.findOneAndUpdate(
            { "Students._id": meetID },
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
        const { meetID } = req.params;
        const { Concluded_msg } = req.body;

        const counselling = await Counselling.findOneAndUpdate(
            { "Students._id": meetID },
            {
                $set: {
                    "Students.$.Concluded_msg": Concluded_msg,
                    "Students.$.is_Contacted": true
                }
            },
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
        const { meetID } = req.params;
        const { isSatisfied } = req.body;

        const counselling = await Counselling.findOneAndUpdate(
            { "Students._id": meetID },
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
        const { schoolID } = req.params;
        const counselling = await Counselling.find({ School: schoolID });

        if (!counselling) {
            return res.status(404).json({ message: "No counselling data found for school" });
        }

        res.json(counselling);
    } catch (err) {
        console.error("❌ Error in getCounsellingBySchool:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};