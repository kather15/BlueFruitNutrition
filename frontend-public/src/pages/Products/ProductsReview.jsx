import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast'; 
import { useAuthContext } from '../../context/useAuth'; 
import './ProductsReview.css';

const ProductsReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Usar contexto en lugar de localStorage
  const { user, isAuthenticated, loading } = useAuthContext();

  // Estados principales:
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Estado para nueva reseña
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });

  // Cargar información del producto
  useEffect(() => {
    fetch(`https://bluefruitnutrition1.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => {
        console.error('Error al cargar el producto:', err);
        setProduct(null);
      });
  }, [id]);

  // Cargar reseñas
  useEffect(() => {
    loadReviews();
  }, [id]);

  const loadReviews = () => {
    fetch(`https://bluefruitnutrition1.onrender.com/api/reviews?idProduct=${id}`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Error al obtener reseñas:', err));
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  //  Función de enviar reseña usando contexto
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    //  Usar isAuthenticated del contexto
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para dejar una reseña.');
      navigate('/login');
      return;
    }

    if (!newReview.comment.trim()) {
      toast('Por favor escribe un comentario.', { icon: '⚠️' });
      return;
    }

    // CAMBIO: Usar token del contexto o obtener de cookies
    const reviewToSend = {
      comment: newReview.comment,
      rating: newReview.rating,
      idProduct: id
    };

    try {
      //  Usar credentials: 'include' para enviar cookies en lugar de Authorization header
      const response = await fetch(`https://bluefruitnutrition1.onrender.com/api/reviews`, {
        method: 'POST',
        credentials: 'include', // Esto envía las cookies automáticamente
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewToSend)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('¡Reseña agregada exitosamente!');
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
        loadReviews();
      } else {
        if (response.status === 401) {
          toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          navigate('/login');
        } else {
          toast.error(data.message || 'Error al guardar reseña');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error al enviar la reseña');
    }
  };

  //  Función para eliminar reseña
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) return;
    
    try {
      //  Usar credentials: 'include' en lugar de Authorization header
      const response = await fetch(`https://bluefruitnutrition1.onrender.com/api/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include' //  Enviar cookies
      });

      if (response.ok) {
        toast.success('Reseña eliminada correctamente');
        loadReviews();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Error al eliminar reseña');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error al eliminar la reseña');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const productId = product._id || product.id;
    const existente = carrito.find(p => p.id === productId);

    if (existente) {
      existente.cantidad += quantity;
    } else {
      carrito.push({
        id: productId,
        nombre: product.name,
        precio: product.price,
        cantidad: quantity,
        imagen: product.image || '/placeholder-product.png'
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    toast.success(`Agregado al carrito: ${quantity} x ${product.name}`);
  };

  const handleCustomizeProduct = () => navigate('/personalizar');
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

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <div className="products-review-wrapper">
        <div className="product-detail-screen">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Cargando...
          </div>
        </div>
      </div>
    );
  }

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
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                    Agregar Al Carrito
                  </button>
                  <button className="customize-btn" onClick={handleCustomizeProduct}>
                    Personalizar Producto
                  </button>
                </div>

                <div className="product-description">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="reviews-section">
            <div className="reviews-container">
              <div className="reviews-header">
                <h2>Reseñas</h2>

                {/* Usar isAuthenticated del contexto */}
                {isAuthenticated ? (
                  <button 
                    className="add-review-btn" 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    {showReviewForm ? 'Cancelar' : 'Agregar Reseña'}
                  </button>
                ) : (
                  <button 
                    className="login-to-review-btn" 
                    onClick={() => navigate('/login')}
                  >
                    Inicia sesión para reseñar
                  </button>
                )}
              </div>

              {showReviewForm && isAuthenticated && (
                <div className="review-form-container">
                  <form onSubmit={handleSubmitReview} className="review-form">

                    <div className="form-group">
                      {/*  Usar user del contexto */}
                      <label>Escribiendo como: <strong>{user?.email || 'Usuario'}</strong></label>
                    </div>

                    <div className="form-group">
                      <label>Calificación:</label>
                      <div className="rating-input">
                        {renderInteractiveStars(newReview.rating, (rating) => 
                          setNewReview({ ...newReview, rating })
                        )}
                        <span className="rating-text">
                          ({newReview.rating} estrella{newReview.rating !== 1 ? 's' : ''})
                        </span>
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

                          {/*  Usar user del contexto para comparar - probar ambas propiedades */}
                          {isAuthenticated && (user?.id === review.idClient?._id || user?._id === review.idClient?._id) && (
                            <button 
                              className="delete-review-btn"
                              onClick={() => handleDeleteReview(review._id)}
                              title="Eliminar reseña"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
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