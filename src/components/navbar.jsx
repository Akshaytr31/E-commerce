import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

function navbar() {
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "🛒 Cart", path: "/cart" },
  ];
  return (
    <div>
      <div className="navbar">
        <div className="navbar-element">
          <div className="navbar-logo">
            <img
              src="src/assets/navbar/Gemini_Generated_Image_ez5a5sez5a5sez5a.png"
              alt="logo"
            />
          </div>
          <div className="navbar-title">GULLIES</div>
        </div>
        <ul className="navbar-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="navbar-items">
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default navbar;
