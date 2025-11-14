import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import "./login.css";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const {setUser}=useContext(UserContext)
  const navigate=useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user)
        setMessage("✅ Login successful!");
        console.log("User:", data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/")
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Server error. Try again later.");
    }
  };

  return (
    <div className="signin-page">
      <form className="signin-form" onSubmit={handleLogin}>
        <h2>Log In</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        {message && <p className="login-message">{message}</p>}
      </form>
    </div>
  );
}

export default Signin;
