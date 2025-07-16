// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css'; // Asegúrate de crear este archivo CSS

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" />
        {/* Si quieres añadir un fondo detrás de la imagen como en el ejemplo */}
        <div className="product-background-shape"></div>
      </div>
      <h3 className="product-name">{product.name}</h3>
      <Link to={`/productos/${product.id}`} className="view-product-button">
        Ver Producto
      </Link>
    </div>
  );
};

export default ProductCard;