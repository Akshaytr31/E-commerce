const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth.cjs");
const { connectDB } = require("../connect.cjs");
const Product = require("../models/Product.cjs");
const sellerAuth = require("../middleware/sellerAuth.cjs");

// UPDATE SELLER STATUS (admin or system triggers this)
router.post("/user/seller", async (req, res) => {
  try {
    const { email, isSeller } = req.body;
    const db = await connectDB();
    const users = db.collection("users");

    await users.updateOne({ email }, { $set: { isSeller } });

    res.json({ message: "Seller status updated!", isSeller });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/request-seller", async (req, res) => {
  const { email, shopName, gst, address } = req.body;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const result = await users.updateOne(
      { email },
      {
        $set: {
          isSeller: "pending",
          shopName,
          gst,
          address,
          sellerRequestedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Seller request submitted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});


router.get("/seller-status", async (req, res) => {
  const { email } = req.query;

  try {
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ isSeller: user.isSeller }); // pending / approved / false
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

router.post("/add-product", sellerAuth, async (req, res) => {
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
      ownerId: req.seller.id,
    });

    res.json({ message: "Product added successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/my-products", sellerAuth, async (req, res) => {
  try {
    console.log("Decoded seller:", req.seller);

    const sellerId = req.seller.id;

    const products = await Product.find({ ownerId: sellerId });

    console.log("Found products:", products);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/delete-product/:id", sellerAuth, async (req, res) => {
  try {
    const sellerId = req.seller.id;
    const productId = req.params.id;

    // Only allow deletion if product belongs to the seller
    const product = await Product.findOne({
      _id: productId,
      ownerId: sellerId,
    });

    if (!product) {
      return res.status(403).json({ error: "Not allowed to delete" });
    }

    await Product.deleteOne({ _id: productId });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

router.put("/update-product/:id", sellerAuth, async (req, res) => {
  try {
    const sellerId = req.seller.id;
    const productId = req.params.id;

    const updated = await Product.findOneAndUpdate(
      { _id: productId, ownerId: sellerId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(403).json({ error: "Unauthorized" });

    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});


module.exports = router;
