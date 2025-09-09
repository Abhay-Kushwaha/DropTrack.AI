const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema(
    {
        SchoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "schools",
            required: true,
        },
        Students: [
            {
                Student1: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "students",
                    required: true,
                },
                Standard: {
                    type: Number, 
                    required: true,
                },
                marks: {
                    type: Map,
                    of: [Number], // subject -> array of marks
                    default: {},
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Marks", MarksSchema);
