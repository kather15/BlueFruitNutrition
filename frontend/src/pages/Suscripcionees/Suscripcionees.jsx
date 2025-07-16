import React from 'react';
import './Suscripcionees.css';

const suscripciones = [
  {
    id: '0001',
    fecha: '12/05/22',
    usuario: 'abcd@gmail.com',
    precio: '$19.99',
    plan: 'Unico',
    estado: 'Activo'
  },
  {
    id: '0002',
    fecha: '15/06/22',
    usuario: 'efgh@gmail.com',
    precio: '$9.99',
    plan: 'Mensual',
    estado: 'Inactivo'
  },
  {
    id: '0003',
    fecha: '18/07/22',
    usuario: 'ijkl@gmail.com',
    precio: '$29.99',
    plan: 'Anual',
    estado: 'Activo'
  },
];

const Suscripciones = () => {
  const handleEditar = (suscripcion) => {
    alert(`Editar suscripción de: ${suscripcion.usuario}`);
    // Aquí podés abrir un modal o redirigir a otro formulario
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
            <th>Acciones</th> {/* Nueva columna */}
          </tr>
        </thead>
        <tbody>
          {suscripciones.map((s, i) => (
            <tr key={i}>
              <td>{s.id}</td>
              <td>{s.fecha}</td>
              <td>{s.usuario}</td>
              <td>{s.precio}</td>
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
