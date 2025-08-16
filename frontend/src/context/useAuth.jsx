import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Contexto
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/auth/session", {
          method: "GET",
          credentials: "include", // Importante para enviar cookies httpOnly
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

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      // Suponiendo que tienes un endpoint logout que borra la cookie JWT
      const res = await fetch("http://localhost:4000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error cerrando sesión");

      setUser(null);
      toast.success("Sesión cerrada");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: user?.isAuthenticated || false,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }
  return context;
};
