import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SeleccionarGel.css';

const EligeGel = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  // Datos de los productos
  const productos = [
    {
      id: 1,
      nombre: "Carbo Upp",
      imagen: "/CarboUpp.png",
      descripcion: "Gel energético de carbohidratos para rendimiento óptimo"
    },
    {
      id: 2,
      nombre: "Ener Kik",
      imagen: "/EnerKik.png", 
      descripcion: "Energía instantánea con cafeína natural"
    },
    {
      id: 3,
      nombre: "Reppo",
      imagen: "/Reppo.png",
      descripcion: "Gel de recuperación con proteínas y aminoácidos"
    },
    {
      id: 4,
      nombre: "Ener Balance",
      imagen: "/EnerBalance.png",
      descripcion: "Balance perfecto de energía y electrolitos"
    }
  ];

  const handleProductSelect = (producto) => {
    setSelectedProduct(producto);
    console.log(`Producto seleccionado: ${producto.nombre}`);
    
    // Navegar a la página de sabores
    navigate('/sabores', { 
      state: { 
        selectedProduct: producto 
      } 
    });
  };

  return (
    <div className="elige-gel-container">
      {/* Stepper */}
      <div className="stepper-section">
        <div className="stepper-container">
          <div className="step active">
            <div className="circle active"></div>
            <span className="label">Elegir Producto</span>
          </div>
          <div className="step">
            <div className="circle"></div>
            <span className="label">Sabores</span>
          </div>
          <div className="step">
            <div className="circle"></div>
            <span className="label">Producto Final</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        <div className="content-wrapper">
          <h1 className="main-title">Elige tu gel ideal</h1>
          
          <div className="description-text">
            <p>
              Nuestros productos están elaborados siguiendo los lineamientos de más alta nutrición, para brindar los 
              mejores nutrientes profesionales.
            </p>
            <p>
              Tu producto es elaborado bajo un proceso de manufactura responsable por la calidad en 
              cada uno de nuestros ingredientes. Los cuales están certificados, especialmente para tu deporte, 
              cumpliendo a riguroso control de calidad. Lo primero siempre es tu salud y el bienestar con el deporte 
              elegido, ofreciendo un nivel competitivo y un rendimiento óptimo desde la primera hasta la última porción.
            </p>
          </div>

          {/* Grid de productos */}
          <div className="productos-grid">
            {productos.map((producto) => (
              <div key={producto.id} className="producto-card">
                <div className="producto-imagen-container">
                  <div className="producto-imagen-bg"></div>
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="producto-imagen"
                  />
                </div>
                
                <div className="producto-info">
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <button 
                    className="seleccionar-btn"
                    onClick={() => handleProductSelect(producto)}
                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligeGel;