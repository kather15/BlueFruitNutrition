import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [showFlavorDrawer, setShowFlavorDrawer] = useState(false);

  // Cargar información del producto y parsear sabores correctamente
  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        let flavorsArray = [];

        if (typeof data.flavor === 'string') {
          try {
            flavorsArray = JSON.parse(data.flavor);
          } catch (error) {
            console.error("Error parseando sabores:", error);
            flavorsArray = [data.flavor]; // fallback a string solo
          }
        } else if (Array.isArray(data.flavor)) {
          flavorsArray = data.flavor;
        }

        setProduct({ ...data, flavor: flavorsArray });

        if (flavorsArray.length > 0) {
          setSelectedFlavor(flavorsArray[0]); // primer sabor por defecto
        }
      })
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
    fetch(`http://localhost:4000/api/reviews?idProduct=${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Error al obtener reseñas:', err));
  };

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleFlavorChange = (flavor) => {
    setSelectedFlavor(flavor);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.flavor && product.flavor.length > 1 && !selectedFlavor) {
      toast.error("Por favor selecciona un sabor");
      return;
    }

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const productId = product._id || product.id;

    const uniqueId = product.flavor && product.flavor.length > 1
      ? `${productId}_${selectedFlavor}`
      : productId;

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
        sabor: selectedFlavor || (Array.isArray(product.flavor) ? product.flavor[0] : product.flavor),
        imagen: product.image || '/placeholder-product.png'
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    const flavorText = selectedFlavor ? ` (${selectedFlavor})` : '';
    toast.success(`Agregado al carrito: ${quantity} x ${product.name}${flavorText}`);
  };

  const handleBackToProducts = () => navigate('/product');

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

  const handleAddReview = () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar una reseña.");
      navigate("/login");
    } else {
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
                    }}
                  />
                </div>
              </div>

              <div className="product-info-section">
                <h1 className="product-title">{product.name}</h1>
                <div className="product-price">${product.price.toFixed(2)}</div>

                {product.flavor && product.flavor.length > 0 && (
                  <div className="flavor-selector-container">
                    <label htmlFor="flavor-select" className="flavor-label">Sabor:</label>
                    <select
                      id="flavor-select"
                      value={selectedFlavor}
                      onChange={(e) => handleFlavorChange(e.target.value)}
                      className="flavor-dropdown"
                    >
                      {product.flavor.map((flavor, index) => (
                        <option key={index} value={flavor}>
                          {flavor}
                        </option>
                      ))}
                    </select>

                    {selectedFlavor && (
                      <p className="selected-flavor">
                        Sabor seleccionado: <strong>{selectedFlavor}</strong>
                      </p>
                    )}
                  </div>
                )}

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
                    {selectedFlavor && ` (${selectedFlavor})`}
                  </button>
                </div>

                <div className="product-description">
                  <p>{product.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de reseñas */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h2>Reseñas</h2>
              <button className="add-review-btn" onClick={handleAddReview}>
                Agregar Reseña
              </button>
            </div>

            {showReviewForm && (
              <ReviewForm
                productId={id}
                onClose={() => setShowReviewForm(false)}
                onReviewAdded={loadReviews}
              />
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
