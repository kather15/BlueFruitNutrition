import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/useAuth';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // Mostrar toast solo una vez cuando se detecta que no está autenticado
  useEffect(() => {
    if (!loading && !user?.isAuthenticated) {
      toast.error("Debes iniciar sesión para acceder a esta página");
    }
  }, [loading, user]);

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

  if (!user?.isAuthenticated) {
    // Aquí ya no llamamos toast, solo hacemos la redirección
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
