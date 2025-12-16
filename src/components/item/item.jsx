import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./item.css";
import ProductData from "../../products/products.json";
import { useNavigate } from "react-router-dom";

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
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!userEmail) {
      toast.error("Please log in first");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    navigate("/buy", {
      state: {
        product,
        selectedSize,
        qty: 1,
        total: product.price,
      },
    });
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, [id]);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const localProduct = ProductData.find((p) => p.id == id);

        const res = await fetch("http://localhost:8000/seller/products");
        const dbProducts = await res.json();

        const dbProduct = dbProducts.find((p) => p.id == id);

        const finalProduct = dbProduct || localProduct;

        setProduct(finalProduct);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    loadItem();
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

        toast.warning("Removed from favorites", { autoClose: 700 });
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

      toast.info("Added to favorites!", { autoClose: 700 });
      setIsInFavorites(true);
    } catch (err) {
      console.error("Add favorite error:", err);
      toast.error("Server error", { autoClose: 1000 });
    }
  };

  useEffect(() => {
    if (!product) return;

    const email = localStorage.getItem("email");
    if (!email) return;

    const key = `recentlyViewed_${email}`;
    let viewed = JSON.parse(localStorage.getItem(key)) || [];

    // Remove if already exists
    viewed = viewed.filter((item) => item.id !== product.id);

    // Add at top
    viewed.unshift({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
    });

    // Limit to last 10 items
    viewed = viewed.slice(0, 10);

    localStorage.setItem(key, JSON.stringify(viewed));
  }, [product]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Item not found.</div>;

  return (
    <div className="item-page">
      <div className="item-container">
        <div className="item-navigate-image">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="thumbnail"
              className={`navigate-thumb ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => changeImage(index)}
            />
          ))}
        </div>

        <div className="item-images">
          <div className="item-image-wrapper">
            <img
              key={activeIndex}
              src={product.images[activeIndex]}
              alt={product.title}
              className={`main-item-image ${exitClass} ${enterClass}`}
              onClick={() => setShowPopup(true)}
            />
            <button onClick={handleFavoriteToggle} className="favorite-btn">
              {isInFavorites ? (
                <FaHeart color="red" size={22} />
              ) : (
                <FaRegHeart size={22} color="grey" />
              )}
            </button>
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
            <p>{product.rating?.count} Left</p>
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
          <div className="item-policy">
            <div className="item-policy-element">
              <img
                src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-returns._CB562506492_.png"
                data-a-image-source="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-returns._CB562506492_.png"
              ></img>
              <span> 10 days Return & Exchange </span>
            </div>
            <div className="item-policy-element">
              <img
                src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/trust_icon_free_shipping_81px._CB562549966_.png"
                data-a-image-source="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/trust_icon_free_shipping_81px._CB562549966_.png"
              />
              <span> Free Delivery </span>
            </div>
            <div className="item-policy-element">
              <img
                src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/Secure-payment._CB650126890_.png"
                data-a-image-source="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/Secure-payment._CB650126890_.png"
              />
              <span> Secure Transaction </span>
            </div>
            <div className="item-policy-element">
              <img
                src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-top-brand._CB562506657_.png"
                data-a-image-source="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-top-brand._CB562506657_.png"
              />
              <span> Top Brand </span>
            </div>
          </div>
          <button className="view-btn" onClick={() => setShowDesc(!showDesc)}>
            {showDesc ? "Hide details" : "View more details..."}
          </button>

          <p className={`desc ${showDesc ? "show" : ""}`}>
            {product.description}
          </p>
          <div className="item-buttons">
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={isInCart ? "disabled" : ""}
            >
              {isInCart ? "Already in Cart" : "Add to Cart"}
            </button>
            <button onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="image-popup" onClick={() => setShowPopup(false)}>
          <img
            src={product.images[activeIndex]}
            alt="popup"
            className="popup-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Item;
