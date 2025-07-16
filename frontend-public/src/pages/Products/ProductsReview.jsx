import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

import './ProductsReview.css';

const ProductsReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(2);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Rodrigo Torres',
      rating: 5,
      comment: 'Reppo es un Gel energético de "recuperación" específico que combina la sacarosa y fructosa con aminoácidos de cadena ramificada (BCAA) y vitamina C. Esta formulado para contribuir con la reconstrucción de las fibras musculares post-ejercicio. De esta manera colabora en evitar el catabolismo muscular, y así mejorando el rendimiento.'
    },
    {
      id: 2,
      name: 'David Zepeda',
      rating: 4,
      comment: 'Reppo es un Gel energético de "recuperación" específico que combina la sacarosa y fructosa con aminoácidos de cadena ramificada (BCAA) y vitamina C. Esta formulado para contribuir con la reconstrucción de las fibras musculares post-ejercicio. De esta manera colabora en evitar el catabolismo muscular, y así mejorando el rendimiento.'
    },
    {
      id: 3,
      name: 'Olga Flores',
      rating: 5,
      comment: 'Reppo es un Gel energético de "recuperación" específico que combina la sacarosa y fructosa con aminoácidos de cadena ramificada (BCAA) y vitamina C. Esta formulado para contribuir con la reconstrucción de las fibras musculares post-ejercicio. De esta manera colabora en evitar el catabolismo muscular, y así mejorando el rendimiento.'
    }
  ]);

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  const products = {
    1: { name: 'Carbo Upp', image: '/CarboUpp.png', price: 2.50 },
    2: { name: 'Ener Kik', image: '/EnerKik.png', price: 2.75 },
    3: { name: 'Reppo', image: '/Reppo.png', price: 2.50 }
  };

  const currentProduct = products[id];

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.name.trim() && newReview.comment.trim()) {
      const review = {
        id: reviews.length + 1,
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment
      };
      setReviews([review, ...reviews]);
      setNewReview({ name: '', rating: 5, comment: '' });
      setShowReviewForm(false);
      alert('¡Reseña agregada exitosamente!');
    }
  };

  const handleAddToCart = () => {
    alert(`Agregado al carrito: ${quantity} x ${currentProduct.name} - $${(currentProduct.price * quantity).toFixed(2)}`);
  };

  const handleCustomizeProduct = () => {
    navigate(`/sabores/`);
  };

  const handleBackToProducts = () => {
    navigate('/productos'); // CORREGIDO: Ruta correcta
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`star ${i < rating ? 'filled' : 'empty'}`}
        size={16}
      />
    ));
  };

  const renderInteractiveStars = (rating, onRatingChange) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`star interactive ${i < rating ? 'filled' : 'empty'}`}
        size={20}
        onClick={() => onRatingChange(i + 1)}
      />
    ));
  };

  if (!currentProduct) {
    return (
      <div className="products-review-wrapper">
        
        <div className="product-detail-screen">
          <div className="product-not-found">
            <h2>Producto no encontrado</h2>
            <p>El producto que buscas no existe o ha sido eliminado.</p>
            <button onClick={handleBackToProducts} className="back-to-products-btn">
              Volver a Productos
            </button>
          </div>
        </div>
        
      </div>
    );
  }

  return (
    <div className="products-review-wrapper">
      
      <div className="product-detail-screen">
        <div className="product-detail-main">
          <div className="product-detail-container">
            {/* Botón de volver */}
            <button 
              className="back-button"
              onClick={handleBackToProducts}
            >
              ← Volver a Productos
            </button>

            <div className="product-detail-layout">
              {/* Lado izquierdo - Imagen */}
              <div className="product-image-section">
                <div className="product-image-container">
                  <img 
                    src={currentProduct.image} 
                    alt={currentProduct.name}
                    className="product-main-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                      console.log(`Error loading image: ${currentProduct.image}`);
                    }}
                  />
                </div>
              </div>

              {/* Lado derecho - Información */}
              <div className="product-info-section">
                <h1 className="product-title">{currentProduct.name}</h1>
                <div className="product-price">${currentProduct.price.toFixed(2)}</div>
                <div className="product-flavor">Sabor: 🥭</div>
                
                <div className="quantity-section">
                  <span>Cantidad:</span>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(-1)}
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button 
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                  >
                    Agregar Al Carrito
                  </button>
                  <button 
                    className="customize-btn"
                    onClick={handleCustomizeProduct}
                  >
                    Personalizar Producto
                  </button>
                </div>

                <div className="product-description">
                  <p>Reppo es un Gel energético de "recuperación" específico que combina la sacarosa y fructosa con aminoácidos de cadena ramificada (BCAA) y vitamina C. Esta formulado para contribuir con la reconstrucción de las fibras musculares post-ejercicio. De esta manera colabora en evitar el catabolismo muscular, y así mejorando el rendimiento.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Reseñas */}
          <div className="reviews-section">
            <div className="reviews-container">
              <div className="reviews-header">
                <h2>Reseñas</h2>
                <button 
                  className="add-review-btn"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  {showReviewForm ? 'Cancelar' : 'Agregar Reseña'}
                </button>
              </div>

              {/* Formulario de reseña */}
              {showReviewForm && (
                <div className="review-form-container">
                  <form onSubmit={handleSubmitReview} className="review-form">
                    <div className="form-group">
                      <label>Tu nombre:</label>
                      <input
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        placeholder="Ingresa tu nombre"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Calificación:</label>
                      <div className="rating-input">
                        {renderInteractiveStars(newReview.rating, (rating) => 
                          setNewReview({...newReview, rating})
                        )}
                        <span className="rating-text">({newReview.rating} estrella{newReview.rating !== 1 ? 's' : ''})</span>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Tu comentario:</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder="Cuéntanos qué te pareció el producto..."
                        rows="4"
                        required
                      />
                    </div>
                    
                    <div className="form-buttons">
                      <button type="submit" className="submit-review-btn">
                        Enviar Reseña
                      </button>
                      <button 
                        type="button" 
                        className="cancel-review-btn"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="reviews-grid">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="reviewer-details">
                          <div className="reviewer-name">{review.name}</div>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="review-comment">
                      {review.comment}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
     
    </div>
  );
};

export default ProductsReview;