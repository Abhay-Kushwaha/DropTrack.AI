import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../../Store/axios";
import Swal from "sweetalert2";

const ManageSchedule = () => {
  const userData = useSelector((state) => state.user.user);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("info"); // success | error | info

  // Auto-hide flash message
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  // Fetch requests from counselling collection
  const fetchSessions = async () => {
    try {
      if (!userData?.School?._id) return;
      const res = await axios.get(`/school/${userData.School._id}`);
      console.log("Counselling data:", res.data);
      if (Array.isArray(res.data)) {
        // Flatten all Students from all docs into one array
        const allStudents = res.data.flatMap(c => c.Students);

        // Filter sessions where logged-in user is the mentor
        const mySessions = allStudents.filter(
          (s) => s.Mentor === userData.Email && !s.Schedule_date
        );
        setSessions(mySessions);
      }
      else if (res.data && res.data.Students) {
        // If backend returns a single counselling doc
        const mySessions = res.data.Students.filter(
          (s) => s.Mentor === userData.Email && !s.Schedule_date
        );
        setSessions(mySessions);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Schedule counselling date
  const handleSchedule = async (meetID, date) => {
    try {
      const res = await axios.put(`/schedule/${meetID}`, {
        scheduleDate: date,
      });
      if (res.data?.counselling) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: res.data.message || 'Meeting',
          showConfirmButton: false,
          timer: 1500
        });
        fetchSessions();
      }
    } catch (err) {
      console.error("Error scheduling:", err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.data?.message || 'Failed to schedule.',
      });
    }
  };

  return (
    <div className="w-full mx-auto my-6 px-3 sm:px-6">

      {/* Centered Heading */}
      <div className="text-center mb-12">
        <h1 className="text-3xl yb-5 font-extrabold text-slate-900 sm:text-5xl">
          Manage Your Meeting Requests
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Here are list of students that requested for scheduling Counselling. You can check & update the Schedule Date.
        </p>
      </div>

      <div className="bg-white w-full rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Table */}
        <div className="p-4 sm:p-6 pt-3 overflow-x-auto">
          {loading ? (
            <p className="text-gray-500">Loading requests...</p>
          ) : sessions.length === 0 ? (
            <p className="text-gray-500">No counselling requests found.</p>
          ) : (
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr className="text-left text-[13px] text-gray-600 uppercase tracking-wide">
                    <th className="py-3 px-3">Student</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">Parent Details</th>
                    <th className="py-3 px-3">Issue</th>
                    <th className="py-3 px-3">Requested On</th>
                    <th className="py-3 px-3">Schedule Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sessions.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50 text-sm">
                      <td className="py-3 px-3">{s.Studentdetails.name}</td>
                      <td className="py-3 px-3">
                        <div>{s.Studentdetails.phone}</div>
                        <div className="text-xs text-gray-500">{s.Student1}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div>{s.Studentdetails.parentPhone}</div>
                        <div className="text-xs text-gray-500">{s.Studentdetails.parentEmail}</div>
                      </td>
                      <td className="py-3 px-3">{s.issue || "-"}</td>
                      <td className="py-3 px-3">
                        {new Date(s.Created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      {/* Schedule Date */}
                      <td className="py-3 px-3">
                        <input
                          type="datetime-local"
                          defaultValue=""
                          min={new Date().toISOString().slice(0, 16)} // today onwards
                          onBlur={(e) =>
                            handleSchedule(s._id, e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageSchedule;
