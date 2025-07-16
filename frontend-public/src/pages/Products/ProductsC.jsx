import React from 'react';
import { useNavigate } from 'react-router-dom';

import './ProductsC.css';

const ProductsC = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: 'Carbo Upp',
      image: '/EnerKik.png'
    },
    {
      id: 2,
      name: 'Ener Kik', 
      image: '/EnerKik.png'
    },
    {
      id: 3,
      name: 'Reppo',
      image: '/Reppo.png'
    }
  ];

  const handleProductClick = (productId) => {
  
    navigate(`/producto/${productId}`);
  };

  return (
    <div className="products-screen-wrapper">
      
      <div className="products-screen">
        <div className="products-main-content">
          <div className="products-container">
            <h1 className="products-title">Nuestros Productos</h1>
            
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card-item">
                  <div className="product-image-wrapper">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.png';
                        console.log(`Error loading image: ${product.image}`);
                      }}
                    />
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <button 
                    className="product-view-btn"
                    onClick={() => handleProductClick(product.id)}
                  >
                    Ver Producto
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
   
    </div>
  );
};

export default ProductsC;