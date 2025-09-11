import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../../Store/axios";
import Swal from "sweetalert2";

const ScheduleMeeting = () => {
  const userData = useSelector((state) => state.user.user);
  const [rows, setRows] = useState([]);
  const [feeling, setFeeling] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info"); // success | error | info

  // Auto-dismiss flash messages
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  // Load counselling history for this student
  useEffect(() => {
    const fetchCounselling = async () => {
      try {
        if (!userData?.School?._id) return;
        const res = await axios.get(`/school/${userData.School._id}`);

        if (Array.isArray(res.data)) {
          // Flatten all Students from all counselling docs
          const allStudents = res.data.flatMap(c => c.Students || []);
          const mySessions = allStudents.filter(
            (s) => s.Student1 === userData.Email
          );

          setRows(
            mySessions.map((s) => ({
              mentor: s.MentorName || "-",
              date: s.Schedule_date || null,
              issue: s.issue || "-",
              Created_at: s.Created_at || "-",
              link: s.meetingLink || "",
              isSatisfied: s.is_Satisfied || false,
              isContacted: s.is_Contacted || false,
              _id: s._id,
            }))
          );

          console.log("My Sessions:", mySessions);
        } else if (res.data && res.data.Students) {
          // Fallback if backend ever returns a single doc
          const mySessions = res.data.Students.filter(
            (s) => s.Student1 === userData.Email
          );

          setRows(
            mySessions.map((s) => ({
              mentor: s.MentorName || "-",
              date: s.Schedule_date || null,
              issue: s.issue || "-",
              Created_at: s.Created_at || "-",
              link: s.meetingLink || "",
              isSatisfied: s.is_Satisfied || false,
              isContacted: s.is_Contacted || false,
              _id: s._id,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch counselling data:", err);
      }
    };
    fetchCounselling();
  }, [userData]);

  // Request counselling
  const handleRequest = async () => {
    if (!feeling) {
      setMessageType("error");
      setMessage("Please mention your issues before requesting counselling.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await axios.post(`/meetrequest/${userData.School._id}`, {
        message: feeling,
        email: userData.Email,
      });
      if (res.data?.counselling) {
        const studentData = res.data.counselling.Students.find(
          (s) => s.Student1 === userData.Email
        );
        if (studentData) {
          setRows((prev) => [
            ...prev,
            {
              mentor: studentData.MentorName || "-",
              date: studentData.Schedule_date || null,
              issue: studentData.issue || "-",
              Created_at: studentData.Created_at || "-",
              link: studentData.meetingLink || "",
              isSatisfied: studentData.is_Satisfied || false,
              isContacted: studentData.is_Contacted || false,
              _id: studentData._id,
            },
          ]);
        }
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Counselling request sent successfully',
          showConfirmButton: false,
          timer: 1500
        });
        setFeeling("");
      }
    } catch (err) {
      console.error("Failed to request counselling:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to send counselling request',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Student updates satisfaction
  const handleSatisfaction = async (id, isSatisfied) => {
    try {
      await axios.put(`/satisfaction/${id}`, {
        isSatisfied,
      });
      setRows((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, isSatisfied } : r
        )
      );
    } catch (err) {
      console.error("Failed to update satisfaction:", err);
    }
  };

  return (
    <div className="w-full mx-auto my-6 px-3 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Counselling & Meetings</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Counselling Request Form */}
        <div className="flex items-start justify-between p-4 sm:p-6 gap-6 flex-col lg:flex-row">
          <div className="flex-1 lg:pr-6 w-full">
            <div className="mb-5">
              <label className="block text-sm text-gray-600 mb-1">
                Mention your issues
              </label>
              <textarea
                rows="3"
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
              />
            </div>
          </div>

          <div className="w-full lg:w-64">
            <button
              disabled={submitting || rows.some(r => !r.isContacted)}
              onClick={handleRequest}
              className={`w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-sm border transition-colors ${submitting || rows.some(r => !r.isContacted)
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-orange-600 text-white border-orange-600 hover:bg-orange-700"
                }`}
            >
              {submitting ? "Sending..." : (rows.some(r => !r.isContacted) ? "Wait for mentor contact" : "Request Counselling")}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="px-6 text-gray-600">Your Counselling Sessions</div>
        <div className="p-4 sm:p-6 pt-3 overflow-x-auto">
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-[13px] text-gray-600 uppercase tracking-wide">
                  <th className="py-3 pl-4 pr-3 w-12">#</th>
                  <th className="py-3 px-3">Mentor</th>
                  <th className="py-3 px-3">Issue</th>
                  <th className="py-3 px-3">Requested On</th>
                  <th className="py-3 px-3">Schedule Date</th>
                  <th className="py-3 px-3">Meet link</th>
                  <th className="py-3 px-3">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-6 text-center text-sm text-gray-500"
                    >
                      No counselling sessions yet
                    </td>
                  </tr>
                ) : (
                  rows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-3 pl-4 pr-3 text-sm text-gray-700">
                        {i + 1}
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-900">
                        {row.mentor || "-"}
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-900">
                        {row.issue || "-"}
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-900">
                        {row.Created_at ? (
                          <div>
                            <div className="text-gray-900">
                              {new Date(row.Created_at).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(row.Created_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        ) : (
                          "Not Scheduled"
                        )}
                      </td>
                      <td className="py-3 px-3 text-sm">
                        {row.date ? (
                          <div>
                            <div className="text-gray-900">
                              {new Date(row.date).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(row.date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        ) : (
                          "Not Scheduled"
                        )}
                      </td>
                      <td>
                        {row.link && (
                          <a
                            href={row.link}
                            className="text-blue-600 text-sm bg-blue-100 rounded-full px-2 p-1 hover:bg-blue-200 mt-1 inline-block"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Join Meeting
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-3 text-sm">
                        <label className="inline-flex items-center gap-2 text-gray-700">
                          <input
                            type="checkbox"
                            checked={row.isSatisfied}
                            onChange={(e) =>
                              handleSatisfaction(row._id, e.target.checked)
                            }
                            disabled={!row.isContacted}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          {row.isSatisfied ? "Satisfied" : "Not Rated"}
                        </label>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMeeting;
