import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Context
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar autenticación de admin al cargar la app
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/verify-admin', {
          credentials: 'include' // Para cookies de sesión
        });
        
        if (response.ok) {
          const userData = await response.json();
          if (userData.role === 'admin') {
            setUser(userData);
          } else {
            // No es admin, redirigir al login público
            window.location.href = 'http://localhost:4000/login';
          }
        } else {
          // No autenticado o error
          console.log('Admin no autenticado');
        }
      } catch (error) {
        console.error('Error verificando autenticación admin:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
    
    setUser(null);
    // Redirigir al login público
    window.location.href = 'http://localhost:3000/login';
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user && user.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
};

// Hook principal para admin
const useAuth = () => {
  const navigate = useNavigate();
  const { login: contextLogin, logout: contextLogout } = useAuthContext();

  const login = async (data) => {
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include' // Importante para sesiones de admin
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Credenciales inválidas");

      // Verificar que sea admin
      if (result.role !== 'admin') {
        throw new Error("Acceso denegado. Se requieren permisos de administrador.");
      }

      // Admin autenticado correctamente
      contextLogin(result.user || result);
      
      toast.success("Sesión de administrador iniciada");
      navigate("/home");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    contextLogout();
    toast.success("Sesión de administrador cerrada");
  };

  return { login, logout };
};

export default useAuth;
