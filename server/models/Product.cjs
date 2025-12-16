const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  price: Number,
  description: String,
  category: String,
  images: [String],
  sizes: [String],
  colors: [String],
  stock: Number,
  rating: {
    rate: Number,
    count: Number
  },
    ownerId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);
