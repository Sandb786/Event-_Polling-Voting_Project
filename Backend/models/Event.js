import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  dateOptions: [String],      // ["2025-09-05 10:00", "2025-09-06 14:00"]
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  poll: {
    question: String,
    options: [{ option: String, votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] }]
  }
});

export default mongoose.model("Event", eventSchema);
