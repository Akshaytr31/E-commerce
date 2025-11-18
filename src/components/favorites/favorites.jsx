import './favorites.css';
import { useState,useEffect } from 'react';
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`http://localhost:8000/favorites/${email}`);
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error("Fetch favorites error:", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFromFavorites = async (id) => {
    try {
      await fetch(`http://localhost:8000/favorites/${email}/${id}`, {
        method: "POST",
        headers:{"Content-type":"application/json"},
        body: JSON.stringify({email:userEmail,id})
      });

      setFavorites((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Remove favorite error:", err);
    }
  };

  const handleItemClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="favorites-page">
      <h2>My favorites</h2>

      {favorites.length === 0 ? (
        <p>No favorite items yet!</p>
      ) : (
        <div className="product-grid">
          {favorites.map((p) => (
            <div
              key={p.id}
              className="product-card"
              onClick={() => handleItemClick(p.id)}
            >
              <img src={p.image} alt={p.title} />
              <h3>{p.title}</h3>
              <p>₹{p.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromFavorites(p.id);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
