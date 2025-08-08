import React from "react";
import "./Error404Private.css";

const Error404Private = () => {
  return (
    <div className="error404-private-container">
      <h1 className="error404-private-title">404</h1>
      <h2 className="error404-private-subtitle">Página no encontrada</h2>
      <p className="error404-private-text">
        La página que intentas acceder no está disponible. Por favor, verifica tu URL o regresa al panel.
      </p>
      <div className="error404-private-buttons">
        <a href="/dashboard" className="btn-primary">
          Ir al Dashboard
        </a>
        <a href="/logout" className="btn-secondary">
          Cerrar sesión
        </a>
      </div>
    </div>
  );
};

export default Error404Private;
