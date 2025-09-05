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


export const votePoll = async (req, res) => 
{
  const { eventId, option } = req.body;
  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const pollOption = event.poll.options.find(o => o.option === option);
  if (!pollOption) return res.status(400).json({ error: "Invalid option" });

  pollOption.votes.push(req.user._id);
  await event.save();
  res.json(event);
};
