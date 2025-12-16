import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SellerDashboard.css";
import AddProduct from "../addProduct/AddProduct";
import ManageProduct from "../manageProducts/ManageProduct";

function SellerDashboard() {
  const [showAddproduct, setShowAddProduct] = useState(false);
  const [showManageProduct, setShowMangeProduct] = useState(false);

  const [myProducts, setMyProducts] = useState([]);

  const [editProduct, setEditProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const updateProduct = async () => {
    const token = localStorage.getItem("sellerToken");

    try {
      const res = await fetch(
        `http://localhost:8000/seller/update-product/${editProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editProduct),
        }
      );

      const data = await res.json();

      // Update UI immediately
      setMyProducts((prev) =>
        prev.map((p) => (p._id === editProduct._id ? editProduct : p))
      );

      setEditMode(false);
    } catch (err) {
      console.log(err);
      alert("Failed to update product");
    }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setEditMode(true);
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("sellerToken");

    try {
      const res = await fetch(
        `http://localhost:8000/seller/delete-product/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      // Remove the product from UI without refreshing
      setMyProducts(myProducts.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    console.log("useEffect running.......");
    const token = localStorage.getItem("sellerToken");

    async function fetchSellerProducts() {
      try {
        const res = await fetch("http://localhost:8000/seller/my-products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("seller dashboard dataa", data);
        setMyProducts(data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchSellerProducts();
  }, []);

  return (
    <div className="seller-container">
      <div className="side-bar">
        <button
          onClick={() => {
            setShowAddProduct(false);
            setShowMangeProduct(false);
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => {
            setShowAddProduct(false);
            // setShowMangeProduct(!showManageProduct);
          }}
        >
          Manage Products
        </button>
        <Link to="/profile">
          <button>Profile</button>
        </Link>
      </div>

      {editMode && (
        <div className="edit-overlay">
          <div className="edit-modal">
            <h3>Edit Product</h3>

            <label>Title:</label>
            <input
              type="text"
              value={editProduct.title}
              onChange={(e) =>
                setEditProduct({ ...editProduct, title: e.target.value })
              }
            />

            <label>Price:</label>
            <input
              type="number"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
            />

            <label>Stock:</label>
            <input
              type="number"
              value={editProduct.rating.count}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  rating: {
                    ...editProduct.rating,
                    count: Number(e.target.value),
                  },
                })
              }
            />
            <label>Sizes (comma separated):</label>
            <input
              type="text"
              value={editProduct.sizes?.join(",") || ""}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  sizes: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />

            <div className="edit-buttons">
              <button onClick={updateProduct}>Save Changes</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}

      <div className="main-area">
        <div className="top-cards">
          <button
            className="seller-add-product hover"
            onClick={() => {
              setShowMangeProduct(false);
              setShowAddProduct(!showAddproduct);
            }}
          >
            Add Product
          </button>
          <div className="product-total">
            <button className="product-total-btn">
              Total Products: <span>{myProducts.length}</span>
            </button>
          </div>
        </div>

        <div className={`add-product-wrapper ${showAddproduct ? "open" : ""}`}>
          <AddProduct />
        </div>

        <div
          className={`add-product-wrapper ${showManageProduct ? "open" : ""}`}
        >
          <ManageProduct />
        </div>
        {!showAddproduct && !showManageProduct && (
          <table className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {myProducts.length === 0 ? (
                <tr>
                  <td colSpan="4">No products added yet</td>
                </tr>
              ) : (
                myProducts.map((p) => (
                  <tr key={p._id} className="seller-table">
                    <td>{p.title}</td>
                    <td>₹{p.price}</td>
                    <td>{p.rating?.count}</td>
                    <td>{p.category}</td>
                    <td className="table-actions">
                      <button onClick={() => deleteProduct(p._id)}>
                        Delete
                      </button>
                      <button onClick={() => openEdit(p)}>Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SellerDashboard;
