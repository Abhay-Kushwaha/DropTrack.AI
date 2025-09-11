import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MentorNotifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((s) => s.user.user);

  useEffect(() => {
    if (!user?.Email) return;
    const token = localStorage.getItem("token");
    const url = `http://localhost:3000/mentor-notifications?mentorEmail=${encodeURIComponent(user.Email)}`;
    fetch(url, { method: "GET", headers: { token } })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setItems(res.notifications || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.Email]);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {items.length === 0 ? (
        <div className="text-gray-500">No notifications</div>
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

export default MentorNotifications;
