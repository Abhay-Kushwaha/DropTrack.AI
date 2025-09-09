const StudentModel = require("../Models/StudentModel");
const UserModel = require("../models/UserModel");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const StateModel = require("../models/StateModel");
const DistrictModel = require("../models/DistrictModel");
const TalukaModel = require("../models/TalukaModel");
const CityModel = require("../models/CityModel");
const SchoolModel = require("../models/SchoolModel");
const sendMail = require("./SendMail");

async function getStudents(req, res) {
  try {
    let data = await StudentModel.find(req.query)
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

async function addStudents(req, res) {
  try {
    console.log(req.body);

    // Create student record
    let data = await StudentModel.create(req.body);

    // Generate password for the user account
    const password = sendMail.passwordGenerate(8);

    // Create user account for the student
    const userObj = {
      Name: data.Name,
      Email: data.Email,
      Password: password,
      ContactNumber: data.ContactNumber?.toString(),
      Role: 6, // Role 6 is for Student
      State: data.State,
      District: data.District,
      Taluka: data.Taluka,
      City: data.City,
      School: data.SchoolID[data.SchoolID.length - 1],
      IsActive: 1
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

//0 inactive , 1 dropout with reason , 2 dropout w/o reason , 3 studying
async function deactivateStudent(req, res) {
  try {
    const status = req.body.status;   // expected: 0, 1, 2, or 3
    const ids = req.body.students;    // student IDs array
    const reason = req.body.reason;   // optional reason string
    const change = { is_active: status };

    // If dropout with reason
    if (status === 1) {
      change.Reasons = reason || "Not specified";
    }

    // If dropout (with or without reason), also push SchoolID: null
    let changeQuery;
    if (status === 1 || status === 2) {
      changeQuery = {
        $set: change,
        $push: { SchoolID: null },
      };
    } else {
      changeQuery = { $set: change };
    }
    console.log("Updating Students with:", changeQuery);

    // Apply update
    const data = await StudentModel.updateMany({ _id: { $in: ids } }, changeQuery);
    console.log("✅ Update Result:", JSON.stringify(data));
    res.json({
      data,
      status: 200,
    });
  } catch (err) {
    console.error("❌ Error in deactivateStudent:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      status: -9,
    });
  }
}

async function addStudentsFromExcel(req, res) {
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

      if (element.SchoolName) {
        const schoolNames = element.SchoolName.split(",").map(name => name.trim());
        const schoolDocs = await SchoolModel.find({
          Name: { $in: schoolNames }
        }).select("_id");
        if (schoolDocs.length > 0) {
          element.SchoolID = schoolDocs.map(doc => doc._id); // Save as array of ObjectIds
        }
        else {
          console.log(`⚠️ Warning: No schools found for names: ${schoolNames.join(", ")}`);
          element.SchoolID = [];
        }
      }

      // Map ParentEmail from Excel to match the model
      element.parentEmail = element.ParentEmail;

      // Create the student with proper field mapping
      const result = await StudentModel.create({
        ...element,
        RollNumber: element.RollNumber || element.rollNumber,
        parentEmail: element.ParentEmail || element.parentEmail, // Try both possible field names
        Email: element.Email, // Ensure student email is mapped
        ParentMaritalStatus: parseInt(element.ParentMaritalStatus, 10),
        Disablity: parseInt(element.Disability, 10) || 0,
        Standard: parseInt(element.Standard, 10),
        FatherEducation: parseInt(element.FatherEducation, 10) || 0,
        MotherEducation: parseInt(element.MotherEducation, 10) || 0,
        IsRepeated: element.IsRepeated === 'true' || element.IsRepeated === true || false,
        AttendancePercentage: parseFloat(element.AttendancePercentage) || 0
      });
      console.log("Inserted:", result._id);

      // Generate password for the user account
      const password = sendMail.passwordGenerate(8);

      // Create user account for the student
      const userObj = {
        Name: result.Name,
        Email: result.Email,
        Password: password,
        ContactNumber: result.ContactNumber?.toString(),
        Role: 6, // Role 6 is for Student
        State: result.State,
        District: result.District,
        Taluka: result.Taluka,
        City: result.City,
        School: result.SchoolID[result.SchoolID.length - 1],
        IsActive: 1
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
    return res.json({ message: "Student data added successfully", status: 200 });
  } catch (err) {
    console.error(err);
    res.json({ err: err.message, status: -9 });
  }
}

async function uploadAttendanceExcel(req, res) {
  try {
    const { schoolId } = req.params;
    const { standard } = req.body;
    const schoolObjectId = new mongoose.Types.ObjectId(schoolId);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!standard) {
      return res.status(400).json({ message: "Standard is required" });
    }

    // Parse CSV buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      return res.status(400).json({ message: "CSV file is empty" });
    }

    let updatedStudents = [];

    for (const row of sheetData) {
      const studentName = row["Name"];
      const attendance = Number(row["PercentageAttendance"]);

      if (!studentName || isNaN(attendance)) continue;

      console.log("Data:", { studentName, attendance, standard, schoolId, schoolObjectId });

      // Find student by Name + last element of SchoolID + Standard
      const student = await StudentModel.findOne({
        Name: studentName,
        Standard: standard,
        $expr: {
          $eq: [
            { $arrayElemAt: ["$SchoolID", -1] }, // last element of SchoolID
            schoolObjectId,
          ],
        },
      });
      console.log("Found Student:", student?._id);
      console.log("Student: ", student);

      if (!student) {
        console.log(`⚠️ Student not found: ${studentName}`);
        continue; // skip if not found
      }

      // Overwrite AttendancePercentage
      student.AttendancePercentage = attendance;
      await student.save();
      updatedStudents.push(student);
    }

    return res.status(200).json({
      message: "Attendance uploaded and updated successfully",
      updatedCount: updatedStudents.length,
      updatedStudents,
    });
  } catch (err) {
    console.error("❌ Error processing attendance:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

async function getSchoolWiseStudents(req, res) {
  try {
    const lastSchoolId = new mongoose.Types.ObjectId(req.query.schoolId);
    const status = req.query.status;
    // console.log(lastSchoolId, status);
    let data;
    if (status != 0 && status != 3) {
      data = await StudentModel.find({
        $expr: {
          $eq: [
            lastSchoolId,
            { $arrayElemAt: ["$SchoolID", -2] }, // Get the last element of the School_name array
          ],
        },
        is_active: { $in: [1, 2] },
      })
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
    } else {
      data = await StudentModel.find({
        $expr: {
          $eq: [
            lastSchoolId,
            { $arrayElemAt: ["$SchoolID", -1] }, // Get the last element of the School_name array
          ],
        },
        is_active: status,
      })
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
    }

    res.json({
      results: data.length,
      data: data,
      status: 200,
    });
  } catch (err) {
    console.log(err);
    res.json({
      err: err.msg,
      status: -9,
    });
  }
}

async function getChooseWiseStudents(req, res) {
  try {
    // const lastSchoolId = new mongoose.Types.ObjectId(req.query.schoolId);

    const status = req.query.status;

    const query1 = {
      is_active: { $in: [1, 2] },
    };

    const query2 = {
      is_active: status,
    };

    if (req.query.state != "") {
      query1.State = new mongoose.Types.ObjectId(req.query.state);
      query2.State = new mongoose.Types.ObjectId(req.query.state);
    }

    if (req.query.district != "") {
      query1.District = new mongoose.Types.ObjectId(req.query.district);
      query2.District = new mongoose.Types.ObjectId(req.query.district);
    }

    if (req.query.taluka != "") {
      query1.Taluka = new mongoose.Types.ObjectId(req.query.taluka);
      query2.Taluka = new mongoose.Types.ObjectId(req.query.taluka);
    }

    if (req.query.city != "") {
      query1.City = new mongoose.Types.ObjectId(req.query.city);
      query2.City = new mongoose.Types.ObjectId(req.query.city);
    }

    // console.log(lastSchoolId, status);
    let data;
    if (status != 0 && status != 3) {
      data = await StudentModel.find(query1)
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
      // if (req.query.taluka != "") {
      //   data = data.filter((doc) => {
      //     return doc.Taluka == new mongoose.Types.ObjectId(req.query.taluka);
      //   });
      // }
    } else {
      data = await StudentModel.find(query2)
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
    }

    res.json({
      results: data.length,
      data: data,
      status: 200,
    });
  } catch (err) {
    console.log(err);
    res.json({
      err: err.msg,
      status: -9,
    });
  }
}

//Labour Work
//Farmer
//Low Income Job
//Moderate Income Job

async function update(req, res) {
  try {
    let data = await StudentModel.find({});
    // .populate("City")
    // .populate({
    //   path: "SchoolID",
    //   populate: {
    //     path: "Medium",
    //   },
    // });
    let id = [];
    data.map((ele) => {
      id.push(ele._id);
    });

    // console.log(id);
    // id = id.slice(531, 708);
    // console.log(id);
    // console.log(id.length);

    // let update = await StudentModel.updateMany(
    //   { _id: { $in: id } },
    //   {
    //     ParentOccupation: "Moderate Income Job",
    //   }
    // );
    res.json({
      results: data.length,
      // data: update,
      status: 200,
    });
  } catch (err) {
    console.log(err);
  }
}

async function updateResult(req, res) {
  try {
    let id = await StudentModel.findOne({ _id: req.query.id });
    let newRes = id.result + parseInt(req.query.result);
    console.log(id.result);
    console.log(req.query.result);

    newRes = newRes / 2;
    console.log(newRes);
    let academiclevel;
    if (newRes > 0 && newRes <= 50) {
      academiclevel = 0;
    } else if (newRes > 50 && newRes <= 80) {
      academiclevel = 1;
    } else {
      academiclevel = 2;
    }

    const data = await StudentModel.updateOne(
      { _id: req.query.id },
      {
        result: newRes,
        academicLevel: academiclevel,
      }
    );
    res.json({
      data: data,
      status: 200,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: -9,
      err: err.msg,
    });
  }
}

module.exports = {
  getStudents,
  addStudents,
  deactivateStudent,
  addStudentsFromExcel,
  uploadAttendanceExcel,
  getSchoolWiseStudents,
  getChooseWiseStudents,
  update,
  updateResult,
};
