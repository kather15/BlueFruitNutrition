// src/pages/Ordenes.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ordenes.css';

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/ordenes'); // Asegúrate que esta sea tu URL real
        setOrdenes(res.data);
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
      }
    };

    fetchOrdenes();
  }, []);

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
            <tr key={orden._id || index}>
              <td>#{index + 1}</td>
              <td>{orden.fecha}</td>
              <td>${orden.total.toFixed(2)}</td>
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
