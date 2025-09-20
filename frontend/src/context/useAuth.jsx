import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Crear contexto
const AuthContext = createContext();

// Hook para usar contexto
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return context;
};

// Provider principal
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = "https://bluefruitnutrition1.onrender.com/api";

  // Verificar sesión al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/session/auth/session`, {
          method: "GET",
          credentials: "include", // <- cookies httpOnly
        });

        if (!res.ok) throw new Error("No autenticado");

        const data = await res.json();
        setUser(data.user || data); // manejar ambos formatos
        toast.success("Sesión activa detectada");
      } catch {
        // fallback a localStorage
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (token && userId) {
          setUser({ id: userId, token, isAuthenticated: true });
          toast.success("Sesión restaurada desde localStorage");
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función de login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Credenciales inválidas");

      // Admin: redirigir a panel y enviar código
      if (result.role === "admin") {
        toast.success("Redirigiendo al panel de admin...");
        // Aquí puedes manejar modal de código si quieres
        setTimeout(() => {
          window.location.href = "http://localhost:5174"; // o producción
        }, 1000);
        return;
      }

      // Usuario normal
      const userData = result.user || result;
      const token = result.token;

      setUser({ ...userData, token, isAuthenticated: true });
      setLoading(false);

      // Guardar en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userData.id || userData._id || userData.userId);

      toast.success("Sesión iniciada correctamente");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      toast.success("Sesión cerrada");
      navigate("/");
    }
  };

  // Revalidar sesión manualmente
  const checkSession = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/session/auth/session`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("No autenticado");

      const data = await res.json();
      setUser(data.user || data);
      toast.success("Sesión confirmada");
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    checkSession,
    loading,
    isAuthenticated: !!user?.isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default useAuthContext;
