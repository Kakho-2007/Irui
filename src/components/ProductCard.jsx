import React, { useState } from "react";
import "./ProductCard.css";

export default function ProductCard({ product, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddClick = () => {
    addToCart(product, quantity);
  };

  const formattedPrice = (product.priceCents / 100).toFixed(2);

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150?text=Irui+Store";
          }}
        />
      </div>

      <div className="product-details">
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <div className="product-price-row">
          <span className="currency-symbol">$</span>
          <span className="price-integer">{formattedPrice}</span>
        </div>

        <div className="product-actions-wrapper">
          <div className="quantity-selector-block">
            <label htmlFor={`qty-${product.id}`} className="qty-label">
              Qty:
            </label>
            <select
              id={`qty-${product.id}`}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="qty-dropdown"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleAddClick} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
