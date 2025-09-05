import { useState, useEffect } from "react";
import api from "../../api";
import toast from "react-hot-toast";

export default function CreateEvent({ myEvents, setMyEvents }) {
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    dateOptions: [],
    participants: [],
  });

  const [dateInput, setDateInput] = useState(""); // single date input before adding
  const [users, setUsers] = useState([]); // list of all users

  const token = localStorage.getItem("token");

  useEffect(() => {
    // fetch all users to invite
    api.get("/events/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  }, [token]);


  // submit event
  const handleCreate = (e) => {
    e.preventDefault();

    api.post("/events/create", newEvent, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        toast.success("Event created!");
        setMyEvents([...myEvents, res.data]);
        setNewEvent({ title: "", description: "", dateOptions: [], participants: [] });
      })
      .catch(() => toast.error("Failed to create event"));


  };

  return (
    <form onSubmit={handleCreate} className="mb-6 bg-white p-4 rounded shadow w-96">
      <h2 className="text-lg font-semibold mb-3">Create Event</h2>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={newEvent.description}
        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />

      {/* Date Options */}
      <label className="block text-sm font-medium mb-1">Date Options</label>
      <div className="flex gap-2 mb-3">
        <input
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <button
          type="button"
          onClick={() => 
          {
            if (dateInput && !newEvent.dateOptions.includes(dateInput)) {
              setNewEvent({
                ...newEvent,
                dateOptions: [...newEvent.dateOptions, dateInput],
              });
              setDateInput(""); // clear after adding
            }
          }}
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>

      {/* Show Added Dates */}
      <div className="flex flex-wrap gap-2 mb-3">
        {newEvent.dateOptions.map((date, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2"
          >
            {date}
            <button
              type="button"
              onClick={() =>
                setNewEvent({
                  ...newEvent,
                  dateOptions: newEvent.dateOptions.filter((d) => d !== date),
                })
              }
              className="text-red-500 font-extrabold hover:text-red-700"
            >
              ✕
            </button>
          </span>
        ))}
      </div>


      {/* Participants */}
      <label className="block text-sm font-medium mb-2">Invite Participants</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {users.map((user) => (
          <label
            key={user._id}
            className={`flex items-center w-full p-3 border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition ${newEvent.participants.includes(user._id) ? "bg-blue-50 border-blue-400" : "bg-white"
              }`}
          >
            <input
              type="checkbox"
              value={user._id}
              checked={newEvent.participants.includes(user._id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setNewEvent({
                    ...newEvent,
                    participants: [...newEvent.participants, user._id],
                  });
                } else {
                  setNewEvent({
                    ...newEvent,
                    participants: newEvent.participants.filter((id) => id !== user._id),
                  });
                }
              }}
              className="mr-2"
            />
            <div>
              <p className="font-medium text-gray-800">{user.username}</p>
            </div>

          </label>
        ))}
      </div>


      {/* Submit */}
      <button className="w-full bg-blue-500 text-white p-2 rounded">Create</button>
    </form>
  );
}
