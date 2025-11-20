const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,

  cart: [
    {
      productId: Number,
      title: String,
      price: Number,
      image: String,
    //   quantity: { type: Number, default: 1 }
    }
  ],

  favorites: [
    {
      productId: Number,
      title: String,
      price: Number,
      image: String
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
