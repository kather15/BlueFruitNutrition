import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './ProductsMenu.css'; 

const ProductsC = () => {
  const navigate = useNavigate(); 
  const [products, setProducts] = useState([]); 

  useEffect(() => {
    fetch('https://bluefruitnutrition1.onrender.com/api/products') 
      .then(response => response.json()) 
      .then(data => {
        console.log('=== PRODUCTOS RECIBIDOS ===');
        data.forEach((product, index) => {
          console.log(`Producto ${index + 1}: ${product.name}`);
          console.log(`URL de imagen: "${product.image}"`);
          console.log(`Longitud: ${product.image ? product.image.length : 0} caracteres`);
          console.log('---');
        });
        setProducts(data);
      }) 
      .catch(error => console.error('Error fetching products:', error)); 
  }, []);

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
                <div key={product._id} className="product-card-item">
                 <div className="product-image-wrapper">
                  <img
                    src={product.image || '/placeholder-product.png'}
                    alt={product.name}
                    className="product-main-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                      console.error(`Error loading image: ${product.image}`);
                    }}
                  />
                </div>
                  <h3 className="product-name">{product.name}</h3>
                  <button
                    className="product-view-btn"
                    onClick={() => handleProductClick(product._id)} 
                  >
                    Ver Producto
                  </button>
                </div>
              ))}
              {products.length === 0 && <p>No hay productos disponibles.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsC;