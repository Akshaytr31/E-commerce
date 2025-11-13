import React, { useEffect, useState } from "react";
import "./product.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../pagginaton/pagination";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categoryMap = {
    All: "All",
    Electronics: "electronics",
    "Mens Fashion": "men's clothing",
    "Womens Fashion": "women's clothing",
    "Kids Fashion": "kids",
    "jewelery" : "jewelery"
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let results = products;

    const apiCategory = categoryMap[selectedCategory];

    if (apiCategory !== "All") {
      results = results.filter(
        (p) => p.category && p.category.toLowerCase() === apiCategory.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      results = results.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(results);
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

  return (
    <div className="product-page">
      <div className="product">
        <div className="product-page-search">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span>
            <img src="src/assets/navbar/icons8-search-50.png" alt="search icon" />
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

      <Pagination />

      {filteredProducts.length === 0 ? (
        <div className="no-items">No items found for {selectedCategory}.</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="product-card"
              onClick={() => navigate(`/products/${p.id}`)}
            >
              <img src={p.image} alt={p.title} />
              <h3>{p.title}</h3>
              <p>₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPage;
