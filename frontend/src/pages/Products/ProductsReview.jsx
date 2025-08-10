import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, X } from 'lucide-react';
import './ProductsReview.css'; 

const ProductReviews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [deletingReview, setDeletingReview] = useState(null);

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
    loadReviews();
  }, [id]);

  const loadReviews = () => {
    fetch(`http://localhost:4000/api/reviews?idProduct=${id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Error al obtener reseñas:', err));
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  //  Función para eliminar reseña 
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) return;

    try {
      setDeletingReview(reviewId);
      
      // Llamada directa sin token de autenticación
      const response = await fetch(`http://localhost:4000/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Reseña eliminada correctamente');
        // Recargar reseñas
        loadReviews();
      } else {
        const data = await response.json();
        alert(data.message || 'Error al eliminar reseña');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar la reseña');
    } finally {
      setDeletingReview(null);
    }
  };

  //No se usa por que es el mismo codigo de la parte pulica solo modifica que puede borar las reviews entonces esto no se manda a llamar 
  const handleAddToCart = () => {
    alert(`Agregado al carrito: ${quantity} x ${product.name} - $${(product.price * quantity).toFixed(2)}`);
  };

  const handleCustomizeProduct = () => navigate('/SeleccionarGel');
  const handleBackToProducts = () => navigate('/productos1'); //  Redirigir al panel admin

  const renderStars = (rating) => (
    [...Array(5)].map((_, i) => (
      <Star key={i} className={`star ${i < rating ? 'filled' : 'empty'}`} size={16} />
    ))
  );

  if (product === null) {
    return (
      <div className="products-review-wrapper">
        <div className="product-detail-screen">
          <div className="product-not-found">
            <h2>Producto no encontrado</h2>
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
            <button className="back-button" onClick={handleBackToProducts}>
               Volver a Productos
            </button>

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
                  <button className="add-to-cart-btn" >
                    Agregar Al Carrito
                  </button>
                  <button className="customize-btn">
                    Personalizar Producto
                  </button>
                </div>

                <div className="product-description">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/*  Sección de reseñas  */}
          <div className="reviews-section">
            <div className="reviews-container">
              <div className="reviews-header">
                <h2>Reseñas - Vista Administrativa</h2>
                {/* Sin botón de agregar reseña */}
                <span className="admin-badge">Panel Administrativo</span>
              </div>

              {/* Sin formulario de agregar reseña */}

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
                            <div className="reviewer-name">
                              {review.idClient?.name || 'Usuario'}
                            </div>
                            <div className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="review-actions">
                          <div className="review-rating">{renderStars(review.rating)}</div>
                          {/* Botón X para eliminar - SIEMPRE visible para admin */}
                          <button 
                            className="delete-review-btn admin-delete-btn"
                            onClick={() => handleDeleteReview(review._id)}
                            disabled={deletingReview === review._id}
                            title="Eliminar reseña"
                          >
                            {deletingReview === review._id ? (
                              <span className="loading-text">...</span>
                            ) : (
                              <X size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="review-comment">{review.comment}</div>
                    </div>
                  ))
                ) : (
                  <p>No hay reseñas aún.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;