import React, { useState } from 'react';
import './Product.css';

const ProductDetail = () => {
  const [currentStep, setCurrentStep] = useState(2); // Producto Final activo
  const [quantity, setQuantity] = useState(2);
  const [selectedImage, setSelectedImage] = useState(0);

  // Datos del producto (ejemplo)
  const product = {
    name: "Reppo",
    price: "$2.50",
    flavor: "Sabores",
    description: "Reppo es un Gel Energético de 'recuperación' con Proteína de Suero concentrado enriquecido con aminoácidos de cadena ramificada (BCAA) y Vitamina C. Está formulado para contribuir a una reconstrucción de las fibras musculares post-ejercicio, de esta manera ayudando a evitar el catabolismo proteico y así mejorar el rendimiento.",
    images: [
      "/Reppo.png",
      "/Reppo.png", 
      "/Reppo.png",
      "/Reppo.png"
    ],
    mainImage: "/Reppo.png"
  };

  const pasos = ['Elegir Producto', 'Sabores', 'Producto Final'];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleBuy = () => {
    alert(`¡Agregado al carrito! ${quantity} x ${product.name}`);
  };

  return (
    <div className="product-detail-container">
      {/* Header con stepper */}
      <div className="product-header">
        <div className="stepper-container">
          {pasos.map((p, index) => {
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;
            
            return (
              <div 
                className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`} 
                key={index}
              >
                <div className={`circle ${isActive ? 'active' : ''}`} />
                <span className="label">{p}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="product-content">
        {/* Galería de imágenes */}
        <div className="product-gallery">
          <div className="thumbnail-list">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
          
          <div className="main-image">
            <img src={product.mainImage} alt={product.name} />
          </div>
        </div>

        {/* Información del producto */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price">{product.price}</p>
          <p className="product-flavor">{product.flavor}</p>
          
          <div className="product-description">
            <p>{product.description}</p>
          </div>

          {/* Controles de cantidad */}
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
            <button className="buy-btn" onClick={handleBuy}>
              Comprar
            </button>
          </div>

          {/* Información de entrega */}
          <div className="delivery-info">
            <div className="delivery-item">
              <div className="delivery-icon">🚚</div>
              <div className="delivery-text">
                <strong>Entrega en tienda</strong>
                <p>Ingresa un código postal para ver si entregamos a una sucursal</p>
              </div>
            </div>
            
            <div className="delivery-item">
              <div className="delivery-icon">↩️</div>
              <div className="delivery-text">
                <strong>Entrega de devolución</strong>
                <p>devolución gratuita en 30 días. Detalles</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;