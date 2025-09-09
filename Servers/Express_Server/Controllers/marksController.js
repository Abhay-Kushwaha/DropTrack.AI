const XLSX = require("xlsx");
const Marks = require("../models/MarksModel");
const Student = require("../Models/StudentModel");
const Subject = require("../models/SubjectModel");
const mongoose = require("mongoose");

// Upload Marks Excel
exports.uploadMarksExcel = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { standard, subject } = req.body; // subjectId comes from frontend

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        if (!standard || !subject) {
            return res
                .status(400)
                .json({ message: "Standard and Subject are required" });
        }

        // Resolve subjectId → subjectName
        let subjectName = subject;
        if (mongoose.Types.ObjectId.isValid(subject)) {
            const subjDoc = await Subject.findById(subject);
            if (!subjDoc) {
                return res.status(400).json({ message: "Invalid subject ID" });
            }
            subjectName = subjDoc.Name; // Use subject name from DB
        }

        // Parse Excel buffer
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (!sheetData.length) {
            return res.status(400).json({ message: "Excel file is empty" });
        }

        // Find or create marks document for school
        let marksDoc = await Marks.findOne({ SchoolId: schoolId });
        if (!marksDoc) {
            marksDoc = new Marks({ SchoolId: schoolId, Students: [] });
        }

        for (const row of sheetData) {
            const studentName = row["Name"];
            const newMarks = Number(row["Marks"]);

            if (!studentName || isNaN(newMarks)) continue;

            // Find student in Student collection by name + school + standard
            const student = await Student.findOne({
                Name: studentName,
                SchoolID: schoolId,
                Standard: standard,
            });

            if (!student) {
                console.log(`⚠️ Student not found: ${studentName}`);
                continue; // skip if not in student collection
            }

            const studentId = student._id;

            // Check if student is already in Marks collection
            const existingIndex = marksDoc.Students.findIndex(
                (s) => s.Student1.toString() === studentId.toString()
            );

            if (existingIndex !== -1) {
                // Student already exists → update subject marks array
                let existingMarks = marksDoc.Students[existingIndex].marks.get(subjectName);

                if (existingMarks) {
                    // append new mark
                    existingMarks.push(newMarks);
                    marksDoc.Students[existingIndex].marks.set(subjectName, existingMarks);
                } else {
                    // create new subject array
                    marksDoc.Students[existingIndex].marks.set(subjectName, [newMarks]);
                }
            } else {
                // Student not present → add new
                marksDoc.Students.push({
                    Student1: studentId,
                    Standard: student.Standard,
                    marks: { [subjectName]: newMarks },
                });
            }
        }

        await marksDoc.save();

        return res.status(200).json({
            message: "Marks uploaded and processed successfully",
            marksDoc,
        });
    } catch (err) {
        console.error("❌ Error processing marks:", err);
        return res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
    }
};

// Get Student Marks
exports.getStudentMarks = async (req, res) => {
    try {
        const { studentId, schoolId } = req.query;

        if (!studentId || !schoolId) {
            return res.status(400).json({
                message: "Student ID and School ID are required",
                status: -9
            });
        }

        // Find marks document for the school
        const marksDoc = await Marks.findOne({ SchoolId: schoolId })
            .populate({
                path: "Students.Student1",
                select: "Name Email RollNumber"
            });

        if (!marksDoc) {
            return res.status(404).json({
                message: "No marks data found for this school",
                status: -9
            });
        }

        // Find the specific student in the marks document
        const studentMarks = marksDoc.Students.find(
            (s) => s.Student1._id.toString() === studentId.toString()
        );

        if (!studentMarks) {
            return res.status(404).json({
                message: "No marks data found for this student",
                status: -9
            });
        }

        // Convert marks (Map or plain object) to plain object safely; ensure arrays
        const marksObject = {};
        if (studentMarks.marks) {
            if (typeof studentMarks.marks.forEach === "function") {
                // Map-like
                studentMarks.marks.forEach((value, key) => {
                    marksObject[key] = Array.isArray(value) ? value : [Number(value) || 0];
                });
            } else if (typeof studentMarks.marks === "object") {
                Object.keys(studentMarks.marks).forEach((k) => {
                    const v = studentMarks.marks[k];
                    marksObject[k] = Array.isArray(v) ? v : [Number(v) || 0];
                });
            }
        }

        return res.status(200).json({
            data: {
                student: studentMarks.Student1,
                standard: studentMarks.Standard,
                marks: marksObject,
                updatedAt: marksDoc.updatedAt
            },
            status: 200
        });

    } catch (err) {
        console.error("❌ Error fetching student marks:", err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
            status: -9
        });
    }
};