const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");  
require("dotenv").config({ path: "../server/connect.cjs" });

const { userRoutes, connectDB } = require("./connect.cjs");
console.log("Backend running from:", __dirname);

const adminRoutes = require("./routes/adminRoutes.cjs");
const sellerRoutes = require("./routes/sellerRoutes.cjs")

const app = express();
app.use(express.json());
app.use(cors());

console.log("ATLAS_URI from env:", process.env.ATLAS_URI); 

mongoose.connect(process.env.ATLAS_URI)
  .then(() => console.log("Mongoose connected for Admin Models"))
  .catch((err) => console.log("Mongoose error:", err));

connectDB()
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log("MongoDB error:", err));

userRoutes(app);

app.use("/admin", adminRoutes);
app.use("/seller",sellerRoutes)

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
