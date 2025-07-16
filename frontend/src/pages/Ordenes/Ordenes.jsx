// src/pages/Ordenes.jsx
import React from 'react';
import './Ordenes.css';

const ordenes = [
  { id: 1, fecha: '12/05/22', total: '$20.00', items: 4, estado: 'Terminado' },
  { id: 2, fecha: '12/05/22', total: '$20.00', items: 4, estado: 'En proceso' },
  { id: 3, fecha: '12/05/22', total: '$20.00', items: 4, estado: 'Terminado' },
  { id: 4, fecha: '12/05/22', total: '$20.00', items: 4, estado: 'En proceso' },
  { id: 5, fecha: '12/05/22', total: '$20.00', items: 4, estado: 'Terminado' },
  { id: 6, fecha: '12/05/22', total: '$20.00', items: 4, estado: 'En proceso' },
  { id: 7, fecha: '12/05/22', total: '$20.00', items: 4, estado: 'Terminado' },
];

const Ordenes = () => {
  return (
    <div className="ordenes-container">
      <h2>ORDENES</h2>
      <table className="ordenes-tabla">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Items</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden, index) => (
            <tr key={index}>
              <td>#{orden.id}</td>
              <td>{orden.fecha}</td>
              <td>{orden.total}</td>
              <td>{orden.items}</td>
              <td>{orden.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ordenes;
