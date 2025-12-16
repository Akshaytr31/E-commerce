const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.cjs");
const adminAuth = require("../middleware/adminAuth.cjs");
const Product = require("../models/Product.cjs");
const { connectDB } = require("../connect.cjs");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ email, password: hashed });
  res.json({ message: "Admin Created" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ error: "Admin not found" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign({ id: admin._id }, "SECRET_KEY", { expiresIn: "1d" });
  res.json({ message: "Login success", token });
});

router.get("/dashboard", adminAuth, (req, res) => {
  res.json({ message: "Welcome Admin Dashboard" });
});

router.get("/stats", adminAuth, async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const totalUsers = await users.countDocuments({ isSeller: { $ne: true } });
    const totalSellers = await users.countDocuments({ isSeller: true });
    const pendingRequests = await users.find({ isSeller: "pending" }).toArray();

    res.json({ totalUsers, totalSellers, pendingRequests });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/users", adminAuth, async (req, res) => {
  try {
    const db = await connectDB();
    const users = await (
      await connectDB()
    )
      .collection("users")
      .find({ isSeller: { $ne: true } })
      .toArray();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Cannot load users list" });
  }
});

router.get("/sellers", adminAuth, async (req, res) => {
  try {
    const users = (await connectDB()).collection("users");
    const data = await users.find({ isSeller: true }).toArray();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to load sellers" });
  }
});

router.post("/seller/approve", adminAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const users = (await connectDB()).collection("users");

    await users.updateOne({ email }, { $set: { isSeller: true } });

    res.json({ message: "Seller Approved" });
  } catch {
    res.status(500).json({ error: "Approval failed" });
  }
});

router.post("/seller/reject", adminAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const users = (await connectDB()).collection("users");

    await users.updateOne({ email }, { $set: { isSeller: false } });
    res.json({ message: "seller Rejected" });
  } catch {
    res.status(500).json({ error: "Rejection failed" });
  }
});

router.post("/user/block", adminAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const users = (await connectDB()).collection("users");

    await users.updateOne({ email }, { $set: { isBlocked: true } });

    res.json({ message: "User Blocked" });
  } catch (err) {
    res.status(500).json({ error: "Block failed" });
  }
});

router.post("/user/unblock", adminAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const users = (await connectDB()).collection("users");

    await users.updateOne({ email }, { $set: { isBlocked: false } });

    res.json({ message: "User Unblocked" });
  } catch (err) {
    res.status(500).json({ error: "Unblock failed" });
  }
});

router.post("/add-product", adminAuth, async (req, res) => {
  try {
    const {
      id,
      title,
      price,
      description,
      category,
      images,
      sizes,
      colors,
      stock,
      rating,
    } = req.body;

    await Product.create({
      id,
      title,
      price,
      description,
      category,
      images,
      sizes,
      colors,
      stock,
      rating,
    });

    res.json({ message: "Product added successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

module.exports = router;
