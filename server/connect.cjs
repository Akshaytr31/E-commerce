const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "server/config.env" });
console.log("Loaded ATLAS_URI:", process.env.ATLAS_URI);

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.ATLAS_URI);
const dbName = "ecommerce";

async function connectDB() {
  await client.connect();
  console.log("✅ MongoDB Connected!");
  return client.db(dbName);
}

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({ username, email, password: hashedPassword });

    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));