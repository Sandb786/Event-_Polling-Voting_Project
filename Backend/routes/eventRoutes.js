import express from "express";
import { createEvent, createPoll, deleteEvent, getAllUsers, getEventById, getMyEvents, getPoll, inviteUser, updateEvent, votePoll } from "../controllers/EventController.js";
import { authMiddleware } from "../middlewares/auth.js";


const router = express.Router();

router.get("/", (req, res) => {
  res.send("Event route is working");
});

router.post("/create", authMiddleware, createEvent);

router.get("/users", authMiddleware, getAllUsers);
router.get("/my-events", authMiddleware, getMyEvents);

router.get("/event/:id", authMiddleware, getEventById);
router.put("/event/:id", authMiddleware,updateEvent );
router.delete("/event/:id", authMiddleware,deleteEvent);

router.post("/invite", authMiddleware, inviteUser);
router.post("/:eventId/poll", authMiddleware, createPoll);
router.get("/:eventId/poll", authMiddleware, getPoll);

router.post("/:eventId/poll/vote", authMiddleware, votePoll);

export default router;
