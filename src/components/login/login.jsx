import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { AiOutlineArrowRight } from "react-icons/ai";
import "./login.css";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setUser(data.user);

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("email", data.user.email);

        navigate("/");
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
        <div>
          <label htmlFor="">Email</label>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>

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
