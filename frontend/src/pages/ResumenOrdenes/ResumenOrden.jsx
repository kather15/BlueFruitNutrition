import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ResumenOrden.css';

const estadosPosibles = ['Pendiente', 'En proceso', 'Completada', 'Cancelada'];

const ResumenOrden = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orden, setOrden] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [exitoGuardar, setExitoGuardar] = useState(null);

  useEffect(() => {
    const fetchOrden = async () => {
      try {
        const res = await fetch(`https://bluefruitnutrition1.onrender.com/api/ordenes/${id}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        console.log('Orden cargada:', data);
        setOrden(data);
        setNuevoEstado(data.estado);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error al cargar la orden.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrden();
  }, [id]);

  const handleEstadoChange = (e) => {
    setNuevoEstado(e.target.value);
    setErrorGuardar(null);
    setExitoGuardar(null);
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setErrorGuardar(null);
    setExitoGuardar(null);

    try {
      console.log('Intentando actualizar estado a:', nuevoEstado);
      const res = await fetch(`https://bluefruitnutrition1.onrender.com/api/ordenes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(JSON.stringify(errorData));
      }

      setOrden(prev => ({ ...prev, estado: nuevoEstado }));
      setExitoGuardar('Estado actualizado con éxito');

      // Redirigir si el estado es "Completada"
      if (nuevoEstado === 'Completada') {
        navigate('/ventas');
      }
    } catch (err) {
      console.error(err);
      setErrorGuardar(`Error: ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="resumen-container">
      <div className="resumen-card">
        <h2>Resumen de Orden #{orden.numeroOrden || orden._id}</h2>
        <p><strong>Fecha:</strong> {orden.fecha}</p>
        <p><strong>Total:</strong> ${orden.total.toFixed(2)}</p>
        <p><strong>Cantidad de items:</strong> {Array.isArray(orden.items) ? orden.items.length : orden.items || 0}</p>

        <p><strong>Estado actual:</strong> {orden.estado}</p>

        <div className="estado-container">
          <label htmlFor="estado"><strong>Cambiar estado:</strong> </label>
          <select
            id="estado"
            value={nuevoEstado}
            onChange={handleEstadoChange}
            disabled={guardando}
          >
            {estadosPosibles.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
        </div>

        {guardando && <p style={{ color: 'blue' }}>Guardando...</p>}
        {exitoGuardar && <p style={{ color: 'green' }}>{exitoGuardar}</p>}
        {errorGuardar && <p style={{ color: 'red' }}>{errorGuardar}</p>}

        <h3>Productos</h3>
        {Array.isArray(orden.productos) && orden.productos.length > 0 ? (
          <ul className="productos-lista">
            {orden.productos.map((producto, i) => (
              <li key={i} className="producto-item">
                <span>{producto.nombre}</span> — 
                <span>{producto.cantidad} x ${producto.precio.toFixed(2)}</span>
                <span className="producto-total">
                  = ${(producto.precio * producto.cantidad).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay productos en esta orden</p>
        )}

        <div className="botones">
          <button onClick={handleGuardar} className="btn-guardar" disabled={guardando}>
            Guardar Cambios
          </button>
          <button onClick={() => navigate('/ordenes')} className="btn-volver" disabled={guardando}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumenOrden;
