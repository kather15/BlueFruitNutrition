import React from 'react';
import { motion } from 'framer-motion';
import './Sobrenosotros.css';

const SobreNosotros = () => {
  const historiaText = `Blue Fruit Nutrition® Es una compañía enfocada en investigar, formular y desarrollar productos funcionales para deportistas. Dentro de su manufactura brinda beneficios a partir de “carbohidratos saludables” garantizando una mayor productividad y potenciando así un alto rendimiento deportivo. Desarrollamos productos funcionales a base de carbohidratos saludables, especialmente Palatinose™, un carbohidrato de bajo índice glucémico que:`;

  const beneficios = [
    "Libera energía de forma prolongada.",
    "Mejora el metabolismo y el uso de grasas como energía.",
    "No produce caries.",
    "Es vegano y no transgénico."
  ];

  const estadisticas = [
    { img: "/store 1.png", valor: "10.5k", texto: "Vendedores activos en nuestro sitio" },
    { img: "/image 58.png", valor: "33k", texto: "Venta mensual de productos" },
    { img: "/globe 1.png", valor: "45.5k", texto: "Clientes activos en nuestro sitio" },
    { img: "/money-bag.png", valor: "25k", texto: "Venta anual en nuestro sitio" }
  ];

  const equipo = [
    { img: "/image 52.png", nombre: "Deportista #1", rol: "Atleta" },
    { img: "/image 53.png", nombre: "Deportista #2", rol: "Ciclismo" },
    { img: "/image 54.png", nombre: "Deportista #3", rol: "Competencia" },
    { img: "/image 55.png", nombre: "Deportista #4", rol: "Profesional" }
  ];

  const iconos = [
    { img: "/Group 8.png", titulo: "Energía Sostenible", texto: "Libera energía de forma gradual para un rendimiento constante" },
    { img: "/Group 9.png", titulo: "Mejor Rendimiento", texto: "Favorece el uso de grasa como energía" },
    { img: "/Group 10.png", titulo: "Salud Óptima", texto: "No produce caries, seguro para todas las edades" }
  ];

  // Variants para animaciones rápidas
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.4,
        ease: "easeOut"
      }
    }),
  };

  return (
    <div className="sobre-container">

      {/* Historia */}
      <motion.section className="historia" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={containerVariants}>
        <h2>Nuestra Historia</h2>
        <div className="historia-content">
          <motion.div className="historia-text" custom={1.2} variants={containerVariants}>
            <p>{historiaText}</p>
            <ul>
              {beneficios.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </motion.div>
          <motion.figure className="historia-img" custom={1.4} variants={containerVariants}>
            <img src="/image 5.png" alt="Atleta" />
          </motion.figure>
        </div>
      </motion.section>

      {/* Estadísticas */}
      <motion.section className="estadisticas" initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {estadisticas.map((item, idx) => (
          <motion.div
            className="card"
            key={idx}
            custom={idx + 2}
            variants={containerVariants}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <img src={item.img} alt={item.texto} />
            <h3>{item.valor}</h3>
            <p>{item.texto}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Equipo */}
      <motion.section className="equipo" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={6} variants={containerVariants}>
        <h2>Nuestro Equipo</h2>
        <div className="miembros">
          {equipo.map((persona, idx) => (
            <motion.div
              className="miembro"
              key={idx}
              custom={idx + 6.1}
              variants={containerVariants}
              whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
            >
              <img src={persona.img} alt={persona.nombre} />
              <h4>{persona.nombre}</h4>
              <p>{persona.rol}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Iconos */}
      <motion.section className="iconos" initial="hidden" whileInView="visible" viewport={{ once: true }} custom={10} variants={containerVariants}>
        {iconos.map((icono, idx) => (
          <motion.div
            className="icono"
            key={idx}
            custom={idx + 10.1}
            variants={containerVariants}
            whileHover={{ scale: 1.08, y: -4, transition: { duration: 0.25 } }}
          >
            <img src={icono.img} alt={icono.titulo} />
            <h2>{icono.titulo}</h2>
            <p>{icono.texto}</p>
          </motion.div>
        ))}
      </motion.section>

    </div>
  );
};

export default SobreNosotros;
