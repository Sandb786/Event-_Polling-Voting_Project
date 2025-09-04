import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../config/jwt.js";

export const signup = async (req, res) => 
{
   const hashed = await bcrypt.hash(req.body.password, 10);

   // CReate a new user with the hashed password
      const data=req.body;
      data.password=hashed;

      try 
      {
        // Save the user to the database
           const user = await User.create(data);

        // users logged in immediately after signup. so we Genrate token
          res.json({ token: generateToken(user) });
      } 
      catch (error) 
      {
         console.log(error);
          res.status(500).json({ error: "Error creating user" });
      }

};

export const login = async (req, res) => 
{

  // extract email and password from req.body
  const { email, password } = req.body;



  // Find the user by email
  const user = await User.findOne({ email });



  // If user not found or password does not match, return error
  if (!user || !(await bcrypt.compare(password, user.password))) 
  {
    return res.status(400).json({ error: "Invalid credentials" });
  }


  // If credentials are valid, return user data and token
  res.json({ token: generateToken(user) });

};
