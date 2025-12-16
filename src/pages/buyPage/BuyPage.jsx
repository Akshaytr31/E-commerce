import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BuyPage.css";

function BuyPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return <h3>No product selected</h3>;
  }

  const { product, selectedSize } = state;

  const [qty, setQty] = useState(1);
  const [total, setTotal] = useState(product.price);

  // Increase quantity
  const increaseQty = () => {
    const newQty = qty + 1;
    setQty(newQty);
    setTotal(product.price * newQty);
  };

  // Decrease quantity
  const decreaseQty = () => {
    if (qty === 1) return;
    const newQty = qty - 1;
    setQty(newQty);
    setTotal(product.price * newQty);
  };

  return (
    <div className="buy-layout">

      {/* LEFT — Checkout */}
      <div className="left-section">

        <div className="buy-card">
          <img src={product.images[0]} alt={product.title} />

          <div className="buy-details">
            <h3>{product.title}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Size Selected: {selectedSize}</p>

            {/* Quantity Counter */}
            <div className="qty-box">
              <button className="qty-btn" onClick={decreaseQty}>-</button>
              <span className="qty-value">{qty}</span>
              <button className="qty-btn" onClick={increaseQty}>+</button>
            </div>

            <h3>Total: ₹{total}</h3>

            <button
              className="confirm-btn"
              onClick={() => alert("Order Placed Successfully")}
            >
              Confirm Order
            </button>

            <button className="cancel-btn" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT — Offer Poster */}
      <div className="right-section">
        <div className="offer-poster">
          <h3>Special Offer</h3>
          <p>Get 10% OFF on your first order</p>

          <button className="offer-btnb">Apply Coupon</button>
        </div>
      </div>

    </div>
  );
}

export default BuyPage;
