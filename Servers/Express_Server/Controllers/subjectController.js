const Subject = require("../models/SubjectModel");

exports.addSubject = async (req, res) => {
    try {
        let data;
        if (Array.isArray(req.body)) {
            data = await Subject.insertMany(req.body);
        } else {
            data = await Subject.create(req.body);
        }
        res.json({ data, status: 200 });
    } catch (err) {
        res.json({ message: err.message, status: -9 });
    }
};

exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ Name: 1 });
        res.status(200).json(subjects);
    } catch (error) {
        console.error("Error fetching subjects:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
