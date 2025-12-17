import Swal from "sweetalert2";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { UserContext } from "../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const isAdmin = localStorage.getItem("adminToken");

  // LOGOUT
  const handleLogout = () => {
    if (isAdmin) {
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    } else {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("email");
      navigate("/signin");
    }
  };

  // FORCE LOGIN FOR ALL ROUTES EXCEPT "/signin"
  const requireLogin = (path) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const admin = localStorage.getItem("adminToken");

    if (!user && !admin) {
      navigate("/signin");
      return;
    }

    navigate(path);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      localStorage.setItem("email", user.email);
    }
  }, []);

  return (
    <div className="navbar-ell">
      <div className="navbar">
        <div className="navbar-element">
          <div className="navbar-logo">
            <Link to={isAdmin ? "/admin/dashboard" : "/"}>
              <img
                src="src/assets/navbar/Gemini_Generated_Image_ez5a5sez5a5sez5a.png"
                alt="logo"
              />
            </Link>
          </div>
          <div className="navbar-title">GULLIES</div>
        </div>

        {/* DESKTOP MENU */}
        <div className="navbar-icons desktop-nav">
          <ul className="navbar-menu">
            {!isAdmin && (
              <>
                <li
                  className="navbar-items"
                  onClick={() => requireLogin("/favorites")}
                >
                  🩶 Favorites
                </li>

                <li
                  className="navbar-items"
                  onClick={() => requireLogin("/cart")}
                >
                  🛒 Cart
                </li>
              </>
            )}
          </ul>

          <div className="navbar-user">
            {/* PROFILE → protected route */}
            <div
              className="user-avatar"
              onClick={() =>
                isAdmin
                  ? navigate("/admin/dashboard")
                  : requireLogin("/profile")
              }
            >
              {isAdmin
                ? "A"
                : user
                ? user.username.charAt(0).toUpperCase()
                : "U"}
            </div>

            {isAdmin ? (
              <>
                <span>Admin</span>
                <button className="log-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : user ? (
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

        {/* MOBILE MENU ICON */}
        <div
          className="mobile-menu-icon"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <FontAwesomeIcon icon={openMenu ? faTimes : faBars} size="lg" />
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`mobile-dropdown ${openMenu ? "open" : ""}`}>
        {!isAdmin && (
          <>
            <div
              className="drop-item"
              onClick={() => {
                requireLogin("/favorites");
                setOpenMenu(false);
              }}
            >
              Favorites
            </div>

            <div
              className="drop-item"
              onClick={() => {
                requireLogin("/cart");
                setOpenMenu(false);
              }}
            >
              Cart
            </div>

            <div
              className="drop-item"
              onClick={() => {
                requireLogin("/profile");
                setOpenMenu(false);
              }}
            >
              {user ? user.username : "User"}
            </div>
          </>
        )}

        {user || isAdmin ? (
          <div
            className="drop-item"
            onClick={() => {
              handleLogout();
              setOpenMenu(false);
            }}
          >
            Log Out
          </div>
        ) : (
          <div
            className="drop-item"
            onClick={() => {
              navigate("/signin");
              setOpenMenu(false);
            }}
          >
            Sign In
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
