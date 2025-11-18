const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Register admin (ONE TIME ONLY)
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await Admin.create({ email, password: hashed });

  res.json({ message: "Admin Created" });
});

// Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ error: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign({ id: admin._id }, "SECRET_KEY", {
    expiresIn: "1d",
  });

  res.json({ message: "Login success", token });
});

// Admin Dashboard Protected
router.get("/dashboard", adminAuth, (req, res) => {
  res.json({ message: "Welcome Admin Dashboard" });
});

module.exports = router;
