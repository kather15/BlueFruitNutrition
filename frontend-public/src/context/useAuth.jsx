import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API_URL = "https://bluefruitnutrition-production.up.railway.app/api";

  // Verifica sesión al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/session/auth/session`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setIsAuthenticated(true);
          console.log("Sesión verificada con backend:", data);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          console.log("No hay sesión activa");
        }
      } catch (err) {
        console.error("Error verificando sesión:", err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Reutilizable: checkSession bajo demanda
  const checkSession = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/session/auth/session`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsAuthenticated(true);
        console.log("Sesión confirmada:", data);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log("No hay sesión activa");
      }
    } catch (err) {
      console.error("Error en checkSession:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user && data.user.id) {
          setUser(data.user);
          setIsAuthenticated(true);
          console.log("✅ Login exitoso:", data.user);
          return { success: true, data };
        } else {
          throw new Error("Datos de usuario incompletos");
        }
      } else {
        throw new Error(data.message || "Error en login");
      }
    } catch (err) {
      console.error("Error en login:", err);
      return { success: false, error: err.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      console.log("Logout exitoso");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

