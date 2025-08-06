import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import './ProductsReview.css';

const ProductsReview = () => {
  const { id } = useParams(); // ID del producto desde la URL
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
  });

  // Cargar producto
  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => {
        console.error('Error al cargar el producto:', err);
        setProduct(null);
      });
  }, [id]);

  // Cargar reseñas del producto
  useEffect(() => {
    fetch(`http://localhost:4000/api/reviews?idProduct=${id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Error al obtener reseñas:', err));
  }, [id]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!newReview.name.trim() || !newReview.comment.trim()) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const reviewToSend = {
      comment: newReview.comment,
      rating: newReview.rating,
      idClient: newReview.name, // Este campo idealmente sería un ID real si tienes autenticación
      idProduct: id
    };

    fetch(`http://localhost:4000/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewToSend)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al guardar reseña');
        return res.json();
      })
      .then(() => {
        alert('¡Reseña agregada exitosamente!');
        setNewReview({ name: '', rating: 5, comment: '' });
        setShowReviewForm(false);
        // Recargar reseñas
        return fetch(`http://localhost:4000/api/reviews?idProduct=${id}`);
      })
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => alert(err.message));
  };

  const handleAddToCart = () => {
    alert(`Agregado al carrito: ${quantity} x ${product.name} - $${(product.price * quantity).toFixed(2)}`);
  };

  const handleCustomizeProduct = () => navigate('/sabores/');
  const handleBackToProducts = () => navigate('/product');

  const renderStars = (rating) => (
    [...Array(5)].map((_, i) => (
      <Star key={i} className={`star ${i < rating ? 'filled' : 'empty'}`} size={16} />
    ))
  );

  const renderInteractiveStars = (rating, onRatingChange) => (
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`star interactive ${i < rating ? 'filled' : 'empty'}`}
        size={20}
        onClick={() => onRatingChange(i + 1)}
      />
    ))
  );

  if (product === null) {
    return (
      <div className="products-review-wrapper">
        <div className="product-detail-screen">
          <div className="product-not-found">
            <h2>Producto no encontrado</h2>
            <button onClick={handleBackToProducts} className="back-to-products-btn">Volver a Productos</button>
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
            <button className="back-button" onClick={handleBackToProducts}>← Volver a Productos</button>

            <div className="product-detail-layout">
              <div className="product-image-section">
                <div className="product-image-container">
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
              </div>

              <div className="product-info-section">
                <h1 className="product-title">{product.name}</h1>
                <div className="product-price">${product.price.toFixed(2)}</div>
                {product.flavor && <div className="product-flavor">Sabor: {product.flavor}</div>}

                <div className="quantity-section">
                  <span>Cantidad:</span>
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                    <span className="quantity-display">{quantity}</span>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(1)}>+</button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="add-to-cart-btn" onClick={handleAddToCart}>Agregar Al Carrito</button>
                  <button className="customize-btn" onClick={handleCustomizeProduct}>Personalizar Producto</button>
                </div>

                <div className="product-description">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reseñas */}
          <div className="reviews-section">
            <div className="reviews-container">
              <div className="reviews-header">
                <h2>Reseñas</h2>
                <button className="add-review-btn" onClick={() => setShowReviewForm(!showReviewForm)}>
                  {showReviewForm ? 'Cancelar' : 'Agregar Reseña'}
                </button>
              </div>

              {showReviewForm && (
                <div className="review-form-container">
                  <form onSubmit={handleSubmitReview} className="review-form">
                    <div className="form-group">
                      <label>Tu nombre:</label>
                      <input
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        placeholder="Ingresa tu nombre"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Calificación:</label>
                      <div className="rating-input">
                        {renderInteractiveStars(newReview.rating, (rating) => setNewReview({ ...newReview, rating }))}
                        <span className="rating-text">({newReview.rating} estrella{newReview.rating !== 1 ? 's' : ''})</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Tu comentario:</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="Cuéntanos qué te pareció el producto..."
                        rows="4"
                        required
                      />
                    </div>

                    <div className="form-buttons">
                      <button type="submit" className="submit-review-btn">Enviar Reseña</button>
                      <button type="button" className="cancel-review-btn" onClick={() => setShowReviewForm(false)}>Cancelar</button>
                    </div>
                  </form>
                </div>
              )}

              <div className="reviews-grid">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">
                            {review.idClient?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className="reviewer-details">
                            <div className="reviewer-name">{review.idClient?.name || 'Anónimo'}</div>
                          </div>
                        </div>
                        <div className="review-rating">{renderStars(review.rating)}</div>
                      </div>
                      <div className="review-comment">{review.comment}</div>
                    </div>
                  ))
                ) : (
                  <p>No hay reseñas aún. ¡Sé el primero en comentar!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsReview;
