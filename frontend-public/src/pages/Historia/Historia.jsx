import React from 'react';
import './Historia.css';
import atleta from './frontend-public/image 5.png';
import deportista1 from './frontend-public/public/image 52.png';
import deportista2 from './frontend-public/public/image 53.png';
import deportista3 from './frontend-public/public/image 54.png';
import deportista4 from './frontend-public/public/image 55.png';

const SobreNosotros = () => {
  return (
    <div className="sobre-container">
      <section className="historia">
        <h2>Nuestra Historia</h2>
        <div className="historia-content">
          <div className="historia-text">
            <p>BlueFuel ha fusionado la ciencia deportiva con la innovación alimentaria para ofrecer productos diseñados para optimizar el rendimiento y la recuperación de los atletas.</p>
            <ul>
              <li>Productos naturales con ingredientes de alta calidad</li>
              <li>Diseñados para proporcionar energía rápida y sostenida</li>
              <li>Apoyados por evidencia científica</li>
              <li>Apoyo al rendimiento y bienestar del deportista</li>
            </ul>
          </div>
          <img src={atleta} alt="Atleta" />
        </div>
      </section>

      <section className="estadisticas">
        <div className="card"><h3>10.5k</h3><p>Ventas en línea</p></div>
        <div className="card principal"><h3>33k</h3><p>Nuestros seguidores</p></div>
        <div className="card"><h3>45.5k</h3><p>Clientes felices</p></div>
        <div className="card"><h3>25k</h3><p>Ventas en el mundo</p></div>
      </section>

      <section className="equipo">
        <h2>Nuestro Equipo</h2>
        <div className="miembros">
          <div className="miembro">
            <img src={deportista1} alt="Deportista 1" />
            <h4>Deportista #1</h4>
            <p>Atleta</p>
          </div>
          <div className="miembro">
            <img src={deportista2} alt="Deportista 2" />
            <h4>Deportista #2</h4>
            <p>Ciclismo</p>
          </div>
          <div className="miembro">
            <img src={deportista3} alt="Deportista 3" />
            <h4>Deportista #3</h4>
            <p>Competencia</p>
          </div>
          <div className="miembro">
            <img src={deportista4} alt="Deportista 4" />
            <h4>Deportista #4</h4>
            <p>Profesional</p>
          </div>
        </div>
      </section>

      <section className="iconos">
        <div className="icono">
          <i className="fa-solid fa-seedling"></i>
          <p>Energía Sostenible</p>
        </div>
        <div className="icono">
          <i className="fa-solid fa-bolt"></i>
          <p>Mejor Rendimiento</p>
        </div>
        <div className="icono">
          <i className="fa-solid fa-heart"></i>
          <p>Salud Óptima</p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Blue Fruit</h3>
            <p>Obtenga un 10% de descuento en su primer pedido</p>
            <input type="email" placeholder="Introduce tu correo" />
          </div>
          <div className="footer-section">
            <h4>Soporte</h4>
            <p>info@bluefruitnutrition.com</p>
            <p>+503 8589 7103</p>
          </div>
          <div className="footer-section">
            <h4>Cuenta</h4>
            <p>Mi cuenta</p>
            <p>Iniciar sesión / Registrarse</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces rápido</h4>
            <p>Política de Privacidad</p>
            <p>Condiciones de uso</p>
            <p>FAQ</p>
            <p>Contacto</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© Copyright 2025 – BLUE FRUIT NUTRITION™ Alimentos Funcionales para Deportistas</p>
        </div>
      </footer>
    </div>
  );
};

export default SobreNosotros;
