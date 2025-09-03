import { Router } from "express";
// import register from "../controllers/authController";

const router1 = Router();

router1.get("/demo", (req, res) => {
    res.json({ message: "Demo route test successful" });
});

// router.post("/auth/register", register);

export default router1;