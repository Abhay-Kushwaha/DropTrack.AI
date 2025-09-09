const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model.Subject || mongoose.model("subjects", SubjectSchema);
