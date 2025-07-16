import React from 'react';
import './Suscripciones.css';

const Beneficios = () => {
  return (
    <div className="beneficios-page">
      {/* Header Component Here */}
      
      <main className="beneficios-main">
        <div className="beneficios-container">
          <div className="beneficios-card">
            <div className="beneficios-content">
              <div className="beneficios-info">
                <h1 className="beneficios-title">Beneficios</h1>
                
                <div className="beneficios-list">
                  <div className="beneficio-item">
                    <span className="beneficio-bullet">○</span>
                    <div className="beneficio-text">
                      <strong>Descuentos exclusivos</strong>
                      <br />
                      Ofertas especiales solo para miembros.
                    </div>
                  </div>
                  
                  <div className="beneficio-item">
                    <span className="beneficio-bullet">○</span>
                    <div className="beneficio-text">
                      <strong>Promociones anticipadas</strong>
                      <br />
                      Acceso anticipado lanzamientos.
                    </div>
                  </div>
                  
                  <div className="beneficio-item">
                    <span className="beneficio-bullet">○</span>
                    <div className="beneficio-text">
                      <strong>Envío gratis</strong>
                      <br />
                      Envío sin costo en pedidos, en compras por tienda online
                    </div>
                  </div>
                  
                  <div className="beneficio-item">
                    <span className="beneficio-bullet">○</span>
                    <div className="beneficio-text">
                      <strong>Descuento especial en el mes de cumpleaños</strong>
                    </div>
                  </div>
                  
                  <div className="beneficio-item">
                    <span className="beneficio-bullet">○</span>
                    <div className="beneficio-text">
                      <strong>Sistema de acumulación de puntos</strong>
                    </div>
                  </div>
                  
                  <div className="beneficio-item">
                    <span className="beneficio-bullet">○</span>
                    <div className="beneficio-text">
                      <strong>Promocionales (camisas, gorras, etc) por acumulación de puntos</strong>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="beneficios-product">
                <div className="product-image">
                  <img src="/dist/reppobanano.png" alt="Reppo Banano" />
                </div>
                <div className="product-price">
                  $19.99
                </div>
              </div>
            </div>
            
            <div className="beneficios-footer">
              <button className="comprar-button">
                Comprar
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Component Here */}
    </div>
  );
};

export default Beneficios;