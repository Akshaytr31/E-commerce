import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./item.css";
import ProductData from "../../products/products.json";

function Item() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDesc, setShowDesc] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const userEmail = localStorage.getItem("email");
  const [selectedSize, setSelectedSize] = useState("");
  const [exitClass, setExitClass] = useState("");
  const [enterClass, setEnterClass] = useState("");

  // Fetch Product
  // useEffect(() => {
  //   const fetchItem = async () => {
  //     try {
  //       const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  //       const data = await res.json();
  //       setProduct(data);
  //     } catch (err) {
  //       console.error("Error fetching item:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchItem();
  // }, [id]);

  useEffect(() => {
    const item = ProductData.find((p) => p.id == id);
    setProduct(item);
    setLoading(false);
  }, [id]);

  const changeImage = (newIndex) => {
    if (newIndex === activeIndex) return;

    const movingRight = newIndex > activeIndex;

    // EXIT direction of current image
    setExitClass(movingRight ? "exit-left" : "exit-right");

    // Wait for exit animation to begin
    setTimeout(() => {
      setActiveIndex(newIndex); // change image

      // ENTER direction of new image
      setEnterClass(movingRight ? "enter-right" : "enter-left");
    }, 50);

    // Reset classes
    setTimeout(() => {
      setExitClass("");
      setEnterClass("");
    }, 500);
  };

  // Fetch cart & favorites status
  useEffect(() => {
    if (!userEmail) return;

    const checkStatus = async () => {
      try {
        const favRes = await fetch(
          `http://localhost:8000/favorites/${userEmail}`
        );
        const favData = await favRes.json();
        setIsInFavorites(favData.favorites?.some((item) => item.id == id));

        const cartRes = await fetch(`http://localhost:8000/cart/${userEmail}`);
        const cartData = await cartRes.json();
        setIsInCart(cartData?.some((item) => item.id == id));
      } catch (err) {
        console.error("Status check error:", err);
      }
    };

    checkStatus();
  }, [id, userEmail]);

  // Add to Cart (API)
  const handleAddToCart = async () => {
    if (!userEmail) {
      toast.error("Please log in first");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const res = await fetch("http://localhost:8000/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        product,
        selectedSize, 
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.warning(data.error);
      return;
    }

    toast.success("🛒 Added to cart!");
    setIsInCart(true);
  };

  // TOGGLE favorite
  const handleFavoriteToggle = async () => {
    if (!userEmail) {
      toast.error("Please log in first");
      return;
    }

    if (isInFavorites) {
      try {
        const res = await fetch("http://localhost:8000/favorites/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, id: Number(id) }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to remove favorite");
          return;
        }

        toast.warning("Removed from favorites");
        setIsInFavorites(false);
      } catch (err) {
        console.error("Remove favorite error:", err);
        toast.error("Server error");
      }

      return;
    }

    try {
      const res = await fetch("http://localhost:8000/favorites/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, product }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.warning(data.error);
        return;
      }

      toast.info("Added to favorites!");
      setIsInFavorites(true);
    } catch (err) {
      console.error("Add favorite error:", err);
      toast.error("Server error");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Item not found.</div>;

  return (
    <div className="item-page">
      <div className="item-container">
        <div className="item-images">
          <div className="item-image-wrapper">
            <img
              key={activeIndex}
              src={product.images[activeIndex]}
              alt={product.title}
              className={`main-item-image ${exitClass} ${enterClass}`}
            />
          </div>
          <div className="item-dots">
            {product.images.map((_, index) => (
              <span
                key={index}
                className={`item-dot ${activeIndex === index ? "active" : ""}`}
                onClick={() => changeImage(index)}
              ></span>
            ))}
          </div>
        </div>
        <div className="item-details">
          <h2>{product.title}</h2>
          <p className="price">₹{product.price}</p>

          <div className="item-rating">
            <p>Rating ⭐ {product.rating?.rate}</p>
            <p>Remaining {product.rating?.count} products</p>
          </div>

          <div className="item-sizes">
            <p>Select Size</p>
            <div className="sizes-list">
              {product.sizes.map((size, i) => (
                <span
                  key={i}
                  className={`size-box ${
                    selectedSize === size ? "active" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <button className="view-btn" onClick={() => setShowDesc(!showDesc)}>
            {showDesc ? "Hide details" : "View more details..."}
          </button>

          <p className={`desc ${showDesc ? "show" : ""}`}>
            {product.description}
          </p>

          <div className="item-buttons">
            <button onClick={handleFavoriteToggle}>
              {isInFavorites ? "Remove from Favorites" : "Add to Favorite"}
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
