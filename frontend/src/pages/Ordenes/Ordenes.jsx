import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Ordenes.css';

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const navigate = useNavigate();

  const fetchOrdenes = async () => {
    try {
      const res = await axios.get('https://bluefruitnutrition-production.up.railway.app/api/ordenes'); 
      setOrdenes(res.data);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  const eliminarOrden = async (id) => {
    try {
      await axios.delete(`https://bluefruitnutrition-production.up.railway.app/api/ordenes/${id}`);
      fetchOrdenes();
    } catch (error) {
      console.error('Error al eliminar orden:', error);
    }
  };

  return (
    <div className="ordenes-container">
      <h2>ÓRDENES</h2>
      <table className="ordenes-tabla">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Items</th>
            <th>Estado</th>
            <th>   </th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((orden, index) => (
            <tr key={orden._id || index}>
              <td>#{index + 1}</td>
              <td>
                {new Date(orden.fecha).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </td>
              <td>${orden.total.toFixed(2)}</td>
              <td>{Array.isArray(orden.items) ? orden.items.length : orden.items || 0}</td>
              <td>{orden.estado}</td>
              <td>
                <button
                  className="btn-accion"
                  onClick={() => eliminarOrden(orden._id)}
                >
                  Eliminar
                </button>
                <button
                  className="btn-accion"
                  onClick={() => navigate(`/ordenes/${orden._id}`)}
                >
                  Resumen de Orden
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ordenes;
