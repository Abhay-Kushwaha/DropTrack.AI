const MentorModel = require("../Models/MentorModel");
const UserModel = require("../models/UserModel");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const StateModel = require("../models/StateModel");
const DistrictModel = require("../models/DistrictModel");
const TalukaModel = require("../models/TalukaModel");
const CityModel = require("../models/CityModel");
const SchoolModel = require("../models/SchoolModel");
const sendMail = require("./SendMail");

async function getMentors(req, res) {
    try {
        let data = await MentorModel.find(req.query)
            .populate("State")
            .populate("District")
            .populate("Taluka")
            .populate("City")
            .populate({
                path: "SchoolID",
                populate: {
                    path: "Medium",
                },
            });

        res.json({
            data: data,
            status: 200,
        });
    } catch (err) {
        res.json({
            err: err.msg,
            status: -9,
        });
    }
}

async function addMentors(req, res) {
    try {
        console.log(req.body);

        // In mentor Collection
        let data = await MentorModel.create(req.body);


        // Create user account for the mentor
        const password = sendMail.passwordGenerate(8);
        const userObj = {
            Name: data.Name,
            Email: data.Email,
            Password: password,
            ContactNumber: data.ContactNumber?.toString(),
            Role: 7, // Role 7 is for Mentor
            State: data.State,
            District: data.District,
            Taluka: data.Taluka,
            City: data.City,
            School: data.SchoolID[data.SchoolID.length - 1],
        };

        // Create user record
        let user = new UserModel(userObj);
        await user.save();

        // Send email with login credentials
        sendMail.SendEmail(data.Email, password);

        res.json({
            data: data,
            status: 200,
        });
    } catch (err) {
        console.log(err);
        res.json({
            err: err.message,
            status: -9,
        });
    }
}

async function addMentorsFromExcel(req, res) {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Process the file using xlsx library
        const workbook = xlsx.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Save data to the database
        for (let index = 0; index < data.length; index++) {
            let element = data[index];

            // Resolve string -> ObjectId
            if (element.State) {
                const stateDoc = await StateModel.findOne({ name: element.State });
                element.State = stateDoc?._id || null;
            }

            if (element.District) {
                const distDoc = await DistrictModel.findOne({ district: element.District });
                element.District = distDoc?._id || null;
            }

            if (element.Taluka) {
                const talukaDoc = await TalukaModel.findOne({ taluka: element.Taluka });
                element.Taluka = talukaDoc?._id || null;
            }

            if (element.City) {
                const cityDoc = await CityModel.findOne({ city: element.City });
                element.City = cityDoc?._id || null;
            }

            // Handle multiple school names (comma-separated in Excel)
            if (element.SchoolName) {
                const schoolNames = element.SchoolName.split(",").map((s) => s.trim());
                const schoolDocs = await SchoolModel.find({
                    Name: { $in: schoolNames },
                }).select("_id");

                if (schoolDocs.length > 0) {
                    element.SchoolID = schoolDocs.map((doc) => doc._id); // Save as array of ObjectIds
                } else {
                    console.log(`⚠️ Warning: No schools found for names: ${schoolNames.join(", ")}`);
                    element.SchoolID = [];
                }
            }

            // Create Mentor record
            const result = await MentorModel.create(element);
            console.log("Inserted:", result._id);

            // Generate password for the user account
            const password = sendMail.passwordGenerate(8);

            // Create user account for the Mentor
            const userObj = {
                Name: result.Name,
                Email: result.Email,
                Password: password,
                ContactNumber: result.ContactNumber?.toString(),
                Role: 7, // Role 7 is for Mentor
                State: result.State,
                District: result.District,
                Taluka: result.Taluka,
                City: result.City,
                School: Array.isArray(result.SchoolID) ? result.SchoolID[0] : result.SchoolID,
            };

            // Create user record
            let user = new UserModel(userObj);
            await user.save();

            // Send email with login credentials
            if (result.Email) {
                sendMail.SendEmail(result.Email, password);
            }
        }

        // Return a success response
        return res.json({ message: "Mentor data added successfully", status: 200 });
    } catch (err) {
        console.error(err);
        res.json({ err: err.message, status: -9 });
    }
}

module.exports = {
    getMentors,
    addMentors,
    addMentorsFromExcel,
};
