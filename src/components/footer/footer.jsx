import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section brand">
          <h2>Gullies</h2>
          <p>Discover the best deals on fashion, electronics, and more!</p>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/cart">Cart</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <img src="src/assets/Footer/facebook-svgrepo-com (2).svg" alt="" />
            <img src="src/assets/Footer/instagram-fill-svgrepo-com.svg" alt="" />
            <img src="src/assets/Footer/twitter-svgrepo-com.svg" alt="" />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
