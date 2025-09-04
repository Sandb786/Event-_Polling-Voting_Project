import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  const event = await Event.create({ ...req.body, creator: req.user._id });
  res.json(event);
};

export const getMyEvents = async (req, res) => {
  const events = await Event.find({ creator: req.user._id }).populate("participants");
  res.json(events);
};

export const inviteUser = async (req, res) => {
  const { eventId, userId } = req.body;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });
  if (String(event.creator) !== String(req.user._id)) {
    return res.status(403).json({ error: "Only creator can invite" });
  }
  event.participants.push(userId);
  await event.save();
  res.json(event);
};

export const votePoll = async (req, res) => {
  const { eventId, option } = req.body;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const pollOption = event.poll.options.find(o => o.option === option);
  if (!pollOption) return res.status(400).json({ error: "Invalid option" });

  pollOption.votes.push(req.user._id);
  await event.save();
  res.json(event);
};
