import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";

export default function Poll() 
{
  const location = useLocation();
  const { eventId } = location.state || "";

  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // store on login

  useEffect(() => 
  {
    api.get(`/events/${eventId}/poll`, 
    {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setPoll(res.data))
      .catch(() => toast.error("Failed to load poll"));
  }, [eventId, token]);

  const handleVote = (optionIndex) => {
    api.post(
      `/events/${eventId}/poll/vote`,
      { optionIndex },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        toast.success("Vote submitted!");
        setPoll(res.data);
      })
      .catch(() => toast.error("Failed to vote"));
  };

  if (!poll) return <p className="text-gray-500">No poll found.</p>;

  const totalVotes = poll.options.reduce(
    (sum, opt) => sum + opt.votes.length,
    0
  );

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">

      <div>
        <button
          onClick={() => navigate("/createPoll", { state: { eventId } })}
          className="mb-4 text-blue-500 hover:underline"
        >
          create poll
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-4">📊 {poll.question}</h2>

      {poll.options.map((opt, idx) => {
        const isVoted = opt.votes.some((u) => u === userId || u._id === userId);
        const percent =
          totalVotes > 0
            ? ((opt.votes.length / totalVotes) * 100).toFixed(1)
            : 0;

        return (
          <div
            key={idx}
            className={`p-3 mb-2 rounded border flex items-center justify-between ${
              isVoted ? "bg-blue-50 border-blue-400" : "bg-gray-50"
            }`}
          >
            <div>
              <p className="font-medium">{opt.option}</p>
              <p className="text-sm text-gray-500">
                {opt.votes.length} votes ({percent}%)
              </p>
            </div>
            <button
              disabled={isVoted}
              onClick={() => handleVote(idx)}
              className={`px-3 py-1 rounded text-white ${
                isVoted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isVoted ? "Voted" : "Vote"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
