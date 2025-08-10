import React from "react";
import "./NotFoundPrivate.css";

const Error404Private = () => {
  return (
    <div className="error404-private-container">
      <h2 className="error404-private-title">404</h2>
      <h1 className="error404-private-subtitle">Página no encontrada</h1>
      <p className="error404-private-text">
        La página que intentas acceder no está disponible. Por favor, verifica tu URL o regresa al panel.
      </p>
  <img src="/MoraConfundidaPriv.png" alt="Mora confundida" className="error404-public-image" />

      <div className="error404-private-buttons">
        <a href="/homep" className="btn-primary">
          Ir a Inicio
        </a>
      </div>
    </div>
  );
};

export default Error404Private;
