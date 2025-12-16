import React from "react";
import ProductData from "../../products/products.json";
import "./Catogery.css";

function Catogery({ onCategorySelect }) {
  const categoryMap = {
    Electronics: "electronics",
    "Mens Fashion": "men's clothing",
    "Womens Fashion": "women's clothing",
    jewelery: "jewelery",
  };

  const categories = Object.keys(categoryMap).map((catName) => {
    const apiCat = categoryMap[catName];

    const items = ProductData.filter(
      (p) => p.category?.toLowerCase() === apiCat.toLowerCase()
    );

    return {
      name: catName,
      image: items.length > 0 ? items[0].images[0] : null,
    };
  });

  const mensFashion = ProductData.filter(
    (p) => p.category?.toLowerCase() === "men's clothing"
  );

  const firstMensProduct = mensFashion[2];

  return (
    <div className="category-container">
      <div className="category-grid">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="category-card"
            onClick={() => onCategorySelect(cat.name)}
          >
            <img src={cat.image} alt={cat.name} className="category-img" />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      <div className="special-offer">
        {firstMensProduct && (
          <div className="category-card offer gradient"
          onClick={() => onCategorySelect("Mens Fashion")}>
            <img
              src={firstMensProduct.images[0]}
              alt={firstMensProduct.title}
              className="offer-img"
            />
            <div className="offer-title">
              <span>Shop your fashion needs</span>
              <p>Discover the latest trends with unbeatable prices.</p>
              <button className="offer-btn">Shop Now</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Catogery;
