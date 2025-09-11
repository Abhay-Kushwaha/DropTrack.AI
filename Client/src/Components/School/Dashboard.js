import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

// A custom hook for the count-up animation
const useCountUp = (end, duration = 1.5, start = 0) => {
  const [count, setCount] = useState(start);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration * 1000 / frameRate);

  useEffect(() => {
    if (end === null || end === undefined) return;
    let currentFrame = 0;
    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const currentCount = Math.round(start + (end - start) * progress);
      setCount(currentCount);

      if (currentFrame === totalFrames) {
        clearInterval(counter);
        setCount(end); // Ensure it ends on the exact number
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [end, duration, start, frameRate, totalFrames]);

  return count;
};

// Wrapper for the animated count to handle visibility
const AnimatedCount = ({ finalCount }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const count = useCountUp(isVisible ? finalCount : 0, 1.5);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};


// --- SVG Icons (for a clean, modern look) ---
const UsersIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const UserIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const UserCheckIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>
);
const UserXIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" x2="22" y1="8" y2="13" /><line x1="22" x2="17" y1="8" y2="13" /></svg>
);
const AlertTriangleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
);
const ClipboardListIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>
);

// A reusable card component for consistent styling
const StatCard = ({ icon, title, count, iconBgColor, iconTextColor }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium text-slate-500">{title}</p>
          <div className="text-5xl font-bold text-slate-900">
            <AnimatedCount finalCount={count} />
          </div>
        </div>
        <div className={`flex m-3 h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${iconBgColor} ${iconTextColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const SchoolDashboard = () => {
  const [data, setdata] = useState({});
  const [visible, setvisible] = useState(false);

  const statsConfig = [
    { title: "Total Students", dataKey: "students", icon: <UsersIcon className="h-10 w-10" />, colors: { bg: "bg-blue-100", text: "text-blue-600" } },
    { title: "Male Students", dataKey: "malestudents", icon: <UserIcon className="h-10 w-10" />, colors: { bg: "bg-cyan-100", text: "text-cyan-600" } },
    { title: "Female Students", dataKey: "femalestudents", icon: <UserIcon className="h-10 w-10" />, colors: { bg: "bg-pink-100", text: "text-pink-600" } },
    { title: "Other Students", dataKey: "otherstudents", icon: <UserIcon className="h-10 w-10" />, colors: { bg: "bg-purple-100", text: "text-purple-600" } },
    { title: "Active Students", dataKey: "activestudents", icon: <UserCheckIcon className="h-10 w-10" />, colors: { bg: "bg-green-100", text: "text-green-600" } },
    { title: "Inactive Students", dataKey: "inactivestudents", icon: <UserXIcon className="h-10 w-10" />, colors: { bg: "bg-slate-100", text: "text-slate-600" } },
    { title: "Dropout (No Reason)", dataKey: "dropwithoutreason", icon: <AlertTriangleIcon className="h-10 w-10" />, colors: { bg: "bg-red-100", text: "text-red-600" } },
    { title: "Dropout (With Reason)", dataKey: "dropwithreason", icon: <ClipboardListIcon className="h-10 w-10" />, colors: { bg: "bg-orange-100", text: "text-orange-600" } }
  ];

  const userData = useSelector((state) => state.user.user);

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `http://localhost:3000/schoolcount?School_ID=${userData.School._id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setdata(result);
        setvisible(true);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const AnimatedCount = ({ finalCount }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const animationDuration = 500; // in milliseconds
      const steps = finalCount;
      const stepDuration = animationDuration / steps;

      let currentStep = 0;

      const interval = setInterval(() => {
        if (currentStep <= steps) {
          setCount(currentStep);
          currentStep += 1;
        } else {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, [finalCount]);

    return <div className="font-bold p-3 text-4xl">{count}</div>;
  };
  return (
    <div className="min-h-screen w-full bg-amber-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-slate-900">Student Overview</h1>
          <p className="mt-1 text-lg text-slate-500">A summary of student demographics and status.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statsConfig.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              count={data[stat.dataKey]}
              icon={stat.icon}
              iconBgColor={stat.colors.bg}
              iconTextColor={stat.colors.text}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;
