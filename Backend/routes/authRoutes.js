import express from "express";
import { login, signup } from "../controllers/AuthController.js";


const router = express.Router();
router.get("/", (req, res) => {
  res.send("Auth route is working");
});
router.post("/signup", signup);
router.post("/login", login);

export default router;
