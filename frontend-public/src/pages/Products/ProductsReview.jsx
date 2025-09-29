import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReviewForm from "../../components/Review/ReviewForm";
import Review from '../../components/Review/ReviewView';
import { useAuthContext } from '../../context/useAuth';
import './ProductsReview.css';

const ProductsReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuthContext();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar información del producto
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/api/products/${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        console.log('🔍 Producto recibido del backend:', data);
        console.log('🍎 Campo flavor recibido:', data.flavor);
        
        // Procesar sabores - manejar doble serialización
        let flavorsArray = [];
        
        if (data.flavor) {
          if (Array.isArray(data.flavor)) {
            if (data.flavor.length > 0 && typeof data.flavor[0] === 'string') {
              if (data.flavor[0].startsWith('[') && data.flavor[0].endsWith(']')) {
                try {
                  flavorsArray = JSON.parse(data.flavor[0]);
                  console.log('✅ Doble serialización arreglada:', flavorsArray);
                } catch (error) {
                  flavorsArray = data.flavor;
                }
              } else {
                flavorsArray = data.flavor;
              }
            } else {
              flavorsArray = data.flavor;
            }
          } else if (typeof data.flavor === 'string') {
            try {
              const parsed = JSON.parse(data.flavor);
              if (Array.isArray(parsed)) {
                flavorsArray = parsed;
              } else {
                flavorsArray = [data.flavor];
              }
            } catch (error) {
              flavorsArray = [data.flavor];
            }
          } else {
            flavorsArray = [String(data.flavor)];
          }
        }

        // Limpiar sabores
        flavorsArray = flavorsArray
          .filter(f => f != null && f !== undefined)
          .map(f => String(f).trim())
          .filter(f => f.length > 0);
        
        console.log('🍎 Sabores procesados:', flavorsArray);

        setProduct({ ...data, flavor: flavorsArray });

        // Seleccionar primer sabor por defecto
        if (flavorsArray.length > 0) {
          setSelectedFlavor(flavorsArray[0]);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error al cargar el producto:', err);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  // Cargar reseñas
  useEffect(() => {
    loadReviews();
  }, [id]);

  const loadReviews = () => {
    fetch(`http://localhost:4000/api/reviews?idProduct=${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Error al obtener reseñas:', err));
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleFlavorChange = (e) => {
    const newFlavor = e.target.value;
    setSelectedFlavor(newFlavor);
    console.log('🔄 Sabor cambiado a:', newFlavor);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.flavor && product.flavor.length > 0 && !selectedFlavor) {
      toast.error("Por favor selecciona un sabor");
      return;
    }

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const productId = product._id || product.id;
    const uniqueId = selectedFlavor ? `${productId}_${selectedFlavor}` : productId;

    const existente = carrito.find(p => p.id === uniqueId);

    if (existente) {
      existente.cantidad += quantity;
    } else {
      carrito.push({
        id: uniqueId,
        productId: productId,
        nombre: product.name,
        precio: product.price,
        cantidad: quantity,
        sabor: selectedFlavor || 'Sin sabor',
        imagen: product.image || '/placeholder-product.png'
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    const flavorText = selectedFlavor ? ` - ${selectedFlavor}` : '';
    toast.success(`Agregado al carrito: ${quantity} x ${product.name}${flavorText}`);
  };

  const handleBackToProducts = () => navigate('/product');

  const handleAddReview = () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar una reseña.");
      navigate("/login");
    } else {
      setShowReviewForm(true);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="products-review-wrapper">
        <div className="product-detail-screen">
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Cargando producto...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
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
              ← Volver a Productos
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
                    }}
                  />
                </div>
              </div>

              <div className="product-info-section">
                <h1 className="product-title">{product.name}</h1>
                <div className="product-price">${product.price.toFixed(2)}</div>

                {/* 🔧 SELECTOR DE SABORES - SIN DUPLICACIÓN */}
                {product.flavor && product.flavor.length > 0 && (
                  <div className="flavor-selector-container">
                    <label htmlFor="flavor-select" className="flavor-label">
                      Sabor:
                    </label>
                    
                    <select
                      id="flavor-select"
                      value={selectedFlavor}
                      onChange={handleFlavorChange}
                      className="flavor-dropdown-select"
                    >
                      {product.flavor.map((flavor, index) => (
                        <option key={index} value={flavor}>
                          {flavor}
                        </option>
                      ))}
                    </select>

                  </div>
                )}

                <div className="quantity-section">
                  <span className="quantity-label">Cantidad:</span>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
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
             <button className="add-to-cart-btn" onClick={handleAddToCart}>
             Agregar al carrito
             {selectedFlavor && ` - ${selectedFlavor}`}
           </button>
          </div>

           <div className="action-buttons">
           <Link to="/personalizar" className="customize-btn">
           Personalizar
          </Link>
          </div>

                <div className="product-description">
                  <h3>Descripción</h3>
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="reviews-section">
            <div className="reviews-header">
              <h2>Reseñas del Producto</h2>
              <button className="add-review-btn" onClick={handleAddReview}>
                Agregar Reseña
              </button>
            </div>

            {showReviewForm && (
              <div className="review-form-wrapper">
                <ReviewForm
                  productId={id}
                  onClose={() => setShowReviewForm(false)}
                  onReviewAdded={loadReviews}
                />
              </div>
            )}

            <div className="reviews-container">
              {reviews.length > 0 ? (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <Review key={review._id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="no-reviews">
                  <p>No hay reseñas aún. ¡Sé el primero en comentar!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsReview;