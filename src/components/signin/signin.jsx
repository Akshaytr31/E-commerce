import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";
import "./signin.css";

function Signin() {
  const [username,setUsername]=useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user); 
        setMessage("✅ Login successful!");
        navigate("/login"); 
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
        <h2>Sign In</h2>

        <input 
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e)=>setUsername(e.target.value)} />

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

        <button type="submit">Sign in</button>

        {message && <p className="login-message">{message}</p>}
        <div>
           Already you have an account <Link to='/login'> Log in </Link>
        </div>
      </form>
    </div>
  );
}

export default Signin;
