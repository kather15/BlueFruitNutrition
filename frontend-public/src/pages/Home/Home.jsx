import React, { useState, useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Contacto from '../../components/Contact/Contact';
import { FaWhatsapp } from 'react-icons/fa';
import Maps from "../../components/Maps/Maps"


const Home = () => {
  const [productoActivo, setProductoActivo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const productos = [
    { nombre: 'Carbo Upp', imagen: '/CarboUpp.png',  frase: "¡Corre hacia tus sueños!" },
    { nombre: 'Ener Kik', imagen: '/EnerKik.png' ,  frase: "¡Nunca te rindas!"},
    { nombre: 'Reppo', imagen: '/Reppo.png',  frase: "¡Tu tienes el control de tu meta!" },
    { nombre: 'Ener Balance', imagen: '/EnerBalance.png' ,  frase: "¡Cuida de tu salud!"},
  ];

  const [productosFlip, setProductosFlip] = useState({});

  const toggleFlip = (index) => {
    setProductosFlip((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    console.log("Formulario enviado:", data);
    alert("¡Mensaje enviado con éxito!");
    reset();
  };

  return (
    <div className="blue-fruit-home">
      {!isMobile && (
        <div className="blue-fruit-banner-container">
          <img 
            src="/Portada-home-feel-the-energy-blue-fruit.jpg" 
            alt="Banner Blue Fruit" 
            className="blue-fruit-banner-image" 
          />
        </div>
      )}

    <h1>Nuestros Productos Estrella</h1>

      <div className="blue-fruit-productos-scroll">
        {productos.map((producto, index) => (
          <div
            className={`blue-fruit-product ${productosFlip[index] ? "flipped" : ""}`}
            key={index}
            onClick={() => toggleFlip(index)}
          >
            <div className="blue-fruit-card-inner">
              {/* Front */}
              <div className="blue-fruit-card-front">
                <div className="blue-fruit-image-container">
                  <img src={producto.imagen} alt={producto.nombre} />
                </div>
                <p>{producto.nombre}</p>
              </div>

              {/* Back */}
              <div className="blue-fruit-card-back">
                <h3>{producto.frase}</h3>
              </div>
            </div>
          </div>
  ))}
</div>


      <div className="blue-fruit-boton-ver-todos-container">
        <Link to="/product" className="blue-fruit-boton-ver-todos">
          Ver todos los Productos
        </Link>
      </div>

      <hr className="blue-fruit-linea-separadora" />

      <section className="blue-fruit-historia">
        <h2>Nuestra Historia</h2>
        <div className="blue-fruit-historia-content">
          <div className="blue-fruit-historia-text">
            <p>BlueFruitNutrition ha fusionado la ciencia deportiva con la innovación alimentaria para ofrecer productos diseñados para optimizar el rendimiento y la recuperación de los atletas.</p>
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

      <section className="blue-fruit-iconos">
        <div className="blue-fruit-icono">
          <img src="/Group 8.png" alt="Energía Sostenible" />
          <h2>Energía Sostenible</h2>
          <p>Libera energía de forma gradual para un rendimiento constante.</p>
        </div>
        <div className="blue-fruit-icono">
          <img src="/Group 9.png" alt="Mejor Rendimiento" />
          <h2>Mejor Rendimiento</h2>
          <p>Maximiza la eficiencia y capacidad física.</p>
        </div>
        <div className="blue-fruit-icono">
          <img src="/Group 10.png" alt="Salud Óptima" />
          <h2>Salud Óptima</h2>
          <p>No produce caries, seguro para todas las edades.</p>
        </div>
      </section>

      <hr className="blue-fruit-linea-separadora" />

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
        <Contacto />
      </main>
      <hr className="blue-fruit-linea-separadora" />
      <Maps/>

{/* Botón de WhatsApp fijo con React Icon */}
<a
  href="https://wa.me/68597103" // reemplaza con tu número de WhatsApp
  target="_blank"
  rel="noopener noreferrer"
  className="blue-fruit-whatsapp-button"
>
  <FaWhatsapp size={28} />
  <span>Contáctanos</span>
</a>

<hr className="blue-fruit-linea-separadora" />

    

     <section className="blue-fruit-historia">
        <h2>¡Proximamente! 
       ENER GUMMIES. (Gomitas energéticas)®</h2>
        <div className="blue-fruit-historia-content">
          <div className="blue-fruit-historia-text">
            <h3>Ener Gummies.</h3> <p>Gomitas solidas energéticas a
            base de Palatinose, suministro sostenido energético,
            sin azúcar añadido. Proporcionan y refilan las reservas
            energéticas evitando la debilidad y la fatiga física.
            Apto para jóvenes y adultos que practican una
            actividad física. Ideal para seccionar la porción y el
            aporte energético.
            Ideal para repartir en porciones los 30g de aporte
            energético equivalente a un Gel.
            Disponible en sabores: Banano, Maracuyá, Naranja y
           Ponche de Frutas</p>
           <h3>Ener Gummies Kids.</h3> <p>Gomitas solidas energéticas a base de Palatinose, de
           sabores tropicales que brindarán energía sostenida.
           Únicas gomitas no cario génicas (no produce caries), sin azúcar añadido. Proporcionan
           energía saludable evitando la debilidad y la fatiga física al momento de las prácticas
           deportivas. Apto para todas las edades en niños. Contiene 50mg de Vitamina C
           Disponible en sabores: Banano, Maracuyá, Naranja y Ponche de Frutas</p>
          </div>
          <img src="/EnerGummies.png" alt="Ener Gummies" className="ener-image" />
        </div>
      </section>


    </div>

    
  );
};

export default Home;
