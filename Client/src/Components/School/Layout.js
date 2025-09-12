import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Outlet,
  NavLink,
  Link,
  useNavigate,
  useLoaderData,
} from "react-router-dom";
import Swal from "sweetalert2";
import { UserActions } from "../../Store/UserData";
import image from "./../../Assets/logo.jpg";
import GoogleTranslate from "../GoogleTranslate"

const Layout = () => {
  const dispatch = useDispatch();
  dispatch(UserActions.getuserdata(useLoaderData()));
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const LogoutHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You redirect to Login page...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/");
      }
    });
  };

  return (
    <div className="bg-[#f8f9fa] font-family-karla flex ">
      <aside className="relative bg-gradient-to-b from-orange-600 to-amber-600 w-1/5  hidden sm:block shadow-xl shadow-gray-200 h-screen overflow-y-hidden ">
        <div className=" top-0 left-0 p-6 text-center">
          <img
            src={image}
            alt="symbol"
            className="opacity-70 w-36 h-36 rounded-full  m-auto  "
          />
          <Link
            to={"/school"}
            className="text-white text-3xl  first-letter:font-semibold uppercase hover:text-gray-300 "
          >
            School
          </Link>
        </div>
        <nav className="text-base font-semibold pt-3 overflow-y-scroll h-4/6">
          {/* Dashboard */}
          <div className="hover:bg-orange-800 hover:shadow-md">
            <Link
              to={"/school"}
              className="flex items-center text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
                />
              </svg>
              Dashboard
            </Link>
          </div>

          {/* Notifications */}
          <div className="hover:bg-orange-800 hover:shadow-md">
            <Link
              to={"notifications"}
              className="flex items-center text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V8.25A6.75 6.75 0 004.5 8.25v1.5a8.967 8.967 0 01-2.311 6.022c1.733.64 3.56 1.085 5.454 1.31m7.214 0a24.255 24.255 0 01-7.214 0m7.214 0a3 3 0 11-6 0" />
              </svg>
              Notifications
            </Link>
          </div>

          {/* Profile */}
          <div className="hover:bg-orange-800 hover:shadow-md">
            <Link
              to={"profile"}
              className="flex items-center text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a9.75 9.75 0 0115 0"
                />
              </svg>
              Profile
            </Link>
          </div>

          {/* Add New Mentor */}
          <div className="hover:bg-orange-800 hover:shadow-md">
            <Link
              to={"addnewmentor"}
              className="flex items-center text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add New Mentor
            </Link>
          </div>

          {/* Add New Student */}
          <div className="hover:bg-orange-800 hover:shadow-md">
            <Link
              to={"addnewstudent"}
              className="flex items-center text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add New Student
            </Link>
          </div>

          {/* Add Existing Student */}
          <div className="hover:bg-orange-800 hover:shadow-md">
            <Link
              to={"addexistingstudent"}
              className="flex items-center text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Existing Student
            </Link>
          </div>

          {/* Update Student Details */}
          <div className="hover:bg-orange-800 hover:shadow-md">
            <Link
              to={"updatestudentdetails"}
              className="flex items-center text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687 1.687a1.875 1.875 0 010 2.651l-9.193 9.193a4.5 4.5 0 01-1.897 1.13l-3.002.857.857-3.002a4.5 4.5 0 011.13-1.897l9.193-9.193a1.875 1.875 0 012.651 0z"
                />
              </svg>
              Update Student Details
            </Link>
          </div>

          {/* Predicted Students */}
          <div className="hover:bg-orange-800 hover:shadow-md">
            <Link
              to={"predicedstudents"}
              className="flex items-center text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Predicted Students
            </Link>
          </div>

          {/* Current Student */}
          <div className="hover:bg-orange-800 hover:shadow-md">
            <Link
              to={"currentstudent"}
              className="flex items-center text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952A4.125 4.125 0 0014.213 15M15 19.128V19.125c0-1.113-.285-2.16-.786-3.07M15 19.128v.106a12.318 12.318 0 01-6.376 1.766A12.318 12.318 0 012.25 19.128v-.109a6.375 6.375 0 0111.964-3.07"
                />
              </svg>
              Current Student
            </Link>
          </div>

          {/* Dropped Students */}
          <div className="hover:bg-orange-800 hover:shadow-md">
            <Link
              to={"dropedstudent"}
              className="flex items-center text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25l-7.5 7.5m0 0l-7.5-7.5m7.5 7.5V3"
                />
              </svg>
              Dropped Students
            </Link>
          </div>

          {/* Inactive Students */}
          <div className="hover:bg-orange-800 hover:shadow-md">
            <Link
              to={"inactivetudent"}
              className="flex items-center text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008v.008H12V16.5zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Inactive Students
            </Link>
          </div>
        </nav>
      </aside>

      <div className="w-full flex flex-col h-screen overflow-y-hidden ">
        <header className="w-full items-center bg-gradient-to-b from-orange-600 to-amber-600 shadow-gray-900 shadow-md  py-2 px-6 hidden sm:flex">
          <div className="w-1/2"></div>
          <div
            x-data="{ isOpen: false }"
            className="relative w-1/2 flex items-center justify-end"
          >
            <Link to={"/school/notifications"} className="mr-3 relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V8.25A6.75 6.75 0 004.5 8.25v1.5a8.967 8.967 0 01-2.311 6.022c1.733.64 3.56 1.085 5.454 1.31m7.214 0a24.255 24.255 0 01-7.214 0m7.214 0a3 3 0 11-6 0" />
              </svg>
            </Link>

            <div className="flex items-center gap-4">
              <div className="z-10 h-12 flex items-center px-2 bg-white rounded-lg hover:shadow-md hover:shadow-orange-800">
                <GoogleTranslate />
              </div>
              <button
                onClick={LogoutHandler}
                className="relative z-10 flex rounded-lg px-5 h-12 hover:shadow-md hover:shadow-gray-800 bg-white overflow-hidden hover:bg-gray-200 hover:border-gray-300 focus:border-gray-300 focus:outline-none "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 m-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                <div className="m-auto">Logout</div>
              </button>
            </div>

            {/* </NavLink> */}
            <button
              style={{ display: isOpen ? "block" : "none" }}
              onClick={() => setIsOpen(false)}
              className="h-full w-full fixed inset-0 cursor-default"
            ></button>
          </div>
        </header>

        <header
          x-data="{ isOpen: false }"
          className="w-full bg-[#3d68ff] py-5 px-6 sm:hidden"
        >
          <div className="flex items-center justify-between">
            <Link
              to={"/school"}
              className="text-white text-3xl  first-letter:font-semibold uppercase hover:text-gray-300 "
            >
              School
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white text-3xl focus:outline-none"
            >
              <svg
                style={{ display: isOpen ? "none" : "block" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <svg
                style={{ display: isOpen ? "block" : "none" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>

          <nav className={isOpen ? "flex flex-col" : "hidden"}>
            <Link
              to={""}
              className="flex items-center active-nav-link text-white py-2 pl-4 nav-item"
            >
              <i className="fas fa-tachometer-alt mr-3"></i>
              Dashboard
            </Link>
            <div>
              <div className="top-0 left-0 p-6 text-center">
                <GoogleTranslate />
              </div>
              <Link
                //   onClick={LogoutHandler}
                className="flex items-center active-nav-link text-white py-2 pl-4 nav-item"
              >
                <i className="fas fa-tachometer-alt mr-3"></i>
                Logout
              </Link>
            </div>
          </nav>
        </header>

        <div className="w-full overflow-x-hidden border-t flex flex-col scrollbar ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
