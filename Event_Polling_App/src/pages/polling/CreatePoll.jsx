import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";

export default function CreatePoll() 
{
    const location = useLocation();
    const eventId  = location.state?.eventId || 0;

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [poll, setPoll] = useState({
    question: "",
    options: [""],
  });

  const handleOptionChange = (index, value) => 
{
    const updated = [...poll.options];
    updated[index] = value;
    setPoll({ ...poll, options: updated });
  };

  const addOption = () => {
    setPoll({ ...poll, options: [...poll.options, ""] });
  };

  const handleSubmit = (e) => 
{
    e.preventDefault();

    api.post(`/events/${eventId}/poll`,poll,{ headers: { Authorization: `Bearer ${token}` } })
      .then(() => 
        {
         toast.success("Poll created successfully!");
        navigate("/poll", { state: { eventId } }); // go back to event page
      })
      .catch(() => toast.error("Failed to create poll"));
     console.log(eventId);

     console.log(poll);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Poll {eventId}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Question</label>
          <input
            type="text"
            value={poll.question}
            onChange={(e) => setPoll({ ...poll, question: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Options</label>
          {poll.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="w-full p-2 border rounded mb-2"
              required
            />
          ))}
          <button
            type="button"
            onClick={addOption}
            className="text-blue-500 text-sm"
          >
            + Add Option
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Create Poll
        </button>
      </form>
    </div>
  );
}
