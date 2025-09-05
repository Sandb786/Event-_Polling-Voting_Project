import toast from "react-hot-toast";

export default function MyEvents({ myEvents,setSelectedEventId }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">My Events</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myEvents.map(ev => (
          <div key={ev._id} className="bg-white shadow rounded-lg p-4 border hover:shadow-md transition">
            <h3 className="text-lg font-bold">{ev.title}</h3>
            <p className="text-gray-600 mb-3">{ev.description}</p>
            <button
              onClick={() => setSelectedEventId(ev._id)}
              className="bg-blue-500 text-white px-3 py-1 rounded transition active:scale-95"
            >
              Manage event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
