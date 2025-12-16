import React, { useEffect, useState } from "react";
import "./product.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../pagginaton/pagination";
import ProductData from "../../products/products.json";
import { motion } from "framer-motion";
import Catogery from "../catogery/Catogery";
import RecentlyViewed from "../resentlyViewed/ResentlyViewed";

function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndexes, setActiveIndexes] = useState({});
  const navigate = useNavigate();
  const [paused, setPaused] = useState(null);
  const [fadeStates, setFadeStates] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categoryMap = {
    All: "All",
    Electronics: "electronics",
    "Mens Fashion": "men's clothing",
    "Womens Fashion": "women's clothing",
    "Kids Fashion": "kids",
    jewelery: "jewelery",
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const localProducts = ProductData;

        const res = await fetch("http://localhost:8000/seller/products");
        const dbProducts = await res.json();

        const combined = [...localProducts, ...dbProducts];

        setProducts(combined);
        setFilteredProducts(combined);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    let results = products;

    const apiCategory = categoryMap[selectedCategory];

    if (apiCategory !== "All") {
      results = results.filter(
        (p) =>
          p.category && p.category.toLowerCase() === apiCategory.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      results = results.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(results);
    setCurrentPage(1); // Reset pagination on filter/search change
  }, [searchTerm, selectedCategory, products]);

  if (loading)
    return (
      <div className="loading">
        <div>Loading products...</div>
      </div>
    );

  if (error) return <h3 style={{ color: "red" }}>Error: {error}</h3>;

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleCategoryFromGrid = (cat) => {
    setSelectedCategory(cat);
  };

  // Auto carousel hover
  const startCarousel = (productId, images) => {
    let i = activeIndexes[productId] || 0;

    const interval = setInterval(() => {
      // Start fade-out
      setFadeStates((prev) => ({ ...prev, [productId]: "fade-out" }));

      setTimeout(() => {
        // Change image
        i = (i + 1) % images.length;

        setActiveIndexes((prev) => ({
          ...prev,
          [productId]: i,
        }));

        // Fade-in new image
        setFadeStates((prev) => ({ ...prev, [productId]: "fade-in" }));
      }, 200);

      // Reset fade state after animation
      setTimeout(() => {
        setFadeStates((prev) => ({ ...prev, [productId]: "" }));
      }, 500);
    }, 1500);

    setPaused((prev) => ({
      ...prev,
      [productId]: interval,
    }));
  };

  const stopCarousel = (productId) => {
    clearInterval(paused?.[productId]);

    setPaused((prev) => ({
      ...prev,
      [productId]: null,
    }));
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleNextPage = () => {
    if (indexOfLastItem < filteredProducts.length) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <motion.div
      className="product-page"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="product">
        <div className="product-page-search">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span>
            <img
              src="src/assets/navbar/icons8-search-50.png"
              alt="search icon"
            />
          </span>
        </div>

        <div className="product-category">
          {Object.keys(categoryMap).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={selectedCategory === cat ? "active" : ""}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory === "All" && <Pagination />}
      {selectedCategory === "All" && (
        <Catogery onCategorySelect={handleCategoryFromGrid} />
      )}

      {currentProducts.length === 0 ? (
        <div className="no-items">No items found for {selectedCategory}.</div>
      ) : (
        <div className="product-grid">
          {currentProducts.map((p, index) => (
            <motion.div
              key={p.id}
              onClick={() => navigate(`/products/${p.id}`)}
              onMouseEnter={() => startCarousel(p.id, p.images)}
              onMouseLeave={() => stopCarousel(p.id)}
              className="product-card"
              initial={{ opacity: 0, translateY: 30 }}
              whileInView={{ opacity: 1, translateY: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{
                duration: 0.08,
                ease: "easeOut",
                delay: index * 0.07,
              }}
            >
              <img
                src={p.images[activeIndexes[p.id] || 0]}
                alt={p.title}
                className={`main-image ${fadeStates[p.id] || ""}`}
              />
              <div
                className="dots-container"
                onClick={(e) => e.stopPropagation()}
              >
                {p.images.map((_, i) => (
                  <span
                    key={i}
                    className={`dot ${
                      (activeIndexes[p.id] || 0) === i ? "active-dot" : ""
                    }`}
                    onClick={() =>
                      setActiveIndexes((prev) => ({ ...prev, [p.id]: i }))
                    }
                  ></span>
                ))}
              </div>

              <h3>{p.title}</h3>

              <div className="product-details">
                <p>₹ {p.price}</p>
                <p>⭐ {p.rating?.rate}</p>
              </div>

              <div className="product-count">
                <p>Remaining {p.rating?.count} products</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* PAGINATION UI */}
      {filteredProducts.length > itemsPerPage && (
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>

          <span>
            Page {currentPage} of{" "}
            {Math.ceil(filteredProducts.length / itemsPerPage)}
          </span>

          <button
            onClick={handleNextPage}
            disabled={indexOfLastItem >= filteredProducts.length}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default Product;
