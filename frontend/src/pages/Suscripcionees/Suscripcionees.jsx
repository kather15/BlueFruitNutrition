import React, { useEffect, useState } from 'react';
import './Suscripcionees.css';

const Suscripcionees = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuscripciones = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/api/suscripciones');
      
      if (!res.ok) {
        throw new Error('Error al obtener suscripciones');
      }
      
      const data = await res.json();
      console.log('Suscripciones obtenidas:', data);
      setSuscripciones(data);
    } catch (error) {
      console.error('Error al cargar suscripciones:', error);
      alert('Error al cargar las suscripciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuscripciones();
    
    // Refrescar cada 30 segundos para mostrar nuevas suscripciones
    const interval = setInterval(fetchSuscripciones, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const cambiarEstado = async (suscripcionId, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:4000/api/suscripciones/${suscripcionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!res.ok) {
        throw new Error('Error al actualizar estado');
      }

      // Actualizar localmente
      setSuscripciones(prev => 
        prev.map(sub => 
          sub.suscripcionId === suscripcionId 
            ? { ...sub, estado: nuevoEstado } 
            : sub
        )
      );

      alert(`Estado cambiado a: ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al cambiar el estado');
    }
  };

  const eliminarSuscripcion = async (suscripcionId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta suscripción?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/suscripciones/${suscripcionId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Error al eliminar suscripción');
      }

      // Actualizar localmente
      setSuscripciones(prev => 
        prev.filter(sub => sub.suscripcionId !== suscripcionId)
      );

      alert('Suscripción eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar suscripción:', error);
      alert('Error al eliminar la suscripción');
    }
  };

  const handleEditar = (suscripcion) => {
    // Aquí puedes implementar un modal de edición o redirigir
    const nuevoUsuario = prompt('Nuevo usuario (email):', suscripcion.usuario);
    if (nuevoUsuario && nuevoUsuario !== suscripcion.usuario) {
      editarSuscripcion(suscripcion.suscripcionId, { usuario: nuevoUsuario });
    }
  };

  const editarSuscripcion = async (suscripcionId, cambios) => {
    try {
      const res = await fetch(`http://localhost:4000/api/suscripciones/${suscripcionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cambios)
      });

      if (!res.ok) {
        throw new Error('Error al editar suscripción');
      }

      const suscripcionActualizada = await res.json();
      
      // Actualizar localmente
      setSuscripciones(prev => 
        prev.map(sub => 
          sub.suscripcionId === suscripcionId 
            ? { ...sub, ...suscripcionActualizada } 
            : sub
        )
      );

      alert('Suscripción actualizada correctamente');
    } catch (error) {
      console.error('Error al editar suscripción:', error);
      alert('Error al editar la suscripción');
    }
  };

  const refrescarDatos = () => {
    fetchSuscripciones();
  };

  if (loading) {
    return (
      <div className="suscripciones-container">
        <div className="loading-message">Cargando suscripciones...</div>
      </div>
    );
  }

  return (
    <div className="suscripciones-container">
      <div className="header-section">
        <h2>SUSCRIPCIONES</h2>
        <div className="header-actions">
          <span className="total-suscripciones">
            Total: {suscripciones.length} suscripciones
          </span>
          <button className="btn-refrescar" onClick={refrescarDatos}>
            🔄 Refrescar
          </button>
        </div>
      </div>

      {suscripciones.length === 0 ? (
        <div className="no-data-message">
          <p>No hay suscripciones registradas aún.</p>
          <p>Las suscripciones aparecerán aquí cuando los usuarios se suscriban desde el sitio público.</p>
        </div>
      ) : (
        <div className="tabla-container">
          <table className="suscripciones-tabla">
            <thead>
              <tr>
                <th>ID Suscripción</th>
                <th>Fecha de inicio</th>
                <th>Usuario</th>
                <th>Precio</th>
                <th>Plan</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {suscripciones.map((s) => (
                <tr key={s.suscripcionId || s._id}>
                  <td>#{s.suscripcionId}</td>
                  <td>
                    {new Date(s.fechaInicio).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </td>
                  <td>{s.usuario}</td>
                  <td>${s.precio}</td>
                  <td>
                    <span className="plan-badge">{s.plan}</span>
                  </td>
                  <td>
                    <span className={`estado-badge ${s.estado.toLowerCase()}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td>
                    <div className="acciones-container">
                      <button 
                        className="btn-editar"
                        onClick={() => handleEditar(s)}
                        title="Editar suscripción"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className={`btn-estado ${s.estado === 'Activo' ? 'desactivar' : 'activar'}`}
                        onClick={() => cambiarEstado(s.suscripcionId, s.estado === 'Activo' ? 'Inactivo' : 'Activo')}
                        title={s.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                      >
                        {s.estado === 'Activo' ? '❌ Desactivar' : '✅ Activar'}
                      </button>
                      <button 
                        className="btn-eliminar"
                        onClick={() => eliminarSuscripcion(s.suscripcionId)}
                        title="Eliminar suscripción"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="estadisticas-section">
        <div className="estadistica">
          <span className="estadistica-numero">
            {suscripciones.filter(s => s.estado === 'Activo').length}
          </span>
          <span className="estadistica-label">Activas</span>
        </div>
        <div className="estadistica">
          <span className="estadistica-numero">
            {suscripciones.filter(s => s.estado === 'Inactivo').length}
          </span>
          <span className="estadistica-label">Inactivas</span>
        </div>
        <div className="estadistica">
          <span className="estadistica-numero">
            ${suscripciones.reduce((total, s) => s.estado === 'Activo' ? total + parseFloat(s.precio) : total, 0).toFixed(2)}
          </span>
          <span className="estadistica-label">Ingresos/mes</span>
        </div>
      </div>
    </div>
  );
};

export default Suscripcionees;