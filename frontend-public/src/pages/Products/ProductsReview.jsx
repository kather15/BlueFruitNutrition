import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast'; 
import './ProductsReview.css';

const ProductsReview = () => {
  // Obtiene el parámetro "id" de la URL (id del producto)
  const { id } = useParams();
  // Hook para navegación programada
  const navigate = useNavigate();

  // Estados principales:
  const [quantity, setQuantity] = useState(1);          // Cantidad seleccionada para agregar al carrito
  const [showReviewForm, setShowReviewForm] = useState(false);  // Mostrar u ocultar formulario de reseña
  const [product, setProduct] = useState(null);         // Datos del producto
  const [reviews, setReviews] = useState([]);           // Lista de reseñas del producto
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación del usuario
  const [user, setUser] = useState(null);               // Datos del usuario autenticado

  // Estado para nueva reseña (rating y comentario)
  const [newReview, setNewReview] = useState({
    rating: 5,    // Calificación por defecto 5 estrellas
    comment: '',  // Comentario vacío inicialmente
  });

  // Verificar si el usuario está autenticado al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('authToken');    // Obtener token guardado
    const userData = localStorage.getItem('userData');  // Obtener datos de usuario guardados
    
    if (token && userData) {
      setIsAuthenticated(true);                          // Si existen, marcar como autenticado
      setUser(JSON.parse(userData));                     // Parsear y guardar datos de usuario
    }
  }, []);

  // Cargar información del producto al cambiar el id
  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)   // Petición GET al backend
      .then(res => res.json())
      .then(data => setProduct(data))                   // Guardar datos del producto
      .catch(err => {
        console.error('Error al cargar el producto:', err);
        setProduct(null);                                // En caso de error, limpiar producto
      });
  }, [id]);

  // Cargar reseñas cuando cambia el id del producto
  useEffect(() => {
    loadReviews();
  }, [id]);

  // Función para cargar las reseñas desde el backend
  const loadReviews = () => {
    fetch(`http://localhost:4000/api/reviews?idProduct=${id}`)
      .then(res => res.json())
      .then(data => setReviews(data))                   // Guardar reseñas recibidas
      .catch(err => console.error('Error al obtener reseñas:', err));
  };

  // Cambiar cantidad (máximo 1 como mínimo)
  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  // Función que se ejecuta al enviar una reseña
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    // Si no está autenticado, mostrar error y redirigir a login
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para dejar una reseña.');
      navigate('/login');
      return;
    }

    // Validar que el comentario no esté vacío o solo espacios
    if (!newReview.comment.trim()) {
      toast('Por favor escribe un comentario.', { icon: '⚠️' });
      return;
    }

    // Obtener token para autorización
    const token = localStorage.getItem('authToken');
    
    // Preparar objeto reseña a enviar
    const reviewToSend = {
      comment: newReview.comment,
      rating: newReview.rating,
      idProduct: id
    };

    try {
      // Enviar reseña al backend mediante POST
      const response = await fetch(`http://localhost:4000/api/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`    // Autorización con token
        },
        body: JSON.stringify(reviewToSend)
      });

      const data = await response.json();

      if (response.ok) {
        // Si todo bien, mostrar éxito, limpiar formulario y recargar reseñas
        toast.success('¡Reseña agregada exitosamente!');
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
        loadReviews();
      } else {
        // Si el backend indica que la sesión expiró, limpiar y redirigir login
        if (data.requiresAuth) {
          toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setIsAuthenticated(false);
          navigate('/login');
        } else {
          // Mostrar mensaje de error enviado desde backend o genérico
          toast.error(data.message || 'Error al guardar reseña');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error al enviar la reseña');
    }
  };

  //  Función para eliminar una reseña (solo para el autor)
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) return; // Confirmar acción

    const token = localStorage.getItem('authToken');
    
    try {
      // Petición DELETE al backend para eliminar reseña
      const response = await fetch(`http://localhost:4000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Reseña eliminada correctamente');
        loadReviews(); // Recargar lista de reseñas
      } else {
        const data = await response.json();
        toast.error(data.message || 'Error al eliminar reseña');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error al eliminar la reseña');
    }
  };

  // Agregar producto al carrito guardado en localStorage
  const handleAddToCart = () => {
    if (!product) return; // Si no hay producto, no hacer nada

    // Obtener carrito actual o iniciar vacío
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const productId = product._id || product.id;
    // Buscar si el producto ya está en el carrito
    const existente = carrito.find(p => p.id === productId);

    if (existente) {
      existente.cantidad += quantity; // Si existe, aumentar cantidad
    } else {
      // Si no, agregar nuevo producto al carrito
      carrito.push({
        id: productId,
        nombre: product.name,
        precio: product.price,
        cantidad: quantity,
        imagen: product.image || '/placeholder-product.png'
      });
    }

    // Guardar carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Mostrar notificación de éxito
    toast.success(`Agregado al carrito: ${quantity} x ${product.name}`);
  };

  // Navegar a página para personalizar producto
  const handleCustomizeProduct = () => navigate('/SeleccionarGel');
  // Navegar de vuelta a listado de productos
  const handleBackToProducts = () => navigate('/product');

  // Función para mostrar estrellas fijas según rating
  const renderStars = (rating) => (
    [...Array(5)].map((_, i) => (
      <Star key={i} className={`star ${i < rating ? 'filled' : 'empty'}`} size={16} />
    ))
  );

  // Función para mostrar estrellas interactivas para seleccionar rating
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

  // Si el producto no fue encontrado (producto = null), mostrar mensaje y botón para volver
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

  // Visualización principal del componente con toda la información y funcionalidades
  return (
    <div className="products-review-wrapper">
      <div className="product-detail-screen">
        <div className="product-detail-main">
          <div className="product-detail-container">

            {/* Botón para volver al listado */}
            <button className="back-button" onClick={handleBackToProducts}>
              Volver a Productos
            </button>

            <div className="product-detail-layout">

              {/* Sección imagen del producto */}
              <div className="product-image-section">
                <div className="product-image-container">
                  <img
                    src={product.image || '/placeholder-product.png'}
                    alt={product.name}
                    className="product-main-image"
                    onError={(e) => {
                      // Si falla la carga de imagen, cargar placeholder
                      e.target.src = '/placeholder-product.png';
                      console.error(`Error loading image: ${product.image}`);
                    }}
                  />
                </div>
              </div>

              {/* Información del producto */}
              <div className="product-info-section">
                <h1 className="product-title">{product.name}</h1>
                <div className="product-price">${product.price.toFixed(2)}</div>
                {product.flavor && <div className="product-flavor">Sabor: {product.flavor}</div>}

                {/* Sección para controlar cantidad */}
                <div className="quantity-section">
                  <span>Cantidad:</span>
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                    <span className="quantity-display">{quantity}</span>
                    <button className="quantity-btn" onClick={() => handleQuantityChange(1)}>+</button>
                  </div>
                </div>

                {/* Botones para agregar al carrito o personalizar */}
                <div className="action-buttons">
                  <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                    Agregar Al Carrito
                  </button>
                  <button className="customize-btn" onClick={handleCustomizeProduct}>
                    Personalizar Producto
                  </button>
                </div>

                {/* Descripción del producto */}
                <div className="product-description">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de reseñas */}
          <div className="reviews-section">
            <div className="reviews-container">
              <div className="reviews-header">
                <h2>Reseñas</h2>

                {/* Mostrar botón para agregar reseña si está autenticado, si no, botón para login */}
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

              {/* Formulario para agregar una nueva reseña */}
              {showReviewForm && isAuthenticated && (
                <div className="review-form-container">
                  <form onSubmit={handleSubmitReview} className="review-form">

                    <div className="form-group">
                      <label>Escribiendo como: <strong>{user?.name}</strong></label>
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

              {/* Listado de reseñas */}
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
                          {/* Mostrar estrellas fijas */}
                          <div className="review-rating">{renderStars(review.rating)}</div>

                          {/* Si está autenticado y es el autor, mostrar botón para eliminar */}
                          {isAuthenticated && user?.id === review.idClient?._id && (
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
