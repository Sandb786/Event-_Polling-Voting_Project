const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env.development" });// Change every time

const app = express();

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log(`🚀 Server running at http://localhost:3000`));