import React, { useState } from "react";
import "./AddProduct.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef } from "react";

function AddProduct() {
  const [category, setCategory] = useState("");
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    images: "",
    sizes: "",
    colors: "",
    stock: "",
    rate: "",
    count: "",
  });
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("sellerToken");

  // Auto generate unique ID
  const generateId = () => Date.now();

  // Reset the entire form
const resetForm = () => {
  setForm({
    title: "",
    price: "",
    description: "",
    images: "",
    sizes: "",
    colors: "",
    stock: "",
    rate: "",
    count: "",
  });

  // Clear the file input
  if (fileInputRef.current) {
    fileInputRef.current.value = "";  // <-- IMPORTANT FIX
  }
};


  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Upload multiple images to Cloudinary
  const uploadMultipleImages = async (files) => {
    let uploadedURLs = [];

    for (let i = 0; i < files.length; i++) {
      const data = new FormData();
      data.append("file", files[i]);
      data.append("upload_preset", "gullies_upload");
      data.append("cloud_name", "dgalhzf0o");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dgalhzf0o/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      uploadedURLs.push(result.secure_url);
    }

    setForm((prev) => ({
      ...prev,
      images: uploadedURLs.join(","),
    }));
  };

  // Submit product
  const submitProduct = async () => {
    const finalProduct = {
      id: generateId(),
      title: form.title,
      price: Number(form.price),
      description: form.description,
      category,
      images: form.images.split(","),
      sizes: form.sizes ? form.sizes.split(",") : [],
      colors: form.colors ? form.colors.split(",") : [],
      stock: Number(form.stock),
      rating: {
        rate: Number(form.rate),
        count: Number(form.count),
      },
    };

    try {
      const res = await fetch("http://localhost:8000/seller/add-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalProduct),
      });

      const data = await res.json();
      toast.success(data.message || "Product added successfully");

      resetForm(); // CLEAR FORM AFTER SUBMIT
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>

      {/* CATEGORY SELECTION */}
      <label>Select Category</label>
      <select
        className="custom-select"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          resetForm(); // reset form when changing category
        }}
      >
        <option value="">Please select category</option>
        <option value="men's clothing">Men Clothing</option>
        <option value="women's clothing">Women Clothing</option>
        <option value="electronics">Electronics</option>
        <option value="kids">Kids</option>
        <option value="jewelery">Jewelery</option>
      </select>

      <div className="dynamic-fields add-product-animate">
        {category && (
          <>
            {/* TITLE */}
            <div>
              <label>Product Title</label>
              <input
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* PRICE */}
            <div>
              <label>Price</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
              />
            </div>

            {/* STOCK */}
            <div className="stock">
              <label>Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
              />
            </div>

            {/* IMAGES */}
            <div>
              <label>Upload Images</label>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={(e) => uploadMultipleImages(e.target.files)}
              />
            </div>
          </>
        )}

        {/* FOR CLOTHING CATEGORIES */}
        {(category === "men's clothing" ||
          category === "women's clothing" ||
          category === "kids") && (
          <>
            <div>
              <label>Sizes (comma separated)</label>
              <input
                name="sizes"
                type="text"
                value={form.sizes}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Colors (comma separated)</label>
              <input
                name="colors"
                type="text"
                value={form.colors}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* FOR ELECTRONICS + JEWELERY */}
        {(category === "electronics" || category === "jewelery") && (
          <div>
            <label>Colors (comma separated)</label>
            <input
              name="colors"
              type="text"
              value={form.colors}
              onChange={handleChange}
            />
          </div>
        )}

        {/* RATING */}
        {category && (
          <>
            <div>
              <label>Rating (Rate)</label>
              <input
                name="rate"
                type="number"
                value={form.rate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Rating (Count)</label>
              <input
                name="count"
                type="number"
                value={form.count}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        {/* SUBMIT BUTTON */}
        {category && (
          <button className="submit-btn" onClick={submitProduct}>
            Add Product
          </button>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default AddProduct;
