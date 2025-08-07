import React from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/useAuth';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f8fa',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '3rem 4rem',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            marginBottom: '1rem',
            fontSize: '1.5rem',
            color: '#0C133F'
          }}>
            🔐
          </div>
          <h3 style={{ 
            color: '#0C133F', 
            marginBottom: '0.5rem',
            fontSize: '1.2rem'
          }}>
            Verificando permisos
          </h3>
          <p style={{ 
            color: '#6b7280',
            margin: 0,
            fontSize: '1rem'
          }}>
            Validando credenciales de administrador...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    toast.error("Acceso denegado. Se requieren permisos de administrador.");
    // Redirigir al login público
    window.location.href = 'http://localhost:3000/login';
    return null;
  }

  return children;
}

export default ProtectedRoute;
