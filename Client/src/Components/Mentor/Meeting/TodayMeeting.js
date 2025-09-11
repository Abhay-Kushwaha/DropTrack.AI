import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../../Store/axios";
import Swal from "sweetalert2";

const TodayMeeting = () => {
  const userData = useSelector((state) => state.user.user); // mentor logged in
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchSessions();
  }, [selectedDate]);

  // Fetch requests from counselling collection
  const fetchSessions = async () => {
    try {
      if (!userData?.School?._id) return;
      const res = await axios.get(`/school/${userData.School._id}`);
      console.log("Counselling data:", res.data);

      const selectedDateStr = new Date(selectedDate).toDateString();

      if (Array.isArray(res.data)) {
        // Flatten all Students from all docs
        const allStudents = res.data.flatMap(c => c.Students || []);

        const mySessions = allStudents.filter(s =>
          s.Mentor === userData.Email &&
          s.Schedule_date &&
          new Date(s.Schedule_date).toDateString() === selectedDateStr
        );

        setSessions(mySessions);
      } else if (res.data && res.data.Students) {
        const mySessions = res.data.Students.filter(s =>
          s.Mentor === userData.Email &&
          s.Schedule_date &&
          new Date(s.Schedule_date).toDateString() === selectedDateStr
        );

        setSessions(mySessions);
      }
    }
    catch (err) {
      console.error("Error fetching counselling:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Some Error Occured',
        showConfirmButton: false,
        timer: 1500
      });
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [userData]);

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
          text: 'Schedule updated successfully',
          showConfirmButton: false,
          timer: 1500
        });
        fetchSessions();
      }
    } catch (err) {
      console.error("Error scheduling:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.message,
        showConfirmButton: false,
        timer: 1500
      });
      // setMessage("Failed to schedule.");
    }
  };

  // Add meeting link
  const handleAddLink = async (meetID, link) => {
    try {
      await axios.put(`/addlink/${meetID}`, {
        meetingLink: link,
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Meeting link has been added',
        showConfirmButton: false,
        timer: 1500
      });
      fetchSessions();
    } catch (err) {
      console.error("Error adding link:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Some Error Occured',
        showConfirmButton: false,
        timer: 1500
      });
      // setMessage("Failed to add link.");
    }
  };

  // Conclude counselling
  const handleConclude = async (meetID, conclusion) => {
    try {
      await axios.put(`/conclude/${meetID}`, {
        Concluded_msg: conclusion,
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Meeting has been concluded',
        showConfirmButton: false,
        timer: 1500
      });
      fetchSessions();
    } catch (err) {
      console.error("Error concluding:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Some Error Occured',
        showConfirmButton: false,
        timer: 1500
      });
      // setMessage("Failed to conclude.");
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

        {/* Centered Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl yb-5 font-extrabold text-slate-900 sm:text-5xl">
            Your Meetings
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Here are your scheduled meetings. Select a date to view meetings for that day.
          </p>
        </div>

        {/* Date Selector */}
        <div className="mb-8 flex justify-center space-x-4 items-center">
          <button
            onClick={() => {
              const prevDate = new Date(selectedDate);
              prevDate.setDate(prevDate.getDate() - 1);
              setSelectedDate(prevDate.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            ←
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={() => {
              const nextDate = new Date(selectedDate);
              nextDate.setDate(nextDate.getDate() + 1);
              setSelectedDate(nextDate.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            →
          </button>
        </div>

        {/* Table */}
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
                      {/* <th className="py-3 px-3">Issue</th> */}
                      <th className="py-3 px-3">Contact Details</th>
                      <th className="py-3 px-3">Issue</th>
                      <th className="py-3 px-3">Schedule Time</th>
                      <th className="py-3 px-3">Meeting Link</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sessions.map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50 text-sm">
                        <td className="py-3 px-3">
                          <div className="font-medium">{s.Studentdetails.name}</div>
                          <div className="text-xs text-gray-500">{s.Student1}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div>{s.Studentdetails.phone}</div>
                          <div className="text-xs text-gray-500">Parent: {s.Studentdetails.parentPhone}</div>
                        </td>
                        <td className="py-3 px-3">{s.issue || "-"}</td>
                        <td className="py-3 px-3">
                          <div>
                            {new Date(s.Schedule_date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {s.meetingLink ? (
                            <a
                              href={s.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200"
                            >
                              Join Meeting
                            </a>
                          ) : (
                            <input
                              type="url"
                              placeholder="Add meeting link..."
                              onBlur={(e) => handleAddLink(s._id, e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1"
                            />
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {s.Concluded_msg ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                const conclusion = prompt("Enter conclusion message:");
                                if (conclusion) handleConclude(s._id, conclusion);
                              }}
                              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                            >
                              Conclude
                            </button>
                          )}
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
    </div>
  );
};

export default TodayMeeting;

