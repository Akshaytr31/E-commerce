import React, { useEffect, useState } from "react";
import "./cart.css";
import { FaTrash } from "react-icons/fa";

function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = JSON.parse(localStorage.getItem("user"))?.email;

  // Fetch cart items from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:8000/cart/${userEmail}`);
        const data = await res.json();
        console.log("datalsslslsl", data);
        setCart(data || []);
      } catch (err) {
        console.error("Fetch cart error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) fetchCart();
  }, [userEmail]);

  // Remove single item from cart
  const removeFromCart = async (id) => {
    const res = await fetch("http://localhost:8000/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, id }),
    });

    const data = await res.json();

    if (res.ok) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      alert(data.error);
    }
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  // Clear entire cart
  const clearCart = async () => {
    const res = await fetch("http://localhost:8000/cart/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });

    if (res.ok) {
      setCart([]);
    }
  };

  if (!userEmail) {
    return <h2>Please log in to view your cart.</h2>;
  }

  if (loading) {
    return <h2>Loading your cart...</h2>;
  }

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
              <div className="cart-details">
                <div className="cart-box">
                  <img src={item.image} alt={item.title} width="80" />
                </div>
                <div className="cart-box">
                  <h3>{item.title}</h3>
                  <div className="item-details">
                    <p>₹ {item.price}</p>
                    <p>
                      Rating
                      <span>{item.rating?.rate}</span>
                    </p>
                  </div>
                  <div className="selectedItem-size">
                    <span>Selected size</span>
                    <div>{item.selectedSize}</div>
                  </div>
                  <div className="product-count">
                    <p>Remaining {item.rating?.count} products</p>
                  </div>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)}>
                <FaTrash className="remove-icon" />
              </button>
            </div>
          ))}
        </div>
        <div className="cart-btns">
          <button onClick={clearCart}>Clear Cart</button>
          <button>Place Order</button>
        </div>
      </div>
      <div className="cart-sticky">
        <div className="cart-price-container">
          <h3 className="price-title">Price Details</h3>

          <div className="price-row">
            <span>Total Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="price-row">
            <span>Total Price</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="price-row">
            <span>Delivery</span>
            <span>Free</span>
          </div>

          <hr />

          <div className="price-total">
            <span>Grand Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
        <div className="price-grarenty">
          <div>
            <img
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/shield_b33c0c.svg"
              alt=""
            />
          </div>
          <span>
            Safe and Secure Payments.Easy returns.100% Authentic products.
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
