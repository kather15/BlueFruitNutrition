import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import { Star } from 'lucide-react'; 
import toast from 'react-hot-toast'; 
import ReviewForm from "../../components/Review/ReviewForm";  
import Review from '../../components/Review/ReviewView';  
import { useAuthContext } from '../../context/useAuth'; 
import './ProductsReview.css';

const ProductsReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Accedemos al contexto de autenticación
  const { isAuthenticated, user } = useAuthContext();

  // Estados principales
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false); // Estado para mostrar el formulario de reseña
// Cargar información del producto
useEffect(() => {
  fetch(`http://localhost:4000/api/products/${id}`, {
    credentials: 'include',  // <--- Agregar esta línea
  })
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
  fetch(`http://localhost:4000/api/reviews?idProduct=${id}`, {
    credentials: 'include',  // <--- Y aquí también
  })
    .then(res => res.json())
    .then(data => setReviews(data))
    .catch(err => console.error('Error al obtener reseñas:', err));
};


  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
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

  const handleBackToProducts = () => navigate('/product');

  // Verificación de si el producto no se encuentra
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

  // Verificación de autenticación antes de permitir agregar reseña
  const handleAddReview = () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar una reseña.");
      navigate("/login"); // Redirige al login si no está autenticado
    } else {
      // Si está autenticado, muestra el formulario de reseña
      setShowReviewForm(true);
    }
  };

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
                  <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    Agregar Al Carrito
                  </button>
                </div>

                <div className="product-description">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Aquí agregamos el formulario para agregar una nueva reseña */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h2>Reseñas</h2>
              <button
                className="add-review-btn"
                onClick={handleAddReview} // Llamar a la función de validación de login
              >
                Agregar Reseña
              </button>
            </div>

            {showReviewForm && (
              <ReviewForm productId={id} onClose={() => setShowReviewForm(false)} />
            )}

            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Review key={review._id} review={review} />
              ))
            ) : (
              <p>No hay reseñas aún. ¡Sé el primero en comentar!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsReview;
