import React from "react";
import "./ManageProducts.css";

function ProductTable({ products = [], onEdit, onDelete }) {
  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan="5" className="empty">
              No products found
            </td>
          </tr>
        ) : (
          products.map((p) => (
            <tr key={p._id}>
              <td>{p.title}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                {p.stock > 0 ? (
                  <span className="in-stock">Available</span>
                ) : (
                  <span className="out-stock">Out of Stock</span>
                )}
              </td>

              <td>
                <button className="edit-btn" onClick={() => onEdit(p)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => onDelete(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default ProductTable;