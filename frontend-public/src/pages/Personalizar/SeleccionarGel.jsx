import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SeleccionarGel.css';
import PasoActual from '../../components/PasoActual/PasoActual'; // Asegúrate que el path sea correcto

const EligeGel = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const productos = [
    { id: 1, nombre: "Carbo Upp", imagen: "/CarboUpp.png", descripcion: "Gel energético de carbohidratos para rendimiento óptimo" },
    { id: 2, nombre: "Ener Kik", imagen: "/EnerKik.png", descripcion: "Energía instantánea con cafeína natural" },
    { id: 3, nombre: "Reppo", imagen: "/Reppo.png", descripcion: "Gel de recuperación con proteínas y aminoácidos" },
    { id: 4, nombre: "Ener Balance", imagen: "/EnerBalance.png", descripcion: "Balance perfecto de energía y electrolitos" }
  ];

  const handleProductSelect = (producto) => {
    setSelectedProduct(producto);
    navigate('/sabores', { state: { selectedProduct: producto } });
  };

  const pasos = ['Elegir Producto', 'Sabores', 'Producto Final'];

  return (
    <div className="elige-gel-container">
      {/* Stepper */}
      <div className="stepper-section">
        <PasoActual paso={0} pasos={pasos} />
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
              Tu producto es elaborado bajo un proceso de manufactura responsable con ingredientes certificados. 
              Lo primero siempre es tu salud y el bienestar con el deporte que elegiste.
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
