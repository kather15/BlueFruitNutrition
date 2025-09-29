import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReviewForm from '../../components/Review/ReviewForm';
import Review from '../../components/Review/ReviewView';
import { useAuthContext } from '../../context/useAuth';
import './ProductsReview.css';

const ProductsReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar producto
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:4000/api/products/${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        // Procesar sabores correctamente
        let flavorsArray = [];
        if (data.flavor) {
          try {
            flavorsArray = typeof data.flavor === 'string' ? JSON.parse(data.flavor) : data.flavor;
          } catch {
            flavorsArray = Array.isArray(data.flavor) ? data.flavor : [data.flavor];
          }
        }
        flavorsArray = flavorsArray.filter(f => f).map(f => f.toString().trim());

        setProduct({ ...data, flavor: flavorsArray });
        if (flavorsArray.length > 0) setSelectedFlavor(flavorsArray[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  // Cargar reseñas
  useEffect(() => {
    fetch(`http://localhost:4000/api/reviews?idProduct=${id}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleQuantityChange = (amount) => setQuantity(prev => Math.max(1, prev + amount));
  const handleFlavorChange = (e) => setSelectedFlavor(e.target.value);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.flavor.length > 0 && !selectedFlavor) {
      toast.error('Selecciona un sabor');
      return;
    }

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const uniqueId = selectedFlavor ? `${product._id}_${selectedFlavor}` : product._id;
    const existing = carrito.find(p => p.id === uniqueId);

    if (existing) existing.cantidad += quantity;
    else
      carrito.push({
        id: uniqueId,
        productId: product._id,
        nombre: product.name,
        precio: product.price,
        cantidad: quantity,
        sabor: selectedFlavor || 'Sin sabor',
        imagen: product.image || '/placeholder-product.png'
      });

    localStorage.setItem('carrito', JSON.stringify(carrito));
    toast.success(`Agregado: ${quantity} x ${product.name}${selectedFlavor ? ` - ${selectedFlavor}` : ''}`);
  };

  const handleBackToProducts = () => navigate('/product');
  const handleAddReview = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar reseña');
      navigate('/login');
    } else setShowReviewForm(true);
  };

  if (loading) return <p>Cargando producto...</p>;
  if (!product) return (
    <div>
      <p>Producto no encontrado</p>
      <button onClick={handleBackToProducts}>Volver a productos</button>
    </div>
  );

  return (
    <div className="products-review-wrapper">
      <button className="back-button" onClick={handleBackToProducts}>← Volver a Productos</button>
      <div className="product-detail-layout">
        <div className="product-image-section">
          <img src={product.image || '/placeholder-product.png'} alt={product.name} className="product-main-image"/>
        </div>

        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>

          {product.flavor.length > 0 && (
            <div className="flavor-selector-container">
              <label>Sabor:</label>
              <select value={selectedFlavor} onChange={handleFlavorChange}>
                {product.flavor.map((f, idx) => <option key={idx} value={f}>{f}</option>)}
              </select>
            </div>
          )}

          <div className="quantity-section">
            <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange(1)}>+</button>
          </div>

          <button onClick={handleAddToCart}>Agregar al carrito</button>
          <Link to="/personalizar">Personalizar</Link>

          <p>{product.description}</p>
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Reseñas</h2>
          <button onClick={handleAddReview}>Agregar reseña</button>
        </div>

        {showReviewForm && (
          <ReviewForm productId={id} onClose={() => setShowReviewForm(false)} onReviewAdded={() => {
            fetch(`http://localhost:4000/api/reviews?idProduct=${id}`, { credentials: 'include' })
              .then(res => res.json())
              .then(data => setReviews(data));
          }}/>
        )}

        <div className="reviews-container">
          {reviews.length > 0 ? reviews.map(r => <Review key={r._id} review={r}/>) :
            <p>No hay reseñas aún. ¡Sé el primero en comentar!</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductsReview;
