import Event from "../models/Event.js";
import User from "../models/User.js";


export const getAllUsers = async (req, res) =>
{
  // fetch all users except password
  const users = await User.find().select("-password");
  res.json(users);
}

 export const getEventById = async (req, res) =>
  {
    const event = await Event.findById(req.params.id).populate("participants").populate("creator"); // replaces ObjectId with User document

    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);

  };

export const updateEvent = async (req, res) =>
{
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ error: "Event not found" });
  Object.assign(event, req.body);
  await event.save();
  res.json(event);
};

export const deleteEvent = async (req, res) =>
{
    Event.deleteOne({ _id: req.params.id });

    res.json({ message: "Event deleted" });
}


export const createEvent = async (req, res) => 
{
  // save event to DB with creator as req.user._id
     const event = await Event.create({ ...req.body, creator: req.user._id });

    res.json(event);
};


export const getMyEvents = async (req, res) => 
{

  const events = await Event.find({ creator: req.user._id }).populate("participants"); // replaces ObjectId with User document
  
  res.json(events);
};


export const inviteUser = async (req, res) => 
{
  
  try 
  {

    const { eventId, userId } = req.body;

    // 1. find event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // 2. only creator can invite
    if (String(event.creator) !== String(req.user._id)) 
    {
      return res.status(403).json({ error: "Only creator can invite" });
    }

    // 3. check if already a participant
    if (event.participants.includes(userId)) 
    {
      return res.status(400).json({ error: "User already invited/participant" });
    }

    // 4. add to participants
    event.participants.push(userId);

    await event.save();

    res.json({ message: "User invited successfully", event });
  } 
  catch (err) 
  {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }

};

// POST /events/:eventId/poll
export const createPoll = async (req, res) =>
{
  const { question, options } = req.body;

  const event = await Event.findById(req.params.eventId);

  if (!event) return res.status(404).json({ error: "Event not found" });

  // only creator can create poll
  if (String(event.creator) !== String(req.user._id)) 
  {
    return res.status(403).json({ error: "Only creator can create poll" });
  }

  event.poll = 
  {
    question,
    options: options.map((opt) => ({ option: opt, votes: [] })),
  };

   await event.save();

  console.log("\n POLL: ",event);

  res.json(event.poll);
};


// GET /events/:eventId/poll
export const getPoll= async (req, res) => 
{
  try {
    const event = await Event.findById(req.params.eventId).populate("poll.options.votes", "name email");
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event.poll);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


// POST /events/:eventId/poll/vote 
export const votePoll= async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const userId = req.user._id; // from auth middleware

    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });
    if (!event.poll || !event.poll.options[optionIndex]) {
      return res.status(400).json({ error: "Invalid poll option" });
    }

    // Remove previous votes from this user (only one active vote allowed)
    event.poll.options.forEach((opt) => {
      opt.votes = opt.votes.filter(
        (vote) => vote.toString() !== userId.toString()
      );
    });

    // Add vote to selected option
    event.poll.options[optionIndex].votes.push(userId);

    await event.save();
    res.json(event.poll);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

