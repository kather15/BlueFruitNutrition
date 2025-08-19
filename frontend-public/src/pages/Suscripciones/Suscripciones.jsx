import React from 'react';
import './Suscripciones.css';

const Suscripcionees = ({ usuarioId, onNuevaSuscripcion }) => {

  
    const agregarSuscripcion = async () => {
  console.log('usuarioId:', usuarioId); 

  try {
    const res = await fetch('http://localhost:4000/api/suscripciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suscripcionId: Date.now().toString(),
        fechaInicio: new Date().toISOString(),
        usuario: usuarioId,
        precio: 19.99,
        plan: 'Única',
        estado: 'Activo'
      })
    });

    if (!res.ok) {
      throw new Error('Error al crear la suscripción');
    }

     const nueva = await res.json();
    alert("¡Suscripción agregada!");
    onNuevaSuscripcion(nueva);
  } catch (error) {
    console.error("Error al agregar la suscripción:", error);
    alert("Error al agregar la suscripción");
  }
};

  return (
    <div className="beneficios-page">
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
                      <br />Ofertas especiales solo para miembros.
                    </div>
                  </div>
                  <div className="beneficio-item">
                    <span className="beneficio-bullet">○</span>
                    <div className="beneficio-text">
                      <strong>Promociones anticipadas</strong>
                      <br />Acceso anticipado a lanzamientos.
                    </div>
                  </div>
                  <div className="beneficio-item">
                    <span className="beneficio-bullet">○</span>
                    <div className="beneficio-text">
                      <strong>Envío gratis</strong>
                      <br />Envío sin costo en pedidos, en compras por tienda online
Descuento especial en el mes de cumpleaños
                    </div>
                    
                  </div>
                   <div className="beneficio-item">
                    <span className="beneficio-bullet">○</span>
                    <div className="beneficio-text">
                      <br />Sistema de acumulación de puntos
                    </div>
                  </div>
                  
                </div>
              </div>

              <div className="beneficios-product">
                <div className="product-image">
                  <img src="./guineyo.png" alt="Reppo Banano" />
                </div>
                <div className="product-price">$19.99</div>
              </div>
            </div>

            <div className="beneficios-footer">
              <button className="comprar-button" onClick={agregarSuscripcion}>
                Comprar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Suscripcionees;
