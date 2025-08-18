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
  const [editing, setEditing] = useState(false);

  // Estado para editar el producto
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    image: null, // file object
    imagePreview: '', // URL preview
  });

  // Cargar producto
  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = () => {
    fetch(`https://bluefruitnutrition1.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setEditForm({
          name: data.name,
          description: data.description,
          price: data.price,
          image: null,
          imagePreview: data.image || '/placeholder-product.png',
        });
      })
      .catch(err => {
        console.error('Error al cargar el producto:', err);
        setProduct(null);
      });
  };

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

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reseña?')) return;

    try {
      setDeletingReview(reviewId);
      const response = await fetch(`https://bluefruitnutrition1.onrender.com/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('Reseña eliminada correctamente');
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

  // Manejo inputs edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Manejo cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // Guardar edición
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      const response = await fetch(`https://bluefruitnutrition1.onrender.com/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Producto actualizado correctamente');
        setEditing(false);
        fetchProduct(); // recargar producto actualizado
      } else {
        const data = await response.json();
        alert(data.message || 'Error al actualizar producto');
      }
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      alert('Error al actualizar producto');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Restaurar formulario con datos actuales
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: null,
      imagePreview: product.image || '/placeholder-product.png',
    });
  };

  const handleBackToProducts = () => navigate('/productos1'); // volver al panel admin

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
                    src={editing ? editForm.imagePreview : (product.image || '/placeholder-product.png')}
                    alt={product.name}
                    className="product-main-image"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                      console.error(`Error loading image: ${product.image}`);
                    }}
                  />
                  {editing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="image-input"
                    />
                  )}
                </div>
              </div>

              <div className="product-info-section">
                {editing ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      placeholder="Nombre del producto"
                      className="edit-input"
                    />
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleInputChange}
                      placeholder="Descripción"
                      className="edit-textarea"
                    />
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleInputChange}
                      placeholder="Precio"
                      min="0"
                      step="0.01"
                      className="edit-input"
                    />
                  </>
                ) : (
                  <>
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    {product.flavor && <div className="product-flavor">Sabor: {product.flavor}</div>}
                    <div className="product-description">
                      <p>{product.description}</p>
                    </div>
                  </>
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
                  {editing ? (
                    <>
                      <button className="save-btn" onClick={handleSave}>Guardar</button>
                      <button className="cancel-btn" onClick={handleCancel}>Cancelar</button>
                    </>
                  ) : (
                    <button className="customize-btn" onClick={() => setEditing(true)}>
                      Editar Producto
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sección de reseñas */}
          <div className="reviews-section">
            <div className="reviews-container">
              <div className="reviews-header">
                <h2>Reseñas - Vista Administrativa</h2>
                <span className="admin-badge">Panel Administrativo</span>
              </div>

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
