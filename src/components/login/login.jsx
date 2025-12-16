import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FaGoogle } from "react-icons/fa";
import "./login.css";

import { doSignInWithGoogle } from "../../firebase/auth";
import { useAuth } from "../../context/authContext";

function Signin() {
  const { userLoggedIn } = useAuth();
  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // -----------------------------
  // NORMAL LOGIN
  // -----------------------------
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("email", data.user.email); // <-- IMPORTANT

        if (data.sellerToken) {
          localStorage.setItem("sellerToken", data.sellerToken);
        }

        navigate("/");
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setMessage("⚠️ Server error. Try again later.");
    }
  };

  // -----------------------------
  // GOOGLE LOGIN
  // -----------------------------
  const handleGoogleLogin = async () => {
    try {
      const googleUser = await doSignInWithGoogle();

      const userData = {
        email: googleUser.user.email,
        username: googleUser.user.displayName,
        photo: googleUser.user.photoURL,
        firebaseUid: googleUser.user.uid,
      };

      const res = await fetch("http://localhost:8000/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        // SAVE USER
        setUser(data.user);

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("email", data.user.email);

        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.sellerToken) {
          localStorage.setItem("sellerToken", data.sellerToken);
        }

        navigate("/");
      } else {
        setMessage("❌ Google login failed");
      }
    } catch (err) {
      setMessage("❌ Google login error");
    }
  };

  return (
    <div className="signin-page">
      <form className="signin-form" onSubmit={handleLogin}>
        <h2>Log In</h2>

        <div className="singin-input">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="singin-input">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        <div className="loging-seperator">
          <div className="line"></div>
          <div>or</div>
          <div className="line"></div>
        </div>

        {/* GOOGLE LOGIN BUTTON */}
        <button
          type="button"
          className="google-login-btn"
          onClick={handleGoogleLogin}
        >
          <img
            src="https://encrypted-tbn2.gstatic.com/favicon-tbn?q=tbn%3AANd9GcScs75O4lVSd_95ukYQ09Lia-D7VwK0sktPjPKCQxBd33UZZ4qcT66JV0ToxOm4LQULonJUY1rKBPzOcG3k0ZuxgHJ6rhEN5-oQ9ML834KpGEHG7NsWNWKAHBCvWYYm43PMHDE28I_MGwXXF1hcvGw4gQ"
            alt=""
            role="presentation"
            data-iml="2113.89999999851"
          />
          Continue with Google
        </button>

        {message && <p className="login-message">{message}</p>}

        <div className="admin-login-link">
          <Link to="/admin/login">
            Login as admin <AiOutlineArrowRight size={18} />
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Signin;
