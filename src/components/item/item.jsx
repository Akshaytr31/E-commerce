import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {useCart} from "../../context/CartContext"
import "./item.css";

function Item() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const {addToCart}=useCart()

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

  const handleAddToCart=()=>{
    addToCart(product)
    alert("🛒 Item added to cart successfully!")
  }

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
          <button
           onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Item;
