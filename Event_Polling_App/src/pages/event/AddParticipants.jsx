import React, { useEffect, useState } from "react";
import api from "../../api"; // your axios instance
import toast from "react-hot-toast";

export const AddParticipants = ({ eventId }) => 
{
  const [users, setUsers] = useState([]); // all available users
  const [selected, setSelected] = useState([]);
  const [event, setEvent] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all users and current event participants
  useEffect(() => {
    api
      .get("/events/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to fetch users"));

    api
      .get(`/events/event/${eventId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setEvent(res.data);
        setSelected((res.data.participants || []).map((p) => p._id));
      })
      .catch(() => toast.error("Failed to load event"));
  }, [eventId, token]);


  // Add participants
  const handleAdd = () => 
 {
    api.post(`/events/invite/`,
        { eventId , userIds: selected},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => 
        {
        setEvent(res.data);
        toast.success("Participants updated!");
      })
      .catch(() => toast.error("Update not alowed"));

    console.log("Selected Users: ", selected);
  };

  // Toggle user selection
  const toggleUser = (userId) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId] 
        
    );
    console.log(selected)
  };

  return (
    <div className="p-6 bg-gray-200 shadow rounded max-w-md mx-auto mt-5">
      <h2 className="text-lg font-semibold mb-4">Invite Participants</h2>

      <div className="grid grid-cols-1 gap-3 mb-4">
        {users.map((u) => (
          <label
            key={u._id}
            className={`flex items-center p-2 border rounded cursor-pointer ${
              selected.includes(u._id) ? "bg-blue-50 border-blue-400" : "bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(u._id)}
              onChange={() => toggleUser(u._id)}
              className="mr-2"
            />
            <span>{u.username} </span>
          </label>
        ))}
      </div>

      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Participants
      </button>

      {event && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Current Participants</h3>
          <ul className="list-disc pl-5 text-gray-600">
            {event.participants?.map((p) => (
              <li key={p._id}>{p.username || p.email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
