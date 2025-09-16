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

  // estado de reseñas
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  // cargar producto
  useEffect(() => {
    fetch(`https://bluefruitnutrition1.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => { console.error(err); setProduct(null); });
  }, [id]);

  // cargar reseñas
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

  // enviar reseña
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para dejar una reseña.');
      navigate('/login');
      return;
    }

    if (!newReview.comment.trim()) {
      toast('Por favor escribe un comentario.', { icon: '⚠️' });
      return;
    }

    const reviewToSend = {
      comment: newReview.comment,
      rating: newReview.rating,
      idProduct: id
    };

    try {
      const response = await fetch(`https://bluefruitnutrition1.onrender.com/api/reviews`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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

  // eliminar reseña
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) return;

    try {
      const response = await fetch(`https://bluefruitnutrition1.onrender.com/api/reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include'
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

        {/* Sección de reseñas */}
        <div className="reviews-section">
          <h3>Reseñas</h3>

          {reviews.length === 0 && <p>No hay reseñas todavía.</p>}

          {reviews.map(r => (
            <div key={r._id} className="review-item">
              <div className="review-header">
                <strong>{r.user?.name || 'Anónimo'}</strong>
                <span className="review-rating">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} size={16} />)}
                </span>
              </div>
              <p>{r.comment}</p>
              {user && user.id === r.user?._id && (
                <button onClick={() => handleDeleteReview(r._id)}>Eliminar</button>
              )}
            </div>
          ))}

          {showReviewForm ? (
            <form onSubmit={handleSubmitReview} className="review-form">
              <label>
                Calificación:
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                >
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Escribe tu reseña..."
              />
              <button type="submit">Enviar reseña</button>
              <button type="button" onClick={() => setShowReviewForm(false)}>Cancelar</button>
            </form>
          ) : (
            <button onClick={() => setShowReviewForm(true)}>Escribir una reseña</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsReview;
