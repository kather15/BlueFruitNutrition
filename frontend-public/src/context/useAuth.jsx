import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import toast from 'react-hot-toast'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ Verificar con el backend si hay sesión activa
        const response = await fetch('http://localhost:4000/api/verify-session', {
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
  }, []);

  // ✅ Función de login actualizada
  const login = (userData, token) => {
    const userInfo = {
      ...userData,
      token,
      isAuthenticated: true
    };
    
    setUser(userInfo);
    
    // Mantener localStorage como backup
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userData.id || userData._id || userData.userId);
    
    console.log('✅ Usuario logueado:', userInfo);
  };

  // ✅ Función de logout actualizada
  const logout = async () => {
    try {
      await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      console.log('✅ Logout en backend exitoso');
    } catch (error) {
      console.error('Error en logout backend:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('verificationToken');
      console.log('✅ Datos locales limpiados');
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: user?.isAuthenticated || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
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
      let res = await fetch("http://localhost:4000/api/registerCustomers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let result = await res.json();
      
      if (!res.ok) {
        res = await fetch("http://localhost:4000/api/registerDistributors", {
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
      const res = await fetch("http://localhost:4000/api/login", {
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