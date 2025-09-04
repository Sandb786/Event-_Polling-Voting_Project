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

        // Handle duplicate key error (e.g., email already exists)
        if (error.code === 11000) 
        {
          // return BAD REQUEST
          return res.status(400).json({ error: "User already exists" });  
        }

        res.status(500).json({ error: "Error creating user" });
        
      }

};

export const login = async (req, res) => 
{

  // extract email and password from req.body
  const { email, password } = req.body;



  // Find the user by email
  const user = await User.findOne({ email });



  // If user not found , return error
  if (!user) 
  {
    return res.status(400).json({ error: "User No Found" });
  }

  //If password does not match , return error
  if(!await bcrypt.compare(password, user.password))
  {
    return res.status(400).json({ error: "Incorrect Password" });
  }


  // If credentials are valid, return user data and token
  res.json({ token: generateToken(user) });

};
