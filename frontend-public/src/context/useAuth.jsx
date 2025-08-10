import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import toast from 'react-hot-toast'; 

//  Crear el contexto de autenticación
const AuthContext = createContext();

//  Componente proveedor que envuelve toda la app y maneja el estado de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado del usuario autenticado
  const [loading, setLoading] = useState(true); // Estado de carga mientras se verifica el token

  // useEffect que se ejecuta una sola vez al cargar el componente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Obtener token y userId del almacenamiento local
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        // Si existen, asumimos que el usuario está autenticado
        if (token && userId) {
          setUser({ 
            id: userId, 
            token: token,
            isAuthenticated: true 
          });
        }
      } catch (error) {
        // Si hay un error, limpiar los datos del almacenamiento local
        console.error('Error verificando autenticación:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      } finally {
        // Terminar la carga sin importar el resultado
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión y guardar datos del usuario
  const login = (userData, token) => {
    const userInfo = {
      ...userData,
      token,
      isAuthenticated: true
    };
    
    setUser(userInfo); // Guardar en estado
    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userData.id || userData._id || userData.userId);
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null); // Borrar usuario del estado
    // Limpiar almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('verificationToken');
  };

  // Valores disponibles para los componentes hijos
  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: user?.isAuthenticated || false
  };

  // Proveer el contexto a los hijos
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente al contexto de autenticación
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
};

// Hook principal que contiene la lógica de registro, login y logout
const useAuth = () => {
  const navigate = useNavigate(); 
  const { login: contextLogin, logout: contextLogout } = useAuthContext(); // Acceder a funciones del contexto

  // Función para registrar usuario
  const register = async (data) => {
    try {
      // Intentar registrar como cliente
      let res = await fetch("http://localhost:4000/api/registerCustomers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let result = await res.json();
      
      // Si no funciona, intentar registrar como distribuidor
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

      // Registro exitoso
      toast.success("Verifica tu correo");

      // Guardar token de verificación si viene en la respuesta
      if (result.token) {
        localStorage.setItem("verificationToken", result.token);
      }

      // Redirigir a pantalla de verificación
      navigate("/verificar-codigo");

    } catch (error) {
      toast.error(error.message); // Mostrar error
    }
  };

  // Función para login
  const login = async (data) => {
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include' // Incluye cookies para iniciar sesion
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Credenciales inválidas");

      // Si el usuario es administrador, redirigir a su panel
      if (result.role === 'admin') {
        toast.success("Redirigiendo al panel de administrador");
        setTimeout(() => {
          window.location.href = "http://localhost:5174";
        }, 1000);
        return;
      }

      // Si es usuario normal, usar el contexto para guardar su sesión
      contextLogin(result.user || result, result.token);

      toast.success("Sesión iniciada");
      navigate("/"); // Redirigir a inicio
    } catch (error) {
      toast.error(error.message); // Mostrar error
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    contextLogout(); // Usar función del contexto
    toast.success("Sesión cerrada");
    navigate("/"); // Redirigir a inicio
  };

 
  return { register, login, logout };
};


export default useAuth;
