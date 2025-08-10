import React from 'react';
import './Sobrenosotros.css';


const SobreNosotros = () => {
  return (
    <div className="sobre-container">
      <section className="historia">
        <h2>Nuestra Historia</h2>
        <div className="historia-content">
          <div className="historia-text">
            <p>
              BlueFuel ha fusionado la ciencia deportiva con la innovación alimentaria
              para ofrecer productos diseñados para optimizar el rendimiento y la
              recuperación de los atletas.
            </p>
            <ul>
              <li>Productos naturales con ingredientes de alta calidad</li>
              <li>Diseñados para proporcionar energía rápida y sostenida</li>
              <li>Apoyados por evidencia científica</li>
              <li>Apoyo al rendimiento y bienestar del deportista</li>
            </ul>
          </div>
    <img src="/image 5.png" alt="Atleta" />
         </div>
      </section>

      <section className="estadisticas">
        <div className="card">
        <img src="/store 1.png" alt="Vendedores" className="img-white" /> 
          <h3>10.5k</h3>
          <p>Vendedores activos en nuestro sitio</p>
          </div>
        <div className="card">
    <img src="/image 58.png" alt="Venta mensual" className="img-white" />
          <h3>33k</h3>
          <p>Venta mensual de productos</p>
          </div>
        <div className="card">
          <img src="/globe 1.png" alt="Clientes" className="img-white"/>
          <h3>45.5k</h3>
          <p>Clientes activos en nuestro sitio</p>
          </div>
        <div className="card">
    <img src="/money-bag.png" alt="Venta anual" className="img-white" />
          <h3>25k</h3
          ><p>Venta anual en nuestro sitio</p>
          </div>
      </section>

      <section className="equipo">
        <h2>Nuestro Equipo</h2>
        <div className="miembros">
          <div className="miembro">
            <img src="/image 52.png" alt="Deportista 1" />
            <h4>Deportista #1</h4>
            <p>Atleta</p>
          </div>
          <div className="miembro">
            <img src="/image 53.png" alt="Deportista 2" />
            <h4>Deportista #2</h4>
            <p>Ciclismo</p>
          </div>
          <div className="miembro">
            <img src="/image 54.png" alt="Deportista 3" />
            <h4>Deportista #3</h4>
            <p>Competencia</p>
          </div>
          <div className="miembro">
            <img src="/image 55.png" alt="Deportista 4" />
            <h4>Deportista #4</h4>
            <p>Profesional</p>
          </div>
        </div>
      </section>

      <section className="iconos">
        <div className="icono">
          <img src="/Group 8.png" alt="Energia Sostenible" />
          <h2>Energía Sostenible</h2>
          <p>Libera energia de froma gradual 
            para un rendimiento constante</p>
        </div>
        <div className="icono">
           <img src="/Group 9.png" alt="Mejor Rendimiento" />
          <h2>Mejor Rendimiento</h2>
          <p>Favorece el uso de grasa como
            energía </p>
        </div>
        <div className="icono">
           <img src="/Group 10.png" alt="Salud Óptima" />
          <h2>Salud Óptima</h2>
          <p>No produce caries, seguro para 
            todas las edades </p>
        </div>
      </section>
    </div>
  );
};

export default SobreNosotros;
