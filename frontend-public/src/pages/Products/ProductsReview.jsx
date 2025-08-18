import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/useAuth';
import './ProductsReview.css';

const ProductsReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuthContext();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => { console.error(err); setProduct(null); });
  }, [id]);

  const handleQuantityChange = (change) => setQuantity(prev => Math.max(1, prev + change));

  const handleAddToCart = () => {
    if (!product) return;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const productId = product._id || product.id;
    const existente = carrito.find(p => p.id === productId);

    if (existente) existente.cantidad += quantity;
    else carrito.push({
      id: productId,
      nombre: product.name,
      precio: product.price,
      cantidad: quantity,
      imagen: product.image || '/placeholder-product.png'
    });

    localStorage.setItem("carrito", JSON.stringify(carrito));
    toast.success(`Agregado al carrito: ${quantity} x ${product.name}`);
  };

  const handleCustomizeProduct = () => {
    if (!product) return;
    navigate('/personalizar', {
      state: {
        nombre: product.name,
        imagen: product.image || '/placeholder-product.png'
      }
    });
  };

  const handleBackToProducts = () => navigate('/product');

  if (loading) return <div className="loading">Cargando...</div>;
  if (product === null) return (
    <div className="product-not-found">
      <h2>Producto no encontrado</h2>
      <button onClick={handleBackToProducts}>Volver a Productos</button>
    </div>
  );

  return (
    <div className="products-review-wrapper">
      <div className="product-detail-screen">
        <button className="back-button" onClick={handleBackToProducts}>← Volver</button>

        <div className="product-detail-layout">
          {/* Imagen del producto */}
          <div className="product-image-section">
            <img
              src={product.image || '/placeholder-product.png'}
              alt={product.name}
              className="product-main-image"
              onError={(e) => { e.target.src = '/placeholder-product.png'; }}
            />
          </div>

          {/* Información principal */}
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-price-flavor">
              <span className="product-price">${product.price.toFixed(2)}</span>
              {product.flavor && <span className="product-flavor">{product.flavor}</span>}
            </div>

            {/* Cantidad */}
            <div className="quantity-section">
              <span>Cantidad:</span>
              <div className="quantity-controls">
                <button className="quantity-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                <span className="quantity-display">{quantity}</span>
                <button className="quantity-btn" onClick={() => handleQuantityChange(1)}>+</button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Agregar Al Carrito
              </button>
              <button className="customize-btn" onClick={handleCustomizeProduct}>
                Personalizar Producto
              </button>
            </div>

            {/* Descripción */}
            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        {/* 
        // Sección de reseñas comentada
        <div className="reviews-section">
          ... // bloque de reseñas
        </div>
        */}
      </div>
    </div>
  );
};

export default ProductsReview;
