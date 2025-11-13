import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./item.css";

function Item() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, addToFavorites, cart, favorites } = useCart();

  const isInCart = cart?.some((item) => item.id === Number(id));
  const isInFavorites = favorites?.some((item) => item.id === Number(id));

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = () => {
    if (isInCart) {
      toast.warning("Item already in cart!", { position: "top-right" });
      return;
    }
    addToCart(product);
    toast.success("🛒 Item added to cart!", { position: "top-right", autoClose: 2000 });
  };

  const handleAddToFavorite = () => {
    if (isInFavorites) {
      toast.warning("Item already in favorites!", { position: "top-right" });
      return;
    }
    addToFavorites(product);
    toast.info("❤️ Added to favorites!", { position: "top-right", autoClose: 2000 });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Item not found.</div>;

  return (
    <div className="item-page">
      <div className="item-container">
        <img src={product.image} alt={product.title} />
        <div className="item-details">
          <h2>{product.title}</h2>
          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description}</p>
          <div className="item-buttons">
            <button
              onClick={handleAddToFavorite}
              disabled={isInFavorites}
              className={isInFavorites ? "disabled" : ""}
            >
              {isInFavorites ? "Alredy In Favorites" : "Add to Favorite"}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={isInCart ? "disabled" : ""}
            >
              {isInCart ? "Already in Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Item;
