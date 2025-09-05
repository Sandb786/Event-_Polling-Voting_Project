export default function InvitedEvents({ invitedEvents }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Invited Events</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {invitedEvents.map(ev => (
          <div key={ev._id} className="bg-yellow-100 shadow rounded-lg p-4 border hover:shadow-md transition">
            <h3 className="text-lg font-bold">{ev.title}</h3>
            <p className="text-gray-700">(You are invited)</p>
          </div>
        ))}
      </div>
    </div>
  );
}
