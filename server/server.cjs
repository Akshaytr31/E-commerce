const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./server/config.env" });

// Correct import for user routes
const userRoutes = require("./connect.cjs");
const connectDB = userRoutes.connectDB;

// Admin routes
const adminRoutes = require("./routes/adminRoutes.cjs");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => console.log("Mongoose Connected!"))
  .catch((err) => console.log("Mongoose error:", err));

// Connect MongoDB (Users collection)
connectDB()
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log("MongoDB error:", err));

// USER ROUTES
userRoutes(app);

// ADMIN ROUTES
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
