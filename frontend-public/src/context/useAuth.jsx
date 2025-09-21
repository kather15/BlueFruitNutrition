import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ URL base de la API
  const API_URL = "https://bluefruitnutrition1.onrender.com/api";

  // Verificar sesión al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/session/auth/session`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || data); // Maneja ambos formatos
          setIsAuthenticated(true);
          console.log('✅ Sesión verificada con backend:', data);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log('❌ No hay sesión activa');
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/session/auth/session`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user || data);
        setIsAuthenticated(true);
        console.log('🔍 Sesión confirmada:', data);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('❌ No hay sesión activa');
      }
    } catch (error) {
      console.error('Error en checkSession:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user && data.user.id) {
          setUser(data.user);
          setIsAuthenticated(true);
          console.log('✅ Login exitoso:', data.user);
          return { success: true, data };
        } else {
          throw new Error('Datos de usuario incompletos');
        }
      } else {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
