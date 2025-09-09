const mongoose = require("mongoose");

const FeeStudentSchema = new mongoose.Schema(
    {
        student_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "students", // reference to Student collection
            required: true,
        },
        StudentName: {
            type: String,
            required: true,
            trim: true,
        },
        No_unpaid_Month: {
            type: Number,
            required: true,
            min: 0, // unpaid months can't be negative
        },
    },
    { _id: false } // prevent auto-creation of _id for sub-documents
);

const FeesSchema = new mongoose.Schema(
    {
        school_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "schools", // reference to School collection
            required: true,
        },
        Students: {
            type: [FeeStudentSchema],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("fees", FeesSchema);
