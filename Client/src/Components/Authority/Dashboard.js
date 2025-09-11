import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AuthorityDashboard = () => {
  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  const userData = useSelector((state) => state.user.user);

  useEffect(() => {
    fetch(`http://localhost:3000/authoritycount?state=${userData.State._id}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setVisible(true);
      })
      .catch((err) => console.error("Error fetching data", err));
  }, [userData]);

  const AnimatedCount = ({ finalCount }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let current = 0;
      const duration = 800;
      const stepTime = Math.max(duration / (finalCount || 1), 20);

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
    { title: "🏛️ Govt Schools", value: data.govtschools?.length },
    { title: "🏢 Semi-Govt Schools", value: data.semigovtschools?.length },
    { title: "🏠 Private Schools", value: data.privateschools?.length },
    { title: "🌐 International Schools", value: data.internationalschools?.length },
  ];

  return (
    <div className="m-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-amber-900">
        📊 Authority Dashboard
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

export default AuthorityDashboard;
