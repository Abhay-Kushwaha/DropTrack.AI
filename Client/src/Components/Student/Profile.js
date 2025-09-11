
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User, Home, GraduationCap, MapPin, AlertTriangle,
  BarChart2, Phone, Calendar, TrendingUp
} from "lucide-react";

const StudentProfile = () => {
  const userData = useSelector((state) => state.user.user);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/getStudent?Email=${userData.Email}`
        );
        const result = await response.json();

        if (result.status === 200 && result.data?.length > 0) {
          setStudentData(result.data[0]);
        } else {
          setError("Student data not found");
        }
      } catch (err) {
        setError("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    if (userData?.Email) {
      fetchStudentData();
    } else {
      setLoading(false);
      setError("User data not available");
    }
  }, [userData]);

  const formatEducationLevel = (level) => {
    switch (level) {
      case 0: return "No formal education";
      case 1: return "Primary";
      case 2: return "Secondary";
      case 3: return "Higher Secondary";
      case 4: return "Graduate";
      default: return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full"></div>
        <p className="ml-4 text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600 font-medium">{error || "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto my-8 px-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-8 rounded-2xl shadow-lg flex justify-between items-center mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
            {studentData.Name?.charAt(0) || "S"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{studentData.Name}</h1>
            <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-sm">
              Standard {studentData.Standard || "N/A"}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-lg my-3 text-right opacity-90">Roll No: {studentData.RollNumber || "N/A"}</p>
          <span
            className={`px-4 py-2 rounded-full text-md text-center font-semibold ${studentData.is_active === 3
                ? "bg-green-100 text-green-700"
                : studentData.is_active === 1
                  ? "bg-red-100 text-red-700"
                  : studentData.is_active === 2
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
              }`}
          >
            {studentData.is_active === 3
              ? "Active"
              : studentData.is_active === 1
                ? "Dropout (Reason)"
                : studentData.is_active === 2
                  ? "Dropout (No Reason)"
                  : "Inactive"}
          </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Personal Details" icon={<User className="w-5 h-5" />}>
          <Info label="Email" value={studentData.Email} />
          <Info label="Gender" value={studentData.Gender} />
          <Info label="DOB" value={new Date(studentData.DOB).toLocaleDateString()} />
          <Info label="Aadhar" value={studentData.AadharNumber} />
          <Info label="Contact" value={studentData.ContactNumber} />
          <Info label="Caste" value={studentData.Caste} />
        </Card>

        <Card title="Family & Education" icon={<Home className="w-5 h-5" />}>
          <Info label="Parent Occupation" value={studentData.ParentOccupation} />
          <Info label="Family Income" value={studentData.FamilyIncome} />
          <Info label="Father Education" value={formatEducationLevel(studentData.FatherEducation)} />
          <Info label="Mother Education" value={formatEducationLevel(studentData.MotherEducation)} />
        </Card>

        <Card title="Academic & Location" icon={<GraduationCap className="w-5 h-5" />}>
          <Info label="School" value={studentData.SchoolID?.[0]?.Name} />
          <Info label="Medium" value={studentData.SchoolID?.[0]?.Medium?.name} />
          <Info label="Attendance" value={`${studentData.AttendancePercentage || 0}%`} />
          <Info label="Repeated" value={studentData.isRepeated ? "Yes" : "No"} />
          <Info label="District" value={studentData.District?.district} />
          <Info label="State" value={studentData.State?.name} />
        </Card>
      </div>

      {/* Academic Performance */}
      <Card title="Academic Performance" icon={<TrendingUp className="w-5 h-5 text-blue-600" />}>
        <Info label="Attendance Rate" value={`${studentData.AttendancePercentage || 0}%`} />
        <Info label="Class Repeated" value={studentData.isRepeated ? "Yes" : "No"} />
        <Info label="Current Status" value={studentData.is_active === 3 ? "Active" : "Inactive"} />
      </Card>

      {/* Contact Information */}
      <Card title="Contact Information" icon={<Phone className="w-5 h-5 text-green-600" />}>
        <Info label="Student Email" value={studentData.Email} />
        <Info label="Student Phone" value={studentData.ContactNumber} />
        <Info label="Parent Email" value={studentData.parentEmail || "N/A"} />
        <Info label="Parent Phone" value={studentData.parentPhone || "N/A"} />
      </Card>

      {/* Address */}
      {studentData.Address && (
        <Card title="Address" icon={<MapPin className="w-5 h-5" />}>
          <p className="text-gray-700">{studentData.Address}</p>
        </Card>
      )}

      {/* Dropout Reason */}
      {studentData.Reasons && (
        <Card title="Dropout Reason" icon={<AlertTriangle className="w-5 h-5 text-red-600" />}>
          <p className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
            {studentData.Reasons}
          </p>
        </Card>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button onClick={() => navigate("/student/analytics")} icon={<BarChart2 />} color="orange">
          Analytics
        </Button>
        <Button onClick={() => navigate("/student/marks")} icon={<GraduationCap />} color="amber">
          Marks
        </Button>
        <Button onClick={() => navigate("/student/schedule")} icon={<Calendar />} gradient>
          Schedule
        </Button>
      </div>
    </div>
  );
};

const Card = ({ title, icon, children }) => (
  <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100 mt-6">
    <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-4">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}:</span>
    <span className="text-gray-800 font-medium">{value || "N/A"}</span>
  </div>
);

const Button = ({ onClick, icon, children, color, gradient }) => {
  const base = "px-6 py-2 rounded-lg shadow-md flex items-center transition";
  const colors = gradient
    ? "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
    : color === "orange"
      ? "bg-orange-600 hover:bg-orange-700 text-white"
      : color === "amber"
        ? "bg-amber-600 hover:bg-amber-700 text-white"
        : "bg-gray-600 hover:bg-gray-700 text-white";
  return (
    <button onClick={onClick} className={`${base} ${colors}`}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default StudentProfile;
