import React, { useEffect, useState } from "react";
import "./ResentlyViewed.css";
import { useNavigate } from "react-router-dom";

function RecentlyViewed() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");  

  useEffect(() => {
    if (!email) return; 

    const key = `recentlyViewed_${email}`;
    const viewed = JSON.parse(localStorage.getItem(key)) || [];

    setItems(viewed);
  }, [email]);

  if (!email || items.length === 0) return null;

  return (
    <div className="recent-container">
      <p className="recent-title">Recently Viewed</p>

      <div className="recent-grid">
        {items.map((item) => (
          <div
            className="recent-card"
            key={item.id}
            onClick={() => navigate(`/products/${item.id}`)}
          >
            <img src={item.image} alt={item.title} />
            <p>{item.title}</p>
            <span>₹{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;
