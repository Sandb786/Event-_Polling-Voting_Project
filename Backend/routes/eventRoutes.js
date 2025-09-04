import express from "express";
import { createEvent, getMyEvents, inviteUser, votePoll } from "../controllers/EventController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.post("/create", authMiddleware, createEvent);
router.get("/my-events", authMiddleware, getMyEvents);
router.post("/invite", authMiddleware, inviteUser);
router.post("/vote", authMiddleware, votePoll);

export default router;
