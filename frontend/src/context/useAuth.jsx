import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Crear contexto
const AuthContext = createContext();

// Provider principal
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar sesión al cargar la app
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("https://bluefruitnutrition1.onrender.com/api/verify-session", {
          method: "GET",
          credentials: "include", // cookies httpOnly
        });

        if (!res.ok) throw new Error("No autenticado");

        const data = await res.json();
        setUser({
          ...data.user,
          isAuthenticated: true,
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Función de login
  const login = async (credentials) => {
    try {
      const res = await fetch("https://bluefruitnutrition1.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Credenciales inválidas");

      // Login admin: redirigir a panel
      if (result.role === "admin") {
        toast.success("Redirigiendo al panel de administrador");
        setTimeout(() => {
          window.location.href = "http://localhost:5174";
        }, 1000);
        return;
      }

      // Login usuario normal: guardar en contexto y localStorage
      const userData = result.user || result;
      const token = result.token;

      setUser({ ...userData, token, isAuthenticated: true });

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userData.id || userData._id || userData.userId);

      toast.success("Sesión iniciada");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Función de registro
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
          body: JSON.stringify(data),
        });
        result = await res.json();
        if (!res.ok) throw new Error(result.message || "Error en el registro");
      }

      toast.success("Verifica tu correo");

      if (result.token) localStorage.setItem("verificationToken", result.token);

      navigate("/verificar-codigo");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch("https://bluefruitnutrition1.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }

    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("verificationToken");

    toast.success("Sesión cerrada");
    navigate("/");
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user?.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar contexto
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return context;
};

// Hook principal de auth
const useAuth = () => {
  const { login, register, logout } = useAuthContext();
  return { login, register, logout };
};

export default useAuth;
