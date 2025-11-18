const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./server/config.env" });
console.log("Loaded ATLAS_URI:", process.env.ATLAS_URI);

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.ATLAS_URI);
const dbName = "ecommerce";

let db = null;

async function connectDB() {
  if (db) return db; 

  await client.connect();
  console.log("✅ MongoDB Connected!");

  db = client.db(dbName);
  return db;
}

console.log('workingggggg')
app.get("/", (req, res) => {
  res.send("API working");
});

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

    await users.insertOne({
      username,
      email,
      password: hashedPassword,
      cart: [],
      favorites: []
    });

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

// app.post("/cart/add", async (req, res) => {
//   const { email, product, selectedSize } = req.body;

//   try {
//     const db = await connectDB();
//     const users = db.collection("users");

//     const user = await users.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (!user.cart) user.cart = [];

//     // Check if the same product with same size already exists
//     const exists = user.cart.some(
//       (item) => item.id === product.id && item.selectedSize === selectedSize
//     );

//     if (exists) {
//       return res.status(400).json({ error: "Already in cart" });
//     }

//     const cartItem = {
//       ...product,
//       selectedSize, 
//       quantity: 1,
//     };

//     await users.updateOne(
//       { email },
//       { $push: { cart: cartItem } }
//     );

//     res.json({ message: "Added to cart!" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

app.post("/cart/add", async (req, res) => {
  const { email, product, selectedSize } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.cart) user.cart = [];

    // Check if same product with same size exists
    const exists = user.cart.some(
      (item) => item.id === product.id && item.selectedSize === selectedSize
    );

    if (exists) {
      return res.status(400).json({ error: "Already in cart" });
    }

    // Build full cart item
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],  
      images: product.images,     
      selectedSize,
      quantity: 1,
      rating: product.rating,
      stock: product.stock,
      colors: product.colors
    };

    await users.updateOne(
      { email },
      { $push: { cart: cartItem } }
    );

    res.json({ message: "Added to cart!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});




app.post("/favorites/add", async (req, res) => {
  const { email, product } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // FIX: make sure favorites exists
    if (!user.favorites) user.favorites = [];

    const exists = user.favorites.some((item) => item.id === product.id);

    if (exists) {
      return res.status(400).json({ error: "Already in favorites" });
    }

    await users.updateOne(
      { email },
      { $push: { favorites: product } }
    );

    res.json({ message: "Added to favorites!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



app.get("/cart/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });

    res.json(user.cart || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/cart/remove", async (req, res) => {
  const { email, id } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    await users.updateOne(
      { email },
      { $pull: { cart: { id: id } } }
    );

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/cart/clear", async (req, res) => {
  const { email } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    await users.updateOne(
      { email },
      { $set: { cart: [] } }
    );

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/favorites/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ favorites: user.favorites || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/favorites/remove", async (req, res) => {
  const { email, id } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    await users.updateOne(
      { email },             
      { $pull: { favorites: { id: id } } }
    );

    res.json({ message: "Favorite removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

connectDB().then(() => {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});