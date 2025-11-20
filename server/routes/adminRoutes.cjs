const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.cjs");
const adminAuth = require("../middleware/adminAuth.cjs");
const Product = require("../models/Product.cjs");

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
      rating
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
      rating
    });

    res.json({ message: "Product added successfully!" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

module.exports = router;
