import './favorites.css';
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

function FavoritesPage() {
  const { favorites, removeFromFavorites } = useCart();
  const navigate = useNavigate();

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

              {/* stop propagation to prevent triggering navigation when clicking the remove button */}
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
