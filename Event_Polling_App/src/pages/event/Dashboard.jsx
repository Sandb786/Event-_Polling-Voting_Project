import { useEffect, useState } from "react";
import api from "../../api";
import toast from "react-hot-toast";
import CreateEvent from "./CreateEvent";
import MyEvents from "./MyEvents";
import InvitedEvents from "./InvitedEvents";
import ManageEvent from "./ManageEvent";

export default function Dashboard() {
  const [myEvents, setMyEvents] = useState([]);
  const [invitedEvents, setInvitedEvents] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // fetch events created by user
    api.get("/events/my-events", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setMyEvents(res.data))
      .catch(() => toast.error("Failed to load my events"));

    // fetch invited events
    // api.get("/events/invited", { headers: { Authorization: `Bearer ${token}` } })
    //   .then(res => setInvitedEvents(res.data))
    //   .catch(() => toast.error("Failed to load invited events"));
  }, [token]);


    const handleEventUpdated = (updatedEvent) => {
    setMyEvents((prev) =>
      prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
    );
    setSelectedEventId(null); // close manage view
  };

  const handleEventDeleted = (eventId) => 
  {
    setMyEvents((prev) => prev.filter((e) => e._id !== eventId));
    setSelectedEventId(null); // close manage view
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          {showCreate ? "Close" : "Create Event"}
        </button>
      </div>

      {/* Toggle Create Event Form */}
      {showCreate && (
        <div className="mb-6">
          <CreateEvent myEvents={myEvents} setMyEvents={setMyEvents} />
        </div>
      )}

      {/* My Events Section */}
      <MyEvents myEvents={myEvents} setSelectedEventId={setSelectedEventId}/>

      {/* Invited Events Section */}
      <InvitedEvents invitedEvents={invitedEvents} />


      {/* Manage Event Modal/Section */}
      {selectedEventId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center overflow-auto py-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
            <ManageEvent
              eventId={selectedEventId}
              onEventUpdated={handleEventUpdated}
              onEventDeleted={handleEventDeleted}
            />
            <button
              onClick={() => setSelectedEventId(null)}
              className="mt-4 text-red-500 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
