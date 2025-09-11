import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../Store/axios";
import { useNavigate } from "react-router-dom";
import schoolImg from "../../Assets/school.jpg";

const SchoolProfile = () => {
  const schoolData = useSelector((state) => state.user.user);
  const [extraDetails, setExtraDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const res = await axios.get("/getSchool");
        console.log("Data: ",res.data.data);
        const matched = res.data.data.find(
          (s) => s.Name === schoolData?.School?.Name
        );
        if (matched) {
          setExtraDetails({
            City: matched.City,
            State: matched.State,
            District: matched.District,
            Medium: matched.Medium,
            SchoolID: matched.SchoolID,
          });
        }
      } catch (err) {
        console.error("Error fetching school details:", err);
      }
    };

    if (schoolData?.School?.Name) {
      fetchSchoolDetails();
    }
  }, [schoolData]);

  if (!schoolData?.School) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">No school data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-80">
        <img
          src={schoolImg}
          alt="School"
          className="w-full h-full object-cover rounded-b-3xl shadow-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-b-2xl">
          <h1 className="text-white text-6xl font-bold drop-shadow-lg">
            {schoolData.School.Name}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {schoolData.School.Name}
              </h2>
              <p className="text-gray-500">School Profile</p>
              <p className="text-sm text-gray-400 mt-1">
                School ID:{" "}
                <span className="font-medium text-gray-700">
                  {extraDetails?.SchoolID || "N/A"}
                </span>
              </p>
            </div>
            <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
              {schoolData.School.Type === 0
                ? "Government"
                : schoolData.School.Type === 1
                  ? "Private"
                  : schoolData.School.Type === 2
                    ? "Semi-Govt"
                    : "International"}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Contact Details
              </h3>
              <ul className="space-y-3">
                <li>
                  <span className="font-medium text-gray-600">Email: </span>
                  <span className="text-gray-800">{schoolData.Email}</span>
                </li>
                <li>
                  <span className="font-medium text-gray-600">Phone: </span>
                  <span className="text-gray-800">
                    {schoolData.School.ContactNumber || "N/A"}
                  </span>
                </li>
                <li>
                  <span className="font-medium text-gray-600">Medium: </span>
                  <span className="text-gray-800">
                    {extraDetails?.Medium?.name || "Not Specified"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Right Side */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Location
              </h3>
              <ul className="space-y-3">
                <li>
                  <span className="font-medium text-gray-600">Address: </span>
                  <span className="text-gray-800">
                    {schoolData.School.Address}
                  </span>
                </li>
                <li>
                  <span className="font-medium text-gray-600">City: </span>
                  <span className="text-gray-800">
                    {extraDetails?.City?.city || "N/A"}
                  </span>
                </li>
                <li>
                  <span className="font-medium text-gray-600">District: </span>
                  <span className="text-gray-800">
                    {extraDetails?.District?.district || "N/A"}
                  </span>
                </li>
                <li>
                  <span className="font-medium text-gray-600">State: </span>
                  <span className="text-gray-800">
                    {extraDetails?.State?.name || "N/A"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/school/addnewstudent")}
              className="bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Add Student
            </button>
            <button
              onClick={() => navigate("/school/addnewmentor")}
              className="bg-green-600 text-white py-3 rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Add Mentor
            </button>
            <button
              onClick={() => navigate("/school/updatestudentdetails")}
              className="bg-purple-600 text-white py-3 rounded-lg shadow-md hover:bg-purple-700 transition"
            >
              Add Marks
            </button>
            <button
              onClick={() => navigate("/school/updatestudentdetails")}
              className="bg-orange-600 text-white py-3 rounded-lg shadow-md hover:bg-orange-700 transition"
            >
              Add Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfile;