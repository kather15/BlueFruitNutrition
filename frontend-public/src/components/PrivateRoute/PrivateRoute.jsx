import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthContext } from '../../context/useAuth';

function RutaPrivada({ children }) {
  const { user, loading, isAuthenticated } = useAuthContext();
  const location = useLocation();
  const hasShownToast = useRef(false); // Para evitar múltiples toasts

  // Debug temporal (puedes quitarlo después)
  console.log('Debug PrivateRoute:');
  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('Is Authenticated:', isAuthenticated);

  // Mover el toast a useEffect para evitar el error de React
  useEffect(() => {
    if (!loading && !isAuthenticated && location.pathname !== '/login' && !hasShownToast.current) {
      toast.error("Debes iniciar sesión para acceder a esta página");
      hasShownToast.current = true;
    }
    
    // Reset el flag cuando el usuario se autentique o cambie de página
    if (isAuthenticated || location.pathname === '/login') {
      hasShownToast.current = false;
    }
  }, [isAuthenticated, loading, location.pathname]);

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

  // Si no está autenticado, redirigir sin mostrar toast aquí
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RutaPrivada;