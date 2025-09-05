import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import toast from "react-hot-toast";

export default function Poll() {
  const location = useLocation();
  const { eventId } = location.state || {}; 
  const navigate = useNavigate();

  const [polls, setPolls] = useState([]); // now an array
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // store on login

  // Load all polls of event
  useEffect(() => {
    api
      .get(`/events/${eventId}/polls`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPolls(res.data)) // backend returns an array
      .catch(() => toast.error("Failed to load polls"));
  }, [eventId, token]);

  // Handle vote on specific poll and option
  const handleVote = (pollIndex, optionIndex) => {
    api
      .post(
        `/events/${eventId}/polls/${pollIndex}/vote`,
        { optionIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        toast.success("Vote submitted!");
        setPolls((prev) =>
          prev.map((p, idx) => (idx === pollIndex ? res.data : p))
        );
      })
      .catch(() => toast.error("Failed to vote"));
  };

  if (!polls || polls.length === 0)
    return <> 
    <p className="text-gray-500">No polls found. </p>;
     <button
          onClick={() => navigate("/createPoll", { state: { eventId } })}
          className="mb-4 text-blue-500 hover:underline"
        >
          + Create Poll
        </button>
    </>

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <div>
        <button
          onClick={() => navigate("/createPoll", { state: { eventId } })}
          className="mb-4 text-blue-500 hover:underline"
        >
          + Create Poll
        </button>
      </div>

      {polls.map((poll, pollIndex) => {
        const totalVotes = poll.options
          ? poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)
          : 0;

        return (
          <div key={pollIndex} className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              📊 {poll.question}
            </h2>

            {poll.options.map((opt, idx) => {
              const isVoted = opt.votes.some(
                (u) => u === userId || u._id === userId
              );
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
                    onClick={() => handleVote(pollIndex, idx)}
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
      })}
    </div>
  );
}
