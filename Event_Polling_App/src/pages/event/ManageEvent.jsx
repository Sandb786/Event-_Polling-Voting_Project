import { useState, useEffect } from "react";
import api from "../../api";
import toast from "react-hot-toast";

export default function ManageEvent({ eventId, onEventUpdated, onEventDeleted }) 
{

  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => 
{
    // fetch event by ID
    api.get(`/events/event/${eventId}`, 
    {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setEvent(res.data))
      .catch(() => toast.error("Failed to load event"));

    // fetch all users
    api.get("/events/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, [eventId, token]);

  const handleUpdate = (e) => 
 {
    e.preventDefault();
    api.put(`/events/event/${eventId}`, event, 
    {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        toast.success("Event updated!");
        onEventUpdated(res.data);
      })
      .catch(() => toast.error("Failed to update event"));
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    api.delete(`/events/event/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        toast.success("Event deleted!");
        onEventDeleted(eventId);
      })
      .catch(() => toast.error("Failed to delete event"));
  };

  const handleUserSelect = (userId) => {
    if (event.participants.includes(userId)) {
      setEvent({
        ...event,
        participants: event.participants.filter(id => id !== userId)
      });
    } else {
      setEvent({
        ...event,
        participants: [...event.participants, userId]
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!event) return <p>No event found</p>;

  return (
    <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow w-full max-w-lg">
      <h2 className="text-lg font-semibold mb-4">Manage Event</h2>

      {/* Title */}
      <input
        type="text"
        value={event.title}
        onChange={(e) => setEvent({ ...event, title: e.target.value })}
        className="w-full p-2 border rounded mb-3"
      />

      {/* Description */}
      <textarea
        value={event.description}
        onChange={(e) => setEvent({ ...event, description: e.target.value })}
        className="w-full p-2 border rounded mb-3"
      />

      {/* Date Options */}
      <label className="block text-sm font-medium mb-1">Date Options</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {event.dateOptions.map((date, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2">
            {date}
            <button
              type="button"
              onClick={() =>
                setEvent({
                  ...event,
                  dateOptions: event.dateOptions.filter((d) => d !== date),
                })
              }
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {/* Add New Date */}
      <input
        type="date"
        onChange={(e) =>
          setEvent({ ...event, dateOptions: [...event.dateOptions, e.target.value] })
        }
        className="p-2 border rounded mb-3"
      />

      {/* Participants */}
      <label className="block text-sm font-medium mb-1">Invite Participants</label>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {users.map(user => (
          <label
            key={user._id}
            className={`p-2 border rounded cursor-pointer flex items-center gap-2 ${
              event.participants.includes(user._id) ? "bg-blue-100 border-blue-400" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={event.participants.includes(user._id)}
              onChange={() => handleUserSelect(user._id)}
            />
            <span>{user.name} ({user.email})</span>
          </label>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Update
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
