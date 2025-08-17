import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/useAuth';

// Nombre cambiado para coincidir con el import en App.jsx
function RutaPrivada({ children }) {
  const { user, loading, isAuthenticated } = useAuthContext();
  const location = useLocation();

  // Debug temporal (puedes quitarlo después)
  console.log(' Debug PrivateRoute:');
  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('Is Authenticated:', isAuthenticated);

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem 3rem',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          Verificando sesión...
        </div>
      </div>
    );
  }

  // Usar tu lógica existente de isAuthenticated del contexto
  if (!isAuthenticated) {
    // Solo mostrar toast si no estamos ya en la página de login
    if (location.pathname !== '/login') {
      toast.error("Debes iniciar sesión para acceder a esta página");
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RutaPrivada;