import { Router } from "express";
import register from "../controllers/authController";
const router = Router();

// router.post("/auth/register",(req,res)=>{res.json({MS:"Done"})});
router.post("/auth/register",register);



export default router;

