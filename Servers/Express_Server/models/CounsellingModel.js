const mongoose = require("mongoose");

const CounsellingSchema = new mongoose.Schema(
    {
        School: {
            type: String, // school email
            required: true,
        },
        Students: [
            {
                Student1: {
                    type: String, // student email
                    required: true,
                },
                Studentdetails: {
                    name: { type: String, required: true },
                    phone: { type: String, required: true },
                    parentPhone: { type: String, required: true },
                    parentEmail: { type: String, required: true },
                },
                Mentor: {
                    type: String, // mentor email
                    required: true,
                },
                MentorName: {
                    type: String,
                    required: true,
                },
                Created_at: {
                    type: Date,
                    default: Date.now,
                },
                Schedule_date: {
                    type: Date,
                },
                meetingLink: {
                    type: String,
                },
                Concluded_msg: {
                    type: String,
                },
                is_Contacted: {
                    type: Boolean,
                    default: false,
                },
                is_Satisfied: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.models.Counselling || mongoose.model("Counselling", CounsellingSchema);
