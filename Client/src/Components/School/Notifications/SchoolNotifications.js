import React, { useEffect, useState } from "react";

const SchoolNotifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/school-notifications", { method: "GET", headers: { token } })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setItems(res.notifications || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Mark all as read when page opens
    fetch("http://localhost:3000/school-notifications/read-all", { method: "PUT", headers: { token } })
      .catch(() => {});
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-5xl text-center font-semibold mb-4">Notifications</h2>
      {items.length === 0 ? (
        <div className=" text-gray-500 text-lg text-center">No notifications</div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n._id} className={`p-3 rounded border ${n.is_Read ? "bg-white" : "bg-amber-50"}`}>
              <div className="text-sm text-gray-500">{new Date(n.Created_At).toLocaleString()}</div>
              <div>{n.Message}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SchoolNotifications;
