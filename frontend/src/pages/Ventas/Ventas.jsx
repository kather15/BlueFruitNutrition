// src/pages/Ventas.jsx
import React, { useEffect, useState } from 'react';
import './Ventas.css';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);

  // Cargar las órdenes y filtrar solo las completadas
  const fetchVentas = async () => {
    try {
      const res = await fetch('https://bluefruitnutrition-production.up.railway.app/api/ordenes');
      const data = await res.json();

      // Filtrar las que tienen estado "Completada"
      const completadas = data.filter((orden) => orden.estado === 'Completada');
      setVentas(completadas);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  // Calcular estadísticas
  const totalVentas = ventas.reduce((sum, venta) => sum + (venta.total || 0), 0);
  const totalItems = ventas.reduce(
    (sum, venta) => sum + (Array.isArray(venta.items) ? venta.items.length : venta.items || 0),
    0
  );

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
            <tr key={venta._id || index}>
              <td>#{index + 1}</td>
              <td>
                {new Date(venta.fecha).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </td>
              <td>${venta.total?.toFixed(2)}</td>
              <td>{Array.isArray(venta.items) ? venta.items.length : venta.items || 0}</td>
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
