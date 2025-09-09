const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema(
    {
        Name: String,
        Email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        DOB: Date,
        Gender: String,
        AadharNumber: Number,
        ContactNumber: { type: Number },
        SchoolID: [{ type: mongoose.Schema.Types.ObjectId, ref: "schools" }],
        State: { type: mongoose.Schema.Types.ObjectId, ref: "states" },
        District: { type: mongoose.Schema.Types.ObjectId, ref: "districts" },
        Taluka: { type: mongoose.Schema.Types.ObjectId, ref: "talukas" },
        City: { type: mongoose.Schema.Types.ObjectId, ref: "cities" },
    },
    { timestamps: true }
);

module.exports = mongoose.models.mentors || mongoose.model("mentors", MentorSchema);