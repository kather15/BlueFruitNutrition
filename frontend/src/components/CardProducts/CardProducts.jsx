import React from "react";
import "./CardItem.css";

function CartItem({ product, onEdit, onDelete }) {
  return (
    <div className="cart-card">
      <div className="cart-image-container">
        <div className="cart-image-bg" />
        <img src={product.image || "/producticon.png"} alt={product.name} className="cart-image" />
      </div>
      <h3 className="cart-title">{product.name}</h3>
      <div className="cart-actions">
        <button className="cart-edit" onClick={() => onEdit(product)}>
          Editar
        </button>
        <button className="cart-delete" onClick={() => onDelete(product._id)}>
          🗑️
        </button>
      </div>
    </div>
  );
}

export default CartItem;