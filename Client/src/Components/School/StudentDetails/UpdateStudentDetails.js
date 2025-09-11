import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../../Store/axios";

const UpdateStudentDetails = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [marksFile, setMarksFile] = useState(null);
    const [marksMessage, setMarksMessage] = useState("");
    const [marksLoading, setMarksLoading] = useState(false);

    const [standard, setStandard] = useState("");
    const [subject, setSubject] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState("");

    // Attendance states
    const [attendanceFile, setAttendanceFile] = useState(null);
    const [attendanceStandard, setAttendanceStandard] = useState("");
    const [attendanceMessage, setAttendanceMessage] = useState("");
    const [attendanceLoading, setAttendanceLoading] = useState(false);

    // Get school_id from Redux
    const schoolData = useSelector((state) => state.user.user);
    const schoolId = schoolData.School._id;

    // Fetch subjects from backend
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get("/getSubjects");
                setSubjects(response.data || []);
            } catch (err) {
                console.error("Error fetching subjects:", err);
            }
        };
        fetchSubjects();
    }, []);

    // Download Excel Templates
    const handleDownloadTemplate = (type) => {
        let csvContent, fileName;

        if (type === 'fees') {
            csvContent = `Name,Number of unpaid month\n`;
            fileName = "student_fee_template.csv";
        } else if (type === 'marks') {
            csvContent = `Name,Marks\n`;
            fileName = "student_marks_template.csv";
        } else if (type === 'attendance') {
            csvContent = `Name,PercentageAttendance\n`;
            fileName = "student_attendance_template.csv";
        }

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // File change handler (Fees)
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Upload Fees Excel
    const handleUpload = async () => {
        if (!file) {
            setMessage("⚠️ Please select a file first!");
            return;
        }

        if (!schoolId) {
            setMessage("❌ School ID not found in Redux.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                `/feeupload/${schoolId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setMessage(`Upload successful: ${response.data.message}`);
        } catch (error) {
            console.error("Upload error:", error);
            setMessage(
                `❌ Error: ${error.response?.data?.message || "Something went wrong"}`
            );
        } finally {
            setLoading(false);
        }
    };

    // File change handler (Marks)
    const handleMarksFileChange = (e) => {
        setMarksFile(e.target.files[0]);
    };

    // Add new subject if not found
    const handleAddSubject = async () => {
        if (!newSubject.trim()) return;

        try {
            const response = await axios.post("/addSubject", { Name: newSubject });
            setSubjects((prev) => [...prev, response.data]); // update dropdown
            setNewSubject("");
            setSubject(response.data._id); // select newly added
        } catch (err) {
            console.error("Error adding subject:", err);
            alert("❌ Failed to add subject");
        }
    };

    // Handle Attendance File Change
    const handleAttendanceFileChange = (e) => {
        setAttendanceFile(e.target.files[0]);
        setAttendanceMessage(""); // Clear any previous messages
    };

    // Upload Attendance Excel
    const handleAttendanceUpload = async () => {
        if (!attendanceFile) {
            setAttendanceMessage("⚠️ Please select a file first!");
            return;
        }

        if (!schoolId || !attendanceStandard) {
            setAttendanceMessage("❌ School ID and Standard are required.");
            return;
        }

        setAttendanceLoading(true);
        setAttendanceMessage("");

        try {
            const formData = new FormData();
            formData.append("file", attendanceFile);
            formData.append("standard", attendanceStandard);

            const response = await axios.post(
                `/uploadattendance/${schoolId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setAttendanceMessage(`Attendance uploaded successfully!`);
            setAttendanceFile(null);
            setAttendanceStandard("");
            // Reset the file input element
            const fileInput = document.getElementById('attendance-file');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error("Attendance upload error:", error);
            setAttendanceMessage(
                `❌ Error: ${error.response?.data?.message || "Something went wrong"}`
            );
        } finally {
            setAttendanceLoading(false);
        }
    };

    // Upload Marks Excel
    const handleMarksUpload = async () => {
        if (!marksFile) {
            setMarksMessage("⚠️ Please select a file first!");
            return;
        }

        if (!schoolId || !standard || !subject) {
            setMarksMessage("❌ School ID, Standard and Subject are required.");
            return;
        }

        setMarksLoading(true);
        setMarksMessage("");

        try {
            const formData = new FormData();
            formData.append("file", marksFile);
            formData.append("standard", standard);
            formData.append("subject", subject);

            const response = await axios.post(
                `/marksupload/${schoolId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setMarksMessage(`Marks uploaded: ${response.data.message}`);
            setMarksFile(null); // Clear the file input
            setStandard(""); // Reset standard
            setSubject(""); // Reset subject
            // Reset the file input element
            const fileInput = document.getElementById('marks-file');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error("Marks upload error:", error);
            setMarksMessage(
                `❌ Error: ${error.response?.data?.message || "Something went wrong"}`
            );
        } finally {
            setMarksLoading(false);
        }
    };

    // Reusable styles for form elements for consistency
    const inputBaseStyles = "block w-full rounded-lg border-0 py-2.5 px-3.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6 transition-all duration-200";
    const buttonBaseStyles = "w-half flex items-center justify-center gap-x-2 rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="min-h-screen w-full bg-slate-50 p-10 mb-20 font-sans">
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ================= Fees Update Card ================= */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold text-slate-800">
                            Update Fee Details
                        </h2>
                        <p className="text-slate-500">
                            Upload a spreadsheet to bulk-update student fee information.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <button onClick={() => handleDownloadTemplate('fees')} className={buttonBaseStyles}>
                            📥
                            <span>Download Template</span>
                        </button>

                        <div>
                            <label htmlFor="fee-file" className="block text-sm font-medium leading-6 text-slate-900">
                                Fee Data File
                            </label>
                            <input
                                id="fee-file"
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                                className={`${inputBaseStyles} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100`}
                            />
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className={buttonBaseStyles}
                        >
                            {loading ? "⏳ Uploading..." : "📤 Upload Fee File"}
                        </button>
                    </div>

                    {message && (
                        <p className="!mt-6 text-center text-sm font-medium text-slate-600 rounded-md bg-slate-100 p-3">
                            {message}
                        </p>
                    )}
                </div>

                {/* ================= Marks Update Card ================= */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold text-slate-800">
                            Update Student Marks
                        </h2>
                        <p className="text-slate-500">
                            Select a standard and subject, then upload the marks spreadsheet.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Standard Dropdown */}
                        <div>
                            <label htmlFor="standard" className="block text-sm font-medium leading-6 text-slate-900">Standard</label>
                            <select
                                id="standard"
                                value={standard}
                                onChange={(e) => setStandard(e.target.value)}
                                className={inputBaseStyles}
                            >
                                <option value="">Select Standard</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>{`Class ${num}`}</option>
                                ))}
                            </select>
                        </div>

                        {/* Subject Dropdown */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium leading-6 text-slate-900">Subject</label>
                            <select
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className={inputBaseStyles}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((subj) => (
                                    <option key={subj._id} value={subj._id}>
                                        {subj.Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Add New Subject */}
                    <div>
                        <label htmlFor="new-subject" className="block text-sm font-medium leading-6 text-slate-900">Or Add a New Subject</label>
                        <div className="flex items-center space-x-3">
                            <input
                                id="new-subject"
                                type="text"
                                value={newSubject}
                                onChange={(e) => setNewSubject(e.target.value)}
                                placeholder="e.g., Computer Science"
                                className={inputBaseStyles}
                            />
                            <button
                                onClick={handleAddSubject}
                                className="rounded-lg bg-slate-700 text-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-800 transition-colors"
                            >
                                ➕ Add
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <button onClick={() => handleDownloadTemplate('marks')} className={`${buttonBaseStyles} bg-slate-600 hover:bg-slate-700`}>
                            📥
                            <span>Download Marks Template</span>
                        </button>

                        <div>
                            <label htmlFor="marks-file" className="block text-sm font-medium leading-6 text-slate-900">
                                Marks Data File
                            </label>
                            <input
                                id="marks-file"
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleMarksFileChange}
                                className={`${inputBaseStyles} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100`}
                            />
                        </div>

                        <button
                            onClick={handleMarksUpload}
                            disabled={marksLoading}
                            className={buttonBaseStyles}
                        >
                            {marksLoading ? "⏳ Uploading..." : "📤 Upload Marks File"}
                        </button>
                    </div>

                    {marksMessage && (
                        <p className="!mt-6 text-center text-sm font-medium text-slate-600 rounded-md bg-slate-100 p-3">
                            {marksMessage}
                        </p>
                    )}
                </div>

                {/* ================= Attendance Update Card ================= */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold text-slate-800">
                            Update Student Attendance
                        </h2>
                        <p className="text-slate-500">
                            Upload attendance records for students class-wise.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4 mb-10">
                        {/* Standard Dropdown */}
                        <div>
                            <label htmlFor="attendance-standard" className="block text-sm font-medium leading-6 text-slate-900">
                                Standard
                            </label>
                            <select
                                id="attendance-standard"
                                value={attendanceStandard}
                                onChange={(e) => setAttendanceStandard(e.target.value)}
                                className={inputBaseStyles}
                            >
                                <option value="">Select Standard</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>{`Class ${num}`}</option>
                                ))}
                            </select>
                        </div>

                        {/* Template Download Button */}
                        <button
                            onClick={() => handleDownloadTemplate('attendance')}
                            className={`${buttonBaseStyles} bg-green-600 hover:bg-green-700`}
                        >
                            📥 Download Attendance Template
                        </button>

                        {/* File Upload */}
                        <div>
                            <label htmlFor="attendance-file" className="block text-sm font-medium leading-6 text-slate-900">
                                Attendance Data File
                            </label>
                            <input
                                id="attendance-file"
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleAttendanceFileChange}
                                className={`${inputBaseStyles} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100`}
                            />
                        </div>

                        {/* Upload Button */}
                        <button
                            onClick={handleAttendanceUpload}
                            disabled={attendanceLoading || !attendanceFile || !attendanceStandard}
                            className={buttonBaseStyles}
                        >
                            {attendanceLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <>📤 Upload Attendance File</>
                            )}
                        </button>

                        {/* Message Display */}
                        {attendanceMessage && (
                            <div className={`text-center text-sm font-medium rounded-md p-3 ${attendanceMessage.includes("❌")
                                    ? "bg-red-50 text-red-700"
                                    : attendanceMessage.includes("⚠️")
                                        ? "bg-yellow-50 text-yellow-700"
                                        : "bg-green-50 text-green-700"
                                }`}>
                                {attendanceMessage}
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default UpdateStudentDetails;
