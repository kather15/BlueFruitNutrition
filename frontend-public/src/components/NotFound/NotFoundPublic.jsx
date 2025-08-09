import React from "react";
import "./NotFoundPublic.css";

const Error404Public = () => {
  return (
    <div className="error404-public-container">
      <h1 className="error404-public-title">404</h1>
      <h2 className="error404-public-subtitle">Página no encontrada</h2>
      <p className="error404-public-text">
        Lo sentimos, la página que buscas no existe.
      </p>
        <img src="/MoraConfundida.png" alt="Mora confundida" className="error404-public-image" />

      <a href="/" className="error404-public-button">
        Volver al inicio
      </a>
    </div>
  );
};

export default Error404Public;
