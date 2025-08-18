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

  // Verificar sesión al cargar la app
  useEffect(() => {
<<<<<<< HEAD
    const checkAuth = async () => {
      try {
        // ✅ Verificar con el backend si hay sesión activa
        const response = await fetch('https://bluefruitnutrition1.onrender.com/api/verify-session', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          console.log('✅ Sesión verificada con backend:', userData);
        } else {
          // Fallback a localStorage
          const token = localStorage.getItem('token');
          const userId = localStorage.getItem('userId');

          if (token && userId) {
            setUser({ 
              id: userId, 
              token: token,
              isAuthenticated: true 
            });
            console.log('⚠️ Usando datos de localStorage como fallback');
          } else {
            setUser(null);
            console.log('❌ No hay sesión activa');
          }
        }
      } catch (error) {
        console.error('Error verificando con backend:', error);
        
        // Fallback a localStorage en caso de error
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
          setUser({ 
            id: userId, 
            token: token,
            isAuthenticated: true 
          });
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
=======
    checkSession();
>>>>>>> a09778a12ccbb0f87b5db3ed41f92ffb7063334a
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/verify-session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        console.log('✅ Sesión activa:', data.user);
      } else {
        // Si hay error 401, no es necesariamente un error - solo no hay sesión
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

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, data };
      } else {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('https://bluefruitnutrition1.onrender.com/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
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
<<<<<<< HEAD
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
};

// Hook principal 
const useAuth = () => {
  const navigate = useNavigate(); 
  const { login: contextLogin, logout: contextLogout } = useAuthContext();

  const register = async (data) => {
    try {
      let res = await fetch("https://bluefruitnutrition1.onrender.com/api/registerCustomers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let result = await res.json();
      
      if (!res.ok) {
        res = await fetch("https://bluefruitnutrition1.onrender.com/api/registerDistributors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        
        result = await res.json();
        
        if (!res.ok) {
          throw new Error(result.message || "Error en el registro");
        }
      }

      toast.success("Verifica tu correo");

      if (result.token) {
        localStorage.setItem("verificationToken", result.token);
      }

      navigate("/verificar-codigo");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Función de login actualizada para usar la respuesta del backend
  const login = async (data) => {
    try {
      const res = await fetch("https://bluefruitnutrition1.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Credenciales inválidas");

      // ✅ Si hay datos de usuario en la respuesta, usar el contexto
      if (result.user) {
        contextLogin(result.user, result.token);
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    await contextLogout();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  return { register, login, logout };
};

export default useAuth;
=======
};
>>>>>>> a09778a12ccbb0f87b5db3ed41f92ffb7063334a
