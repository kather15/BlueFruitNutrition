import React, { useEffect, useState } from 'react';
import './Suscripcionees.css';

const Suscripciones = ({ usuarioId, nuevaSuscripcion }) => {
  const [suscripciones, setSuscripciones] = useState([]);

  const fetchSuscripciones = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/suscripcionees');
      const data = await res.json();
      setSuscripciones(data.filter(s => s.usuario === usuarioId));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSuscripciones();
  }, []);

  // Actualizar lista al agregar una nueva suscripción
  useEffect(() => {
    if (nuevaSuscripcion) {
      setSuscripciones(prev => [...prev, nuevaSuscripcion]);
    }
  }, [nuevaSuscripcion]);

  const handleEditar = (suscripcion) => {
    alert(`Editar suscripción de: ${suscripcion.usuario}`);
  };

  return (
    <div className="suscripciones-container">
      <h2>SUSCRIPCIONES</h2>
      <table className="suscripciones-tabla">
        <thead>
          <tr>
            <th>Suscripción</th>
            <th>Fecha de inicio</th>
            <th>Usuario</th>
            <th>Precio</th>
            <th>Plan de suscripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {suscripciones.map((s, i) => (
            <tr key={i}>
              <td>{s.suscripcionId}</td>
              <td>{new Date(s.fechaInicio).toLocaleDateString()}</td>
              <td>{s.usuario}</td>
              <td>${s.precio}</td>
              <td>{s.plan}</td>
              <td>{s.estado}</td>
              <td>
                <button className="btn-editar" onClick={() => handleEditar(s)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Suscripciones;
