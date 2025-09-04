import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => 
{

  //'Authorization: Bearer <jwt_token>' split(" ")[1] → takes only the actual token (<jwt_token>).
  const token = req.headers.authorization?.split(" ")[1]; 

  // if no token, return 401
  if (!token) return res.status(401).json({ error: "No token" });

  try 
  {
    // jwt.verify() checks:
    // If the token is valid (signature matches your JWT_SECRET).
    // If it’s not expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded JWT:", decoded); // Debugging line

    // find the user by ID and attach to req.user
    req.user = await User.findById(decoded.id);

    //When the middleware runs successfully, it attaches the 'user' data to the 'req' object.
      next();
  } 
  catch 
  {
    res.status(401).json({ error: "Invalid token" });
  }
};
