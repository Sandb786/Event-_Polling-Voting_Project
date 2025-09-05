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
   // Delete event by ID
    await Event.deleteOne({ _id: req.params.id });

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

  try {
    const { eventId, userIds } = req.body; // expects an array of userIds

    // 1. find event
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ error: "Event not found" });

    // 2. only creator can invite
    if (String(event.creator) !== String(req.user._id)) {
      return res.status(403).json({ error: "Only creator can invite" });
    }

    // 3. Add users without duplicates
    const newParticipants = userIds.filter(
      (id) => !event.participants.map(String).includes(String(id))
    );

    if (newParticipants.length === 0) {
      return res.status(400).json({ error: "All users already invited" });
    }

    event.participants.push(...newParticipants);

    await event.save();

    // populate participants for frontend display
    await event.populate("participants", "username email");

    res.json({ message: "Users invited successfully", event });

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
  try {

    const { question, options } = req.body;

    const event = await Event.findById(req.params.eventId);

    if (!event) return res.status(404).json({ error: "Event not found" });

    // only creator can create poll
    if (String(event.creator) !== String(req.user._id)) {
      return res.status(403).json({ error: "Only creator can create poll" });
    }

    const newPoll = {
      question,
      options: options.map((opt) => ({ option: opt, votes: [] })),
    };

    
    
    // if poll is an array, push new one
    event.poll.push(newPoll);
    
    console.log(event.poll);
    
    await event.save();


    res.status(201).json({ message: "Poll created successfully"});

  } catch (err) {
    console.error("Error creating poll:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// GET /events/:eventId/poll
export const getPoll= async (req, res) => 
{
  try 
  {
     console.log(req.params.eventId);

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

