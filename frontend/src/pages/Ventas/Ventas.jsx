// src/pages/Ventas.jsx
import React from 'react';
import './Ventas.css';

const ventas = [
  { id: 1, fecha: '15/07/25', total: '$45.00', items: 3, estado: 'Finalizado' },
  { id: 2, fecha: '14/07/25', total: '$32.50', items: 2, estado: 'Finalizado' },
  { id: 3, fecha: '14/07/25', total: '$68.75', items: 5, estado: 'Finalizado' },
  { id: 4, fecha: '13/07/25', total: '$25.00', items: 2, estado: 'Finalizado' },
  { id: 5, fecha: '13/07/25', total: '$89.25', items: 6, estado: 'Finalizado' },
  { id: 6, fecha: '12/07/25', total: '$37.50', items: 3, estado: 'Finalizado' },
  { id: 7, fecha: '12/07/25', total: '$54.00', items: 4, estado: 'Finalizado' },
  { id: 8, fecha: '11/07/25', total: '$28.75', items: 2, estado: 'Finalizado' },
  { id: 9, fecha: '11/07/25', total: '$76.50', items: 5, estado: 'Finalizado' },
  { id: 10, fecha: '10/07/25', total: '$42.25', items: 3, estado: 'Finalizado' },
];

const Ventas = () => {
  // Calcular estadísticas
  const totalVentas = ventas.reduce((sum, venta) => sum + parseFloat(venta.total.replace('$', '')), 0);
  const totalItems = ventas.reduce((sum, venta) => sum + venta.items, 0);

  return (
    <div className="ventas-container">
      <h2>VENTAS</h2>
      
      {/* Estadísticas resumidas */}
      <div className="ventas-estadisticas">
        <div className="estadistica-card">
          <h3>Total Ventas</h3>
          <p>${totalVentas.toFixed(2)}</p>
        </div>
        <div className="estadistica-card">
          <h3>Total Órdenes</h3>
          <p>{ventas.length}</p>
        </div>
        <div className="estadistica-card">
          <h3>Total Items</h3>
          <p>{totalItems}</p>
        </div>
      </div>

      <table className="ventas-tabla">
        <thead>
          <tr>
            <th>Venta</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Items</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta, index) => (
            <tr key={index}>
              <td>#{venta.id}</td>
              <td>{venta.fecha}</td>
              <td>{venta.total}</td>
              <td>{venta.items}</td>
              <td>
                <span className="estado-finalizado">{venta.estado}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;