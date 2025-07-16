import React from "react";
import { useNavigate, Link } from 'react-router-dom';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="blue-fruit-footer">
      
      {/* Parte superior del footer dividida en varias secciones */}
      <div className="blue-fruit-footer-top">
        
        {/* Sección con el logo, suscripción por correo y texto de promoción */}
        <div className="blue-fruit-footer-section blue-fruit-logo-section">
          {/* Imagen del logo */}
          <img src="/Logo_Blue_Fruit.png" alt="Logo Blue Fruit" className="blue-fruit-footer-logo" />
          
          {/* Título de la sección de suscripción */}
          <p className="blue-fruit-subscribe-title">Suscribite</p>
          
          {/* Texto promocional para invitar a la suscripción */}
          <p className="blue-fruit-subscribe-text">
            Obten un 10% de descuento<br />en tu primer pedido
          </p>
          
          {/* Campo de entrada de correo y botón para enviar */}
          <div className="blue-fruit-subscribe-input">
            <input type="email" placeholder="Introduce tu correo" />
            <button>{">"}</button> {/* Botón con símbolo de "enviar" */}
          </div>
        </div>

        {/* Sección con información de contacto */}
        <div className="blue-fruit-footer-section">
          <h4>Soporte</h4>
          <p>info@bluefruitnutrition.com</p>
          <p>+503 6859 7103</p>
        </div>

        {/* Sección de cuenta */}
      <div className="blue-fruit-footer-section">
        <h4>Cuenta</h4>
        <p>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Iniciar sesión</Link>
           <Link to="/registro"style={{ color: 'white', textDecoration: 'none' }}> Registrarse</Link>
        </p>
      </div>

      {/* Sección de enlaces rápidos */}
      <div className="blue-fruit-footer-section">
        <h4>Enlaces rápidos</h4>
        <p>
          <Link to="/contact"style={{ color: 'white', textDecoration: 'none' }}>Contacto</Link>
        </p>
      </div>
      </div>

      {/* Parte inferior del footer con derechos de autor */}
      <div className="blue-fruit-footer-bottom">
        <p>© Copyright 2025 – <strong>BLUE FRUIT NUTRITION®</strong> Alimentos Funcionales para Deportistas</p>
      </div>
    </footer>
  );
};

export default Footer;