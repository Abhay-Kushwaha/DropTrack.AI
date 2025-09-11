import React from "react";
import { useSelector } from "react-redux";

const AuthorityProfile = () => {
  const userData = useSelector((state) => state.user.user);
  const profileImage = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; 
  // Generic authority badge icon from Flaticon

  return (
    <div className="container mx-auto my-12 flex justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full flex flex-col items-center">
        {/* Profile Image */}
        <img
          src={profileImage}
          alt="Authority Emblem"
          className="w-32 h-32 rounded-full border-4 border-amber-400 mb-6 object-cover bg-white p-2"
        />

        {/* Name and Role */}
        <h2 className="text-3xl font-bold text-gray-800 font-serif mb-1 text-center">
          {userData.Name}
        </h2>
        <p className="text-xl font-semibold text-amber-600 mb-6 text-center">
          {userData.State.name} Authority
        </p>

        {/* Info List */}
        <div className="w-full">
          <ul className="space-y-4">
            <li className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">E-mail</span>
              <span className="text-gray-800">{userData.Email}</span>
            </li>
            <li className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">State</span>
              <span className="text-gray-800">{userData.State.name}</span>
            </li>
            <li className="flex justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">Phone</span>
              <span className="text-gray-800">{userData.ContactNumber}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthorityProfile;
