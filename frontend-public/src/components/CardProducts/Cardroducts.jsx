import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onClick }) => {
  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image-wrapper">
        <img
          src={product.image || '/placeholder-product.png'}
          alt={product.name}
          className="product-image"
          onError={(e) => (e.target.src = '/placeholder-product.png')}
        />
        {/* Fondo eliminado para transparencia */}
      </div>
      <h3 className="product-name">{product.name}</h3>
      {product.price && <p className="product-price">${product.price}</p>}
      <button className="view-product-button">Ver Producto</button>
    </div>
  );
};

export default ProductCard;
