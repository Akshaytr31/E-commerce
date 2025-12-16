import React, { useState } from "react";
import "./Request.css";
import { motion } from "framer-motion";

function Request() {
  const [form, setForm] = useState({
    email: "",
    shopName: "",
    gst: "",
    address: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/seller/request-seller", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <motion.div className="request-container"
    initial>
      <div className="seller-request">
        <h2>Apply to Become a Seller</h2>

        <form onSubmit={handleSubmit} className="seller-form">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            onChange={handleChange}
          />
          <input
            type="text"
            name="shopName"
            placeholder="Shop Name"
            required
            onChange={handleChange}
          />
          <input
            type="text"
            name="gst"
            placeholder="GST Number"
            required
            onChange={handleChange}
          />
          <textarea
            name="address"
            placeholder="Business Address"
            required
            onChange={handleChange}
          ></textarea>

          <button type="submit">Submit Request</button>
        </form>

        {msg && <p className="success-msg">{msg}</p>}
      </div>
    </motion.div>
  );
}

export default Request;
