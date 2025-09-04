import express from "express";
import { createEvent, getMyEvents, inviteUser, votePoll } from "../controllers/EventController.js";
import { authMiddleware } from "../middlewares/auth.js";


const router = express.Router();

router.get("/", (req, res) => {
  res.send("Event route is working");
});

router.post("/create", authMiddleware, createEvent);

router.get("/my-events", authMiddleware, getMyEvents);

router.post("/invite", authMiddleware, inviteUser);
router.post("/vote", authMiddleware, votePoll);

export default router;
