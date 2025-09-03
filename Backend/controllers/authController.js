import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function test(req, res) {
    res.json({ message: "Auth route test successful" });
}

export  async function register(req, res) 
{
  // const { name, email, password } = req.body;
  // const existing = await User.findOne({ email });
  // if (existing) return res.status(400).json({ error: "Email exists" });

  // const hash = await bcrypt.hash(password, 10);
  // const user = await User.create({ name, email, passwordHash: hash });

  // res.json({ id: user._id, email: user.email });
  res.json({ MS:'Done ....'});
}



