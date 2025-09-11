import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const StudentAnalytics = () => {
  const userData = useSelector((state) => state.user.user);
  const [studentData, setStudentData] = useState(null);
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentAnalytics = async () => {
      try {
        setLoading(true);
        
        // Fetch student data
        const studentResponse = await fetch(
          `http://localhost:3000/getStudent?Email=${userData.Email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        const studentResult = await studentResponse.json();
        
        if (studentResult.status === 200 && studentResult.data && studentResult.data.length > 0) {
          const student = studentResult.data[0];
          setStudentData(student);
          
          // Fetch marks data if student has school ID
          if (student.SchoolID && student.SchoolID.length > 0) {
            try {
              const marksResponse = await fetch(
                `http://localhost:3000/getStudentMarks?studentId=${student._id}&schoolId=${student.SchoolID[0]._id}`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              
              const marksResult = await marksResponse.json();
              if (marksResult.status === 200) {
                setMarksData(marksResult.data);
              }
            } catch (marksError) {
              console.log("Marks data not available:", marksError);
            }
          }
        } else {
          setError("Student data not found");
        }
      } catch (err) {
        console.error("Error fetching student analytics:", err);
        setError("Failed to fetch student analytics");
      } finally {
        setLoading(false);
      }
    };

    if (userData && userData.Email) {
      fetchStudentAnalytics();
    } else {
      setLoading(false);
      setError("User data not available");
    }
  }, [userData]);

  // Helper function to get grade from marks
  const getGrade = (marks) => {
    if (marks >= 90) return { grade: "A+", color: "text-green-600", bgColor: "bg-green-100" };
    if (marks >= 80) return { grade: "A", color: "text-green-600", bgColor: "bg-green-100" };
    if (marks >= 70) return { grade: "B+", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (marks >= 60) return { grade: "B", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (marks >= 50) return { grade: "C+", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    if (marks >= 40) return { grade: "C", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    return { grade: "D", color: "text-red-600", bgColor: "bg-red-100" };
  };

  // Helper function to get attendance status
  const getAttendanceStatus = (percentage) => {
    if (percentage >= 90) return { status: "Excellent", color: "text-green-600", bgColor: "bg-green-100" };
    if (percentage >= 80) return { status: "Good", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (percentage >= 70) return { status: "Average", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    if (percentage >= 60) return { status: "Below Average", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { status: "Poor", color: "text-red-600", bgColor: "bg-red-100" };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-500 text-lg">Loading analytics...</p>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Error</p>
          <p className="text-gray-500">{error || "No student data available."}</p>
        </div>
      </div>
    );
  }

  const attendanceStatus = getAttendanceStatus(studentData.AttendancePercentage || 0);

  return (
    <div className="max-w-7xl mx-auto my-10 px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Overall Analytics</h1>
        <p className="text-gray-600">Comprehensive analysis of your academic performance</p>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Attendance Progress Circle */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
              <span className="mr-2">📊</span>
              Attendance Overview
            </h3>
            
            {/* Progress Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress circle */}
                  <path
                    className={`${attendanceStatus.color.replace('text-', 'text-')}`}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${studentData.AttendancePercentage || 0}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">
                    {studentData.AttendancePercentage || 0}%
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <p className={`text-lg font-semibold ${attendanceStatus.color}`}>
                  {attendanceStatus.status}
                </p>
                <p className="text-sm text-gray-500 mt-1">Attendance Rate</p>
              </div>
            </div>

            {/* Attendance Details */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${attendanceStatus.bgColor} ${attendanceStatus.color}`}>
                  {studentData.is_active === 3 ? "Active Student" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Class Repeated</span>
                <span className="font-medium">{studentData.isRepeated ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Standard</span>
                <span className="font-medium">{studentData.Standard || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-700 mb-6 flex items-center">
              <span className="mr-2">📈</span>
              Performance Summary
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Academic Performance */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">Academic Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overall Grade</span>
                    <span className="font-semibold">
                      {marksData && marksData.marks ? 
                        (() => {
                          const marks = Object.values(marksData.marks);
                          const average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
                          const gradeInfo = getGrade(average);
                          return (
                            <span className={`px-2 py-1 rounded ${gradeInfo.bgColor} ${gradeInfo.color}`}>
                              {gradeInfo.grade}
                            </span>
                          );
                        })() : 
                        "N/A"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Marks</span>
                    <span className="font-semibold">
                      {marksData && marksData.marks ? 
                        (() => {
                          const marks = Object.values(marksData.marks);
                          return Math.round(marks.reduce((sum, mark) => sum + mark, 0) / marks.length);
                        })() : 
                        "N/A"
                      }%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subjects</span>
                    <span className="font-semibold">
                      {marksData && marksData.marks ? Object.keys(marksData.marks).length : 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* School Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-4">School Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">School Name</span>
                    <span className="font-semibold text-right">
                      {studentData.SchoolID?.[0]?.Name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Medium</span>
                    <span className="font-semibold">
                      {studentData.SchoolID?.[0]?.Medium?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold text-right">
                      {studentData.City?.city || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Marks Table */}
      {marksData && marksData.marks && (
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center">
              <span className="mr-2">📝</span>
              Subject-wise Marks
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(marksData.marks).map(([subject, marks]) => {
                  const gradeInfo = getGrade(marks);
                  return (
                    <tr key={subject} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">
                          {marks}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${gradeInfo.bgColor} ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          marks >= 60 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {marks >= 60 ? "Pass" : "Fail"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Additional Analytics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Risk Assessment */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="mr-2">⚠️</span>
            Risk Assessment
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Dropout Risk</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                (studentData.AttendancePercentage || 0) < 70 ? 
                "bg-red-100 text-red-800" : 
                (studentData.AttendancePercentage || 0) < 80 ? 
                "bg-yellow-100 text-yellow-800" : 
                "bg-green-100 text-green-800"
              }`}>
                {(studentData.AttendancePercentage || 0) < 70 ? "High" : 
                 (studentData.AttendancePercentage || 0) < 80 ? "Medium" : "Low"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Academic Risk</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                marksData && marksData.marks ? 
                  (() => {
                    const marks = Object.values(marksData.marks);
                    const average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
                    return average < 50 ? "bg-red-100 text-red-800" : 
                           average < 60 ? "bg-yellow-100 text-yellow-800" : 
                           "bg-green-100 text-green-800";
                  })() : 
                  "bg-gray-100 text-gray-800"
              }`}>
                {marksData && marksData.marks ? 
                  (() => {
                    const marks = Object.values(marksData.marks);
                    const average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
                    return average < 50 ? "High" : 
                           average < 60 ? "Medium" : "Low";
                  })() : 
                  "N/A"
                }
              </span>
            </div>
          </div>
        </div>

        {/* Family Background */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="mr-2">🏠</span>
            Family Background
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Parent Education</span>
              <span className="text-sm font-medium">
                {studentData.FatherEducation >= 3 ? "High" : 
                 studentData.FatherEducation >= 2 ? "Medium" : "Low"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Family Income</span>
              <span className="text-sm font-medium">
                {studentData.FamilyIncome || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Parent Occupation</span>
              <span className="text-sm font-medium text-right">
                {studentData.ParentOccupation || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="mr-2">💡</span>
            Recommendations
          </h3>
          <div className="space-y-2">
            {(studentData.AttendancePercentage || 0) < 80 && (
              <p className="text-sm text-orange-600">• Improve attendance rate</p>
            )}
            {marksData && marksData.marks && (() => {
              const marks = Object.values(marksData.marks);
              const average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
              return average < 60 && (
                <p className="text-sm text-red-600">• Focus on academic performance</p>
              );
            })()}
            <p className="text-sm text-blue-600">• Regular study schedule</p>
            <p className="text-sm text-green-600">• Maintain current performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
