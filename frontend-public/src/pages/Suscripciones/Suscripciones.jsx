import React from 'react';
import './Suscripciones.css';

const Beneficios = () => {
  const handleComprar = async () => {
    try {
      // 🔹 Aquí obtienes el email del usuario (ajusta según tu sistema de login)
      const userEmail = localStorage.getItem("userEmail") || "cliente@example.com";

     const nuevaSuscripcion = {
      suscripcionId: `SUB-${Date.now()}`,      // String ✔️
      fechaInicio: new Date(),                // Date ✔️ (objeto Date real)
      usuario: userEmail,                     // String ✔️
      precio: 19.99,                           // Number ✔️ (sin "$")
      plan: "Único",                           // String ✔️
      estado: "Activo"                         // String ✔️ (opcional pero válido)
    };


      const res = await fetch("https://bluefruitnutrition-production.up.railway.app/api/subscriptions/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaSuscripcion)
      });

      if (res.ok) {
        alert("✅ Suscripción completada");
      } else {
        const data = await res.json();
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      alert("⚠️ No se pudo completar la suscripción");
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
                      <br />
                      Ofertas especiales solo para miembros.
                    </div>
                  </div>

                  <div className="beneficio-item">
                    <span className="beneficio-bullet">○</span>
                    <div className="beneficio-text">
                      <strong>Promociones anticipadas</strong>
                      <br />
                      Acceso anticipado a lanzamientos.
                    </div>
                  </div>

                  <div className="beneficio-item">
                    <span className="beneficio-bullet">○</span>
                    <div className="beneficio-text">
                      <strong>Envío gratis</strong>
                      <br />
                      En compras en la tienda online.
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
                  <img src="./public/guineyo.png" alt="Reppo Banano" />
                </div>
                <div className="product-price">
                  $19.99
                </div>
              </div>
            </div>

            <div className="beneficios-footer">
              <button className="comprar-button" onClick={handleComprar}>
                Comprar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Beneficios;
