import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

function navbar() {
  const menuItems = [
    { name: "", path: "/" },
    {name:"🩶 Favorites",path:"/Favorites"},
    { name: "🛒 Cart", path: "/cart" },
  ];
  return (
    <div className="navbar-ell">
      <div className="navbar">
        <div className="navbar-element">
          <div className="navbar-logo">
            <Link to='/'>
              <img
                src="src/assets/navbar/Gemini_Generated_Image_ez5a5sez5a5sez5a.png"
                alt="logo"
              />
            </Link>
          </div>
          <div className="navbar-title">GULLIES</div>
        </div>
        <div className="navbar-icons">
          <ul className="navbar-menu">
            {menuItems.map((item, index) => (
              <li key={index} className="navbar-items">
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
          </ul>
          <div className="navbar-user">
            <div>
              <img src="src/assets/navbar/user-svgrepo-com.svg" alt="" />
            </div>
            <span>User</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default navbar;
