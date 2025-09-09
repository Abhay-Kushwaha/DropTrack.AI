const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    RollNumber: String,
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
    ParentOccupation: String,
    ParentMaritalStatus: Number, //0- without parent , 1-with father , 2-with mother , 3-both
    ContactNumber: { type: Number },
    parentPhone: String,
    parentEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    Address: {
      type: String,
    },
    Caste: String,
    Disablity: {
      type: Number,
      default: 0,
    },
    FamilyIncome: String,
    Standard: Number,
    SchoolID: [{ type: mongoose.Schema.Types.ObjectId, ref: "schools" }],
    State: { type: mongoose.Schema.Types.ObjectId, ref: "states" },
    District: { type: mongoose.Schema.Types.ObjectId, ref: "districts" },
    Taluka: { type: mongoose.Schema.Types.ObjectId, ref: "talukas" },
    City: { type: mongoose.Schema.Types.ObjectId, ref: "cities" },
    date: { type: Date, default: Date.now() },
    is_active: { type: Number, default: 3 }, //0-inactive, 1-Dropout with reason, 2-dropout without reason, 3-study
    Reasons: String, // hardcoded
    FatherEducation: Number, //0-no formal education, 1-primery education, 2-secondary education, 3-higher secondary, 4-graduate
    MotherEducation: Number,
    result: {
      type: Number,
      default: 0,
    },
    AttendancePercentage: { type: Number, default: 0 },
    isRepeated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Student = mongoose.models.students || mongoose.model("students", StudentSchema);

module.exports = Student;
