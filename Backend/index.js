import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import auth from "./routes/authRoutes.js";
import event from "./routes/eventRoutes.js";
import cros from "cors";


dotenv.config({ path: "./.env.development" });// Change every time you switch env files

const app = express();
app.use(express.json());

// ✅ Call the function (not just reference it)
connectDB();

// allowing cross origin requests
app.use(cros());    


app.use("/api/auth",auth);
app.use("/api/events",event);


app.listen(5000, () => console.log("Server running on port 5000"));
