import "./favorites.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  // Fetch Favorites from Backend
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

  // Remove From Favorites
  const removeFromFavorites = async (id) => {
    try {
      await fetch("http://localhost:8000/favorites/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, id }),
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
      <h2>My Favorites </h2>

      {favorites.length === 0 ? (
        <p>No favorite items yet!</p>
      ) : (
        <div className="favorite-grid">
          {favorites.map((p) => (
            <div
              key={p.id}
              className="favorite-card"
              onClick={() => handleItemClick(p.id)}
            >
              <div className="favorite-container2">
                <div className="favorite-image-container">
                  <img src={p.images} alt={p.title} />
                  <div>
                    <h3>{p.title}</h3>
                    <div className="favorite-price">
                      <p>₹ {p.price}</p>
                    </div>
                  </div>
                </div>
              </div>

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
