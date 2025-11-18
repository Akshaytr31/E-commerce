import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { UserContext } from "../context/userContext";

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    navigate("/signin");
  };

  const menuItems = [
    { name: "", path: "/" },
    { name: "🩶 Favorites", path: "/favorites" },
    { name: "🛒 Cart", path: "/cart" },
  ];

  return (
    <div className="navbar-ell">
      <div className="navbar">
        <div className="navbar-element">
          <div className="navbar-logo">
            <Link to="/">
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
            <img src="src/assets/navbar/user-svgrepo-com.svg" alt="user icon" />
            {user ? (
              <>
                <span>{user.username}</span>
                <button className="log-btn" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <span>User</span>
                <Link to="/signin">
                  <button className="log-btn">Sign In</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
