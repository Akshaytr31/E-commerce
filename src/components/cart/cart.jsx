import React from "react";
import { useCart } from "../../context/CartContext";
import "./cart.css";

function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "80px",
          fontFamily: "sans-serif",
          color: "gray",
        }}
      >
        🛒 Your cart is empty
      </h2>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-elems">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-box">
                <img src={item.image} alt={item.title} width="80" />
              </div>
              <div className="cart-box">
                <h3>{item.title}</h3>
                <div className="cart-price">
                <p>₹{item.price}</p>
                <p>Qty: {item.quantity}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={clearCart}>Clear Cart</button>
      </div>
    </div>
  );
}

export default CartPage;
