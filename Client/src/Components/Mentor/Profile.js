
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, GraduationCap, MapPin, Phone } from "lucide-react";

const MentorProfile = () => {
  const userData = useSelector((state) => state.user.user);
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/getMentor?Email=${userData.Email}`
        );
        const result = await response.json();

        if (result.status === 200 && result.data?.length > 0) {
          setMentorData(result.data[0]);
        } else {
          setError("Mentor data not found");
        }
      } catch (err) {
        setError("Failed to fetch mentor data");
      } finally {
        setLoading(false);
      }
    };

    if (userData?.Email) {
      fetchMentorData();
    } else {
      setLoading(false);
      setError("User data not available");
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full"></div>
        <p className="ml-4 text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error || !mentorData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600 font-medium">{error || "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10 px-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-8 rounded-2xl shadow-lg flex justify-between items-center mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
            {mentorData.Name?.charAt(0) || "S"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{mentorData.Name}</h1>
            <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-sm">
              Position : Mentor / Counsellor
            </span>
          </div>
        </div>
        <div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700`}> Active </span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="flex flex-wrap gap-6">
        <Card title="Personal Details" className="min-w-5xl" icon={<User className="w-5 h-5" />}>
          <Info label="Email" value={mentorData.Email} />
          <Info label="Gender" value={mentorData.Gender} />
          <Info label="DOB" value={new Date(mentorData.DOB).toLocaleDateString()} />
          <Info label="Aadhar" value={mentorData.AadharNumber} />
          <Info label="Contact" value={mentorData.ContactNumber} />
        </Card>

        <Card title="Academic & Location" icon={<GraduationCap className="w-5 h-5" />}>
          <Info label="School" value={mentorData.SchoolID?.[0]?.Name} />
          <Info label="Medium" value={mentorData.SchoolID?.[0]?.Medium?.name} />
          <Info label="State" value={mentorData.State?.name} />
          <Info label="District" value={mentorData.District?.district} />
          <Info label="City" value={mentorData.City?.city} />
        </Card>
      </div>

      {/* Contact Information */}
      <Card title="Contact Information" icon={<Phone className="w-5 h-5 text-green-600" />}>
        <Info label="Mentor Email" value={mentorData.Email} />
        <Info label="Mentor Phone" value={mentorData.ContactNumber} />
      </Card>

      {/* Address */}
      {mentorData.Address && (
        <Card title="Address" icon={<MapPin className="w-5 h-5" />}>
          <p className="text-gray-700">{mentorData.Address}</p>
        </Card>
      )}
    </div>
  );
};

const Card = ({ title, icon, children }) => (
  <div className="bg-white w-800 shadow-md rounded-xl p-6 border border-gray-100 mt-6">
    <h3 className="flex items-center text-lg font-semibold text-gray-700 mb-4">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between gap-10">
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

export default MentorProfile;
