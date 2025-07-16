import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section logo-section">
          <img src="/Logo_Blue_Fruit.png" alt="Logo Blue Fruit" className="footer-logo" />
          <p className="subscribe-title">Suscribite</p>
          <p className="subscribe-text">Obten un 10% de descuento<br />en tu primer pedido</p>
          <div className="subscribe-input">
            <input type="email" placeholder="Introduce tu correo" />
            <button>{">"}</button>
          </div>
        </div>

        <div className="footer-section">
          <h4>Soporte</h4>
          <p>info@bluefruitnutrition.com</p>
          <p>+503 6859 7103</p>
        </div>

        <div className="footer-section">
          <h4>Cuenta</h4>
          <p>Iniciar sesión / Registrarse</p>
        </div>

        <div className="footer-section">
          <h4>Enlaces rápido</h4>
          <p>Contacto</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© Copyright 2025 – <strong>BLUE FRUIT NUTRITION®</strong> Alimentos Funcionales para Deportistas</p>
      </div>
    </footer>
  );
};

export default Footer;
