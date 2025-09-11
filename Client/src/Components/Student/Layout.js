import React, { useState } from "react";
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
const Layout = () => {
  const dispatch = useDispatch();
  dispatch(UserActions.getuserdata(useLoaderData()));
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSidebar, setSelectedSidebar] = useState("profile");
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
  return( 
  <div className="bg-amber-50 font-family-karla flex">
    {/* Sidebar */}
    <aside className="relative bg-gradient-to-b from-orange-600 to-amber-600 w-1/5 hidden sm:block shadow-xl shadow-orange-200 h-screen overflow-y-hidden">
      <div className="top-0 left-0 p-6 text-center">
        <img
          src={image}
          alt="student symbol"
          className="opacity-90 w-36 h-36 rounded-full m-auto shadow-lg"
        />
        <Link
          to={"/student"}
          className="text-white text-3xl first-letter:font-semibold uppercase hover:text-orange-100 transition-colors duration-300"
        >
          Student Panel
        </Link>
      </div>

      {/* Sidebar nav */}
      <nav className="text-base font-semibold pt-3 overflow-y-scroll h-4/6">
        <div className={`hover:shadow-orange-900 hover:shadow-md hover:bg-orange-900/40 transition-all duration-300 ${selectedSidebar === "profile" ? "border-orange-900 bg-orange-900/80" : ""}`} onClick={() => setSelectedSidebar("profile")}>
          <Link
            to={"/student"}
            className="flex items-center active-nav-link text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-orange-900 hover:text-orange-100 transition-colors duration-300"
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            Profile
          </Link>
        </div>
        
        <div className={`hover:shadow-orange-900 hover:shadow-md hover:bg-orange-900/40 transition-all duration-300 ${selectedSidebar === "analytics" ? "border-orange-900 bg-orange-900/80" : ""}`} onClick={() => setSelectedSidebar("analytics")}>
          <Link
            to={"analytics"}
            className="flex items-center active-nav-link text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-orange-900 hover:text-orange-100 transition-colors duration-300"
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
                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
              />
            </svg>
            Overall Analytics
          </Link>
        </div>
        
        <div className={`hover:shadow-orange-900 hover:shadow-md hover:bg-orange-900/40 transition-all duration-300 ${selectedSidebar === "marks" ? "border-orange-900 bg-orange-900/80" : ""}`} onClick={() => setSelectedSidebar("marks")}>
          <Link
            to={"marks"}
            className="flex items-center active-nav-link text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-orange-900 hover:text-orange-100 transition-colors duration-300"
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
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              />
            </svg>
            Marks Analytics
          </Link>
        </div>
        
        {/* Prediction Board (temporarily disabled) */}
        {false && (
        <div className={`hover:shadow-orange-900 hover:shadow-md hover:bg-orange-900/40 transition-all duration-300 ${selectedSidebar === "prediction" ? "border-orange-900 bg-orange-900/80" : ""}`} onClick={() => setSelectedSidebar("prediction")}>
          <Link
            to={"prediction"}
            className="flex items-center active-nav-link text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-orange-900 hover:text-orange-100 transition-colors duration-300"
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
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
            Prediction Board
          </Link>
        </div>
        )}
        
        <div className={`hover:shadow-orange-900 hover:shadow-md hover:bg-orange-900/40 transition-all duration-300 ${selectedSidebar === "schedule" ? "border-orange-900 bg-orange-900/80" : ""}`} onClick={() => setSelectedSidebar("schedule")}>
          <Link
            to={"schedule"}
            className="flex items-center active-nav-link text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-orange-900 hover:text-orange-100 transition-colors duration-300"
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
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5"
              />
            </svg>
            Schedule Meet
          </Link>
        </div>
        
        <div className={`hover:shadow-orange-900 hover:shadow-md hover:bg-orange-900/40 transition-all duration-300 ${selectedSidebar === "notifications" ? "border-orange-900 bg-orange-900/80" : ""}`} onClick={() => setSelectedSidebar("notifications")}>
            <Link
            to={"notifications"}
            className="flex items-center active-nav-link text-white py-4 pl-6 nav-item gap-2 focus:outline-none focus:shadow-md focus:shadow-orange-900 hover:text-orange-100 transition-colors duration-300"
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
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            Notifications
            </Link>
          </div>
      </nav>
    </aside>

    {/* Main content area */}
    <div className="w-full flex flex-col h-screen overflow-y-hidden">
      {/* Top header */}
      <header className="w-full items-center bg-gradient-to-r from-orange-500 to-amber-500 shadow-orange-300 shadow-md py-2 px-6 hidden sm:flex">
        <div className="w-1/2"></div>
        <div className="relative w-1/2 flex justify-end">
          <button
            onClick={LogoutHandler}
            className="relative z-10 flex px-2 rounded-lg h-12 hover:shadow-md hover:shadow-orange-300 bg-white overflow-hidden hover:bg-orange-50 hover:border-orange-300 focus:border-orange-300 focus:outline-none transition-all duration-300"
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
      </header>

      {/* Mobile Header */}
      <header className="w-full bg-gradient-to-r from-orange-500 to-amber-500 py-5 px-6 sm:hidden">
        <div className="flex items-center justify-between">
          <Link className="text-white text-3xl font-semibold uppercase hover:text-orange-100 transition-colors duration-300">
            Student
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        <nav className={isOpen ? "flex flex-col" : "hidden"}>
          <Link
            to={"/student"}
            className="flex items-center active-nav-link text-white py-2 pl-4 nav-item"
          >
            <i className="fas fa-user mr-3"></i>
            Profile
          </Link>
          <Link
            to={"analytics"}
            className="flex items-center active-nav-link text-white py-2 pl-4 nav-item"
          >
            <i className="fas fa-chart-bar mr-3"></i>
            Overall Analytics
          </Link>
          <Link
            to={"marks"}
            className="flex items-center active-nav-link text-white py-2 pl-4 nav-item"
          >
            <i className="fas fa-clipboard-list mr-3"></i>
            Marks Analytics
          </Link>
          {/* Prediction Board (temporarily disabled) */}
          {false && (
          <Link
            to={"prediction"}
            className="flex items-center active-nav-link text-white py-2 pl-4 nav-item"
          >
            <i className="fas fa-magic mr-3"></i>
            Prediction Board
          </Link>
          )}
          <Link
            to={"schedule"}
            className="flex items-center active-nav-link text-white py-2 pl-4 nav-item"
          >
            <i className="fas fa-calendar mr-3"></i>
            Schedule Meet
          </Link>
            <Link
            to={"notifications"}
            className="flex items-center active-nav-link text-white py-2 pl-4 nav-item"
            >
            <i className="fas fa-bell mr-3"></i>
            Notifications
            </Link>
          <button
            onClick={LogoutHandler}
            className="w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-orange-50 flex items-center justify-center"
          >
            <i className="fas fa-sign-out-alt mr-3"></i>
            Logout
          </button>
        </nav>
      </header>

      {/* Page Content */}
      <div className="w-full overflow-x-hidden border-t flex flex-col">
        <Outlet />
      </div>
    </div>
    </div>
  )
};

export default Layout;
