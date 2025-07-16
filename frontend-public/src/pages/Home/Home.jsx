import React, { useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom'


const productos = [
  { nombre: 'Carbo Upp', imagen: '/CarboUpp.png' },
  { nombre: 'Ener Kik', imagen: '/EnerKik.png' },
  { nombre: 'Reppo', imagen: '/Reppo.png' },
  { nombre: 'Ener Balance', imagen: '/EnerBalance.png' },
];

const Home = () => {
  const [productoActivo, setProductoActivo] = useState(null);

  return (
    <div className="blue-fruit-home">
      {/* Imagen principal */}
      <div className="blue-fruit-banner-container">
        <img src="/PantallaPrincipal.png" alt="Banner Blue Fruit" className="blue-fruit-banner-image" />
      </div>

      {/* Separador debajo de la imagen */}
      <div className="blue-fruit-separador">Nuestros Productos</div>

      <h1>Explora Nuestros Productos</h1>

      <div className="blue-fruit-productos-scroll">
        {productos.map((producto, index) => (
          <div className="blue-fruit-product" key={index}>
            <div
              className="blue-fruit-image-container"
              onMouseEnter={() => setProductoActivo(index)}
              onMouseLeave={() => setProductoActivo(null)}
            >
              <img src={producto.imagen} alt={producto.nombre} />
              {productoActivo === index && (
                <div className="blue-fruit-overlay">Agregar al carrito</div>
              )}
            </div>
            <p>{producto.nombre}</p>
          </div>
        ))}
      </div>

     <div className="blue-fruit-boton-ver-todos-container">
  <Link to="/product" className="blue-fruit-boton-ver-todos">
    Ver todos los Productos
  </Link>
</div>
      {/* Línea separadora debajo del botón */}
      <hr className="blue-fruit-linea-separadora" />

      {/* Sección Historia */}
      <section className="blue-fruit-historia">
        <h2>Nuestra Historia</h2>
        <div className="blue-fruit-historia-content">
          <div className="blue-fruit-historia-text">
            <p>BlueFuel ha fusionado la ciencia deportiva con la innovación alimentaria para ofrecer productos diseñados para optimizar el rendimiento y la recuperación de los atletas.</p>
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

      <hr className="blue-fruit-linea-separadora" />

      {/* Sección Iconos */}
      <section className="blue-fruit-iconos">
        <div className="blue-fruit-icono">
          <img src="/Group 8.png" alt="Icono Energía Sostenible" />
          <h2>Energía Sostenible</h2>
          <p>Libera energía de forma gradual para un rendimiento constante.</p>
        </div>
        
        <div className="blue-fruit-icono">
          <img src="/Group 9.png" alt="Icono Mejor Rendimiento" />
          <h2>Mejor Rendimiento</h2>
          <p>Maximiza la eficiencia y capacidad física.</p>
        </div>
        
        <div className="blue-fruit-icono">
          <img src="/Group 10.png" alt="Icono Salud Óptima" />
          <h2>Salud Óptima</h2>
          <p>No produce caries, seguro para todas las edades.</p>
        </div>
      </section>

      <hr className="blue-fruit-linea-separadora" />

      {/* Sección Nuestro Equipo */}
      <section className="blue-fruit-equipo">
        <h2>Nuestro Equipo</h2>
        <div className="blue-fruit-miembros">
          <div className="blue-fruit-miembro">
            <img src="/image 52.png" alt="Deportista 1" />
            <h4>Deportista #1</h4>
            <p>Atleta</p>
          </div>
          <div className="blue-fruit-miembro">
            <img src="/image 53.png" alt="Deportista 2" />
            <h4>Deportista #2</h4>
            <p>Ciclismo</p>
          </div>
          <div className="blue-fruit-miembro">
            <img src="/image 54.png" alt="Deportista 3" />
            <h4>Deportista #3</h4>
            <p>Competencia</p>
          </div>
          <div className="blue-fruit-miembro">
            <img src="/image 55.png" alt="Deportista 4" />
            <h4>Deportista #4</h4>
            <p>Profesional</p>
          </div>
        </div>
      </section>

      <hr className="blue-fruit-linea-separadora" />

      <main>
        <section className="blue-fruit-contact-section">
          <div className="blue-fruit-contact-wrapper">
            <div className="blue-fruit-contact-info">
              <h2>Contáctanos</h2>
              <h3>Llámanos</h3>
              <p>Estamos disponibles 24 horas al día, 7 días a la semana.</p>
              <p>Celular: +503 6859 7103</p>

              <hr />

              <h3>Escríbenos</h3>
              <p>Llena nuestro formulario y nos pondremos en contacto contigo en 24 horas.</p>
              <p>Email: info@blueletrunutrition.com</p>
            </div>

            <div className="blue-fruit-contact-form">
              <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Tu Nombre*" required />
                <input type="email" placeholder="Tu Email*" required />
                <input type="tel" placeholder="Tu Celular*" required />
                <textarea placeholder="Tu mensaje" rows="5" required></textarea>
                <button type="submit">Enviar Mensaje</button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;