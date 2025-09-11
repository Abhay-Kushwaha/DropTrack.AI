// import React from "react";
// import { useEffect } from "react";
// import { useState } from "react";
// import { useSelector } from "react-redux";

// const AdminDashboard = () => {
//   const [data, setdata] = useState({});
//   const [visible, setvisible] = useState(false);
//   const userData = useSelector((state) => state.user.user);

//   useEffect(() => {
//     var requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     fetch("http://localhost:3000/AdmindashboardCount", requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result);
//         setdata(result);
//         setvisible(true);
//       })
//       .catch((error) => console.log("error", error));
//   }, []);

//   const AnimatedCount = ({ finalCount }) => {
//     const [count, setCount] = useState(0);

//     useEffect(() => {
//       const animationDuration = 500; // in milliseconds
//       const steps = finalCount;
//       const stepDuration = animationDuration / steps;

//       let currentStep = 0;

//       const interval = setInterval(() => {
//         if (currentStep <= steps) {
//           setCount(currentStep);
//           currentStep += 1;
//         } else {
//           clearInterval(interval);
//         }
//       }, stepDuration);

//       return () => clearInterval(interval);
//     }, [finalCount]);

//     return <div className="font-bold p-3 text-4xl">{count}</div>;
//   };
//   console.log(data);
//   return (
//     <div className="m-5">
//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 my-5  grid-rows-6">
//         {/* <Link to={"districtWiseSportsComplex"}> */}
//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">Total States</div>
//           <AnimatedCount finalCount={visible && data.states} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">Total District</div>
//           <AnimatedCount finalCount={visible && data.districts} />
//         </div>


//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">Total Talukas</div>
//           <AnimatedCount finalCount={visible && data.taluka} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">Total Village/Town</div>
//           <AnimatedCount finalCount={visible && data.city} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">Total Students</div>
//           <AnimatedCount finalCount={visible && data.students} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">
//             Total Male Students
//           </div>
//           <AnimatedCount finalCount={visible && data.malestudents} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">
//             Total Female Students
//           </div>
//           <AnimatedCount finalCount={visible && data.femalestudents} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">
//             Total Other Students
//           </div>
//           <AnimatedCount finalCount={visible && data.otherstudents} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">
//             Active Students
//           </div>
//           <AnimatedCount finalCount={visible && data.activestudents} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">
//             Total Inactive Students
//           </div>
//           <AnimatedCount finalCount={visible && data.inactivestudents} />
//         </div>


//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">
//             Total Dropout Students without Reason
//           </div>
//           <AnimatedCount finalCount={visible && data.dropwithoutreason} />
//         </div>
//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">
//             Total Dropout Students with Reason
//           </div>
//           <AnimatedCount finalCount={visible && data.dropwithreason} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">Total Schools</div>
//           <AnimatedCount finalCount={visible && data.schools} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">
//             Total Government Schools
//           </div>
//           <AnimatedCount finalCount={visible && data.govtschools} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">
//             Total Semi-Government Schools
//           </div>
//           <AnimatedCount finalCount={visible && data.semigovtschools} />
//         </div>



//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">
//             Total Private Schools
//           </div>
//           <AnimatedCount finalCount={visible && data.privateschools} />
//         </div>

//         <div className=" text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ">
//           <div className="font-semibold p-5 text-2xl h-3/5 text-amber-900">
//             Total InterNational Schools
//           </div>
//           <AnimatedCount finalCount={visible && data.internationalschools} />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  const userData = useSelector((state) => state.user.user);

  useEffect(() => {
    fetch("http://localhost:3000/AdmindashboardCount")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setVisible(true);
      })
      .catch((err) => console.error("Error fetching data", err));
  }, []);

  const AnimatedCount = ({ finalCount }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let current = 0;
      const duration = 800; 
      const stepTime = Math.max(duration / finalCount, 20);

      const interval = setInterval(() => {
        current += 1;
        if (current <= finalCount) {
          setCount(current);
        } else {
          clearInterval(interval);
        }
      }, stepTime);

      return () => clearInterval(interval);
    }, [finalCount]);

    return <div className="font-bold text-4xl mt-3">{count}</div>;
  };

  const cards = [
    { title: "🌍 Total States", value: data.states },
    { title: "🏢 Total District", value: data.districts },
    { title: "🏙️ Total Talukas", value: data.taluka },
    { title: "🏡 Total Village/Town", value: data.city },
    { title: "🎓 Total Students", value: data.students },
    { title: "👦 Male Students", value: data.malestudents },
    { title: "👧 Female Students", value: data.femalestudents },
    { title: "🧑‍🎤 Other Students", value: data.otherstudents },
    { title: "✅ Active Students", value: data.activestudents },
    { title: "❌ Inactive Students", value: data.inactivestudents },
    { title: "🤔 Dropout (No Reason)", value: data.dropwithoutreason },
    { title: "📉 Dropout (With Reason)", value: data.dropwithreason },
    { title: "🏫 Total Schools", value: data.schools },
    { title: "🏛️ Govt Schools", value: data.govtschools },
    { title: "🏢 Semi-Govt Schools", value: data.semigovtschools },
    { title: "🏠 Private Schools", value: data.privateschools },
    { title: "🌐 International Schools", value: data.internationalschools },
  ];

  return (
    <div className="m-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-900">
        📊 Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
        <div
  key={idx}
  className="text-center rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 p-5 min-h-[170px]"
>

            <div className="text-2xl font-semibold text-amber-900">{card.title}</div>
            {visible && <AnimatedCount finalCount={card.value || 0} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
