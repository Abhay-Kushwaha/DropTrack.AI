import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

const MarksAnalytics = () => {
  const userData = useSelector((state) => state.user.user);
  const [studentData, setStudentData] = useState(null);
  const [marksData, setMarksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [lineSeries, setLineSeries] = useState([]);
  const [lineOptions, setLineOptions] = useState({
    chart: { type: "line", height: 300, toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    xaxis: { categories: [], labels: { rotateAlways: false, rotate: -45 } },
    yaxis: { max: 100, min: 0, tickAmount: 5, labels: { formatter: (v) => `${Math.round(v)}%` } },
    colors: ["#2563eb"],
    grid: { strokeDashArray: 4 },
  });
  const [barSeries, setBarSeries] = useState([]);
  const [barOptions, setBarOptions] = useState({
    chart: { type: "bar", height: 320, toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
    dataLabels: { enabled: false },
    xaxis: { categories: [], labels: { hideOverlappingLabels: true, rotate: -30, trim: true } },
    yaxis: { max: 100, min: 0, tickAmount: 5, labels: { formatter: (v) => `${Math.round(v)}%` } },
    colors: ["#10b981"],
    grid: { strokeDashArray: 4 },
  });

  useEffect(() => {
    const fetchStudentMarks = async () => {
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
                const data = marksResult.data;
                // Debug aid during integration
                console.log("[MarksAnalytics] fetched marks payload", data);
                let studentMarks = null;
                const sid = String(student._id);
                if (data && Array.isArray(data.Students)) {
                  studentMarks = data.Students.find((s) => {
                    const ss = s.Student1;
                    if (!ss) return false;
                    if (typeof ss === "string") return ss === sid;
                    if (typeof ss === "object") return String(ss._id || ss.id) === sid;
                    return false;
                  });
                }
                // Sometimes API may already return the exact marks object
                if (!studentMarks && data && data.marks) {
                  studentMarks = data;
                }
                if (studentMarks && studentMarks.marks) {
                  setMarksData(studentMarks);
                } else {
                  setError("Marks not found for this student");
                }
              }
            } catch (marksError) {
              console.log("Marks data not available:", marksError);
            }
          }
        } else {
          setError("Student data not found");
        }
      } catch (err) {
        console.error("Error fetching student marks:", err);
        setError("Failed to fetch student marks");
      } finally {
        setLoading(false);
      }
    };

    if (userData && userData.Email) {
      fetchStudentMarks();
    } else {
      setLoading(false);
      setError("User data not available");
    }
  }, [userData]);

  // Helpers for new marks structure
  const getAverage = (value) => {
    if (Array.isArray(value)) {
      if (value.length === 0) return 0;
      const sum = value.reduce((s, v) => s + (Number(v) || 0), 0);
      return sum / value.length;
    }
    return Number(value) || 0;
  };

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

  // Helper function to get bar color based on marks
  const getBarColor = (marks) => {
    if (marks >= 90) return "bg-gradient-to-t from-green-500 to-green-400";
    if (marks >= 80) return "bg-gradient-to-t from-green-400 to-green-300";
    if (marks >= 70) return "bg-gradient-to-t from-blue-500 to-blue-400";
    if (marks >= 60) return "bg-gradient-to-t from-blue-400 to-blue-300";
    if (marks >= 50) return "bg-gradient-to-t from-yellow-500 to-yellow-400";
    if (marks >= 40) return "bg-gradient-to-t from-yellow-400 to-yellow-300";
    return "bg-gradient-to-t from-red-500 to-red-400";
  };

  // Build chart series when marksData changes
  useEffect(() => {
    if (!marksData || !marksData.marks) return;
    const subjects = Object.keys(marksData.marks || {});
    const preferred = selectedSubject && subjects.includes(selectedSubject)
      ? selectedSubject
      : (subjects[0] || "");
    if (preferred !== selectedSubject) {
      setSelectedSubject(preferred);
    }
    // Line chart for preferred subject
    const subjectValue = preferred ? marksData.marks[preferred] : undefined;
    const seriesData = Array.isArray(subjectValue)
      ? subjectValue.map((n) => Number(n) || 0)
      : (subjectValue !== undefined ? [Number(subjectValue) || 0] : []);
    const categories = seriesData.length > 0
      ? seriesData.map((_, idx) => `Test ${idx + 1}`)
      : ["Test 1"];
    setLineSeries([{ name: preferred || "Subject", data: seriesData }]);
    setLineOptions((opt) => ({ ...opt, xaxis: { ...opt.xaxis, categories } }));

    // Bar chart for all subjects by average percentage
    const barCats = subjects;
    const barData = subjects.map((s) => Math.round(getAverage(marksData.marks[s])));
    setBarSeries([{ name: "Average %", data: barData }]);
    setBarOptions((opt) => ({ ...opt, xaxis: { ...opt.xaxis, categories: barCats } }));
  }, [marksData, selectedSubject]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p className="ml-4 text-gray-500 text-lg">Loading marks analytics...</p>
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

  const maxMarks = 100;

  return (
    <div className="max-w-7xl mx-auto my-6 px-3 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Marks Analytics</h1>
        <p className="text-gray-600">Subject-wise performance analysis with visual charts</p>
      </div>

      {/* Student Info Card */}
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {studentData.Name?.charAt(0) || "S"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{studentData.Name || "N/A"}</h2>
              <p className="text-gray-500">Roll Number: {studentData.RollNumber || "N/A"}</p>
              <p className="text-gray-500">Standard: {studentData.Standard || "N/A"}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-2">
              {studentData.SchoolID?.[0]?.Name || "N/A"}
            </div>
            <div className="text-sm text-gray-500">
              {studentData.SchoolID?.[0]?.Medium?.name || "N/A"} Medium
            </div>
          </div>
        </div>
      </div>

      {marksData && marksData.marks ? (
        <>
          {/* Subject selector + Line chart */}
          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-8 border border-gray-100 mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-4 flex-wrap">
              <h3 className="text-2xl font-semibold text-gray-700 flex items-center">
                <span className="mr-2">📈</span>
                Subject Trend
              </h3>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {Object.keys(marksData.marks).map((subj) => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>
            <div className="-mx-2 sm:mx-0 overflow-x-auto">
              <ReactApexChart options={lineOptions} series={lineSeries} type="line" height={300} />
            </div>
          </div>

          {/* All subjects average percentage bar chart */}
          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-8 border border-gray-100 mb-6 sm:mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
              <span className="mr-2">🧮</span>
              All Subjects - Average %
            </h3>
            <div className="-mx-2 sm:mx-0 overflow-x-auto">
              <ReactApexChart options={barOptions} series={barSeries} type="bar" height={320} />
            </div>
          </div>
          {/* Bar Chart Section */}
          <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100 mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
              <span className="mr-2">📊</span>
              Subject-wise Marks Bar Chart
            </h3>
            
            {/* Chart Container */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-end justify-between space-x-4 h-80">
                {Object.entries(marksData.marks)
                  .map(([subject, value]) => {
                    const avgValue = getAverage(value);
                    return { subject, avg: Math.round(avgValue), avgValue };
                  })
                  .sort((a, b) => b.avg - a.avg)
                  .map(({ subject, avg, avgValue }) => {
                    const height = (avgValue / 100) * 100; // exact proportional height
                    const gradeInfo = getGrade(avg);
                    const barColor = getBarColor(avg);
                    return (
                      <div key={subject} className="flex flex-col items-center group h-full w-20 sm:w-24 md:w-28">
                        {/* Bar */}
                        <div className="relative w-full h-full flex flex-col justify-end items-center">
                          <div
                            className={`w-full rounded-t-lg transition-all duration-500 hover:shadow-lg ${barColor}`}
                            style={{ height: `${height}%`, minHeight: '8px' }}
                          >
                            {/* Value Label (always visible) */}
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded shadow">
                              {avg}%
                            </div>
                          </div>
                          {/* Grade Badge */}
                          <div className={`${gradeInfo.bgColor} ${gradeInfo.color} mt-2 px-2 py-1 rounded-full text-xs font-semibold`}>
                            {gradeInfo.grade}
                          </div>
                        </div>
                        {/* Subject Name */}
                        <div className="mt-4 text-center">
                          <p className="text-sm font-medium text-gray-800 capitalize break-words">
                            {subject}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Avg: {avg}%</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              {/* Y-axis Labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Average Marks */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Marks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(() => {
                      const values = Object.values(marksData.marks);
                      const averages = values.map((v) => getAverage(v));
                      const avg = averages.reduce((s, v) => s + v, 0) / (averages.length || 1);
                      return Math.round(avg);
                    })()}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">📈</span>
                </div>
              </div>
            </div>

            {/* Total Subjects */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.keys(marksData.marks).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-xl">📚</span>
                </div>
              </div>
            </div>

            {/* Highest Score */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Highest Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(() => {
                      const values = Object.values(marksData.marks).map((v) => Math.round(getAverage(v)));
                      return Math.max(...values);
                    })()}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-xl">🏆</span>
                </div>
              </div>
            </div>

            {/* Pass Rate */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(() => {
                      const values = Object.values(marksData.marks).map((v) => getAverage(v));
                      const pass = values.filter((v) => v >= 40).length;
                      return Math.round((pass / (values.length || 1)) * 100);
                    })()}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 text-xl">✅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Marks Table */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                <span className="mr-2">📋</span>
                Detailed Marks Breakdown
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(marksData.marks).map(([subject, marks]) => {
                    const avg = getAverage(marks);
                    const gradeInfo = getGrade(avg);
                    const performance = avg >= 80 ? "Excellent" : 
                                      avg >= 70 ? "Good" : 
                                      avg >= 60 ? "Average" : 
                                      avg >= 40 ? "Below Average" : "Poor";
                    const performanceColor = avg >= 80 ? "text-green-600" : 
                                           avg >= 70 ? "text-blue-600" : 
                                           avg >= 60 ? "text-yellow-600" : 
                                           avg >= 40 ? "text-orange-600" : "text-red-600";
                    
                    return (
                      <tr key={subject} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-semibold">{Math.round(avg)}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${gradeInfo.bgColor} ${gradeInfo.color}`}>
                            {gradeInfo.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${avg >= 40 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {avg >= 40 ? "Pass" : "Fail"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${performanceColor}`}>
                            {performance}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white shadow-lg rounded-xl p-12 border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-4xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Marks Data Available</h3>
          <p className="text-gray-500 mb-4">
            Marks data has not been uploaded for your school yet.
          </p>
          <p className="text-sm text-gray-400">
            Please contact your school administration to upload marks data.
          </p>
        </div>
      )}
    </div>
  );
};

export default MarksAnalytics;
