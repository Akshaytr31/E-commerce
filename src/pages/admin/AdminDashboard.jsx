import { useEffect, useState } from "react";
import "./adminDashboard.css";

function AdminDashboard() {
  const [message, setMessage] = useState("");

  // Product States
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [productImages, setProductImages] = useState("");
  const [productSizes, setProductSizes] = useState([]);
  const [productColors, setProductColors] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productRating, setProductRating] = useState("");
  const [productRatingCount, setProductRatingCount] = useState("");

  // Fetch dashboard welcome message
  useEffect(() => {
    fetch("http://localhost:8000/admin/dashboard", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("adminToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  // ADD PRODUCT FUNCTION
  const handleAddProduct = async (e) => {
    e.preventDefault();

    const productData = {
      id: Number(productId),
      title: productName,
      price: Number(productPrice),
      description,
      category,
      images: productImages.split(","),
      sizes: productSizes,
      colors: productColors.split(","),
      stock: Number(productStock),
      rating: {
        rate: Number(productRating),
        count: Number(productRatingCount),
      },
    };

    const response = await fetch("http://localhost:8000/admin/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("adminToken"),
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="admin-dashboard-container">
      {/* WELCOME MESSAGE */}
      <h3 className="welcome-msg">{message}</h3>

      <div className="admin-category">
        <div className="admin-category-label">
          Select category to post product{" "}
        </div>
        <div className="category-buttons">
          <button
            type="button"
            className={category === "clothing" ? "active-cat" : ""}
            onClick={() => setCategory("clothing")}
          >
            Clothing
          </button>

          <button
            type="button"
            className={category === "electronics" ? "active-cat" : ""}
            onClick={() => setCategory("electronics")}
          >
            Electronics
          </button>

          <button
            type="button"
            className={category === "jewelery" ? "active-cat" : ""}
            onClick={() => setCategory("jewelery")}
          >
            Jewellery
          </button>
        </div>
      </div>
      {/* STAT CARDS */}
      <div className="dashboard-grid">
        <div className="card">
          <h4>Total Orders</h4>
          <p className="card-number">54</p>
        </div>

        <div className="card">
          <h4>Pending Orders</h4>
          <p className="card-number">12</p>
        </div>
      </div>

      {/* PRODUCT FORM */}
      <div className="product-form-card">
        <h3>Add New Product</h3>

        <form className="product-form" onSubmit={handleAddProduct}>
          <input
            type="number"
            placeholder="Product ID"
            onChange={(e) => setProductId(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Product Title"
            onChange={(e) => setProductName(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price"
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Category (men/women/kids)"
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <textarea
            placeholder="Product Description"
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <textarea
            type="text"
            placeholder="Images (comma separated URLs)"
            onChange={(e) => setProductImages(e.target.value)}
            required
          ></textarea>
          <input
            type="text"
            placeholder="Enter sizes (comma separated)"
            onChange={(e) => setProductSizes(e.target.value.split(","))}
          />

          <input
            type="text"
            placeholder="Colors (Black,Blue,etc)"
            onChange={(e) => setProductColors(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            onChange={(e) => setProductStock(e.target.value)}
            required
          />

          <input
            type="number"
            step="0.1"
            placeholder="Rating (rate)"
            onChange={(e) => setProductRating(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Rating Count"
            onChange={(e) => setProductRatingCount(e.target.value)}
            required
          />

          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
}

export default AdminDashboard;
