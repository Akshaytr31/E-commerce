import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai"; 
import "./adminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin/dashboard";
    } else {
      alert(data.error);
    }
  }

  return (
    <div className="admin-login-container">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter admin email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter admin password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="admin-login-btn" type="submit">
          Login
        </button>
        <div className="admin-login-link">
          <Link to="/login">
            Login as User <AiOutlineArrowRight size={18} />
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;
