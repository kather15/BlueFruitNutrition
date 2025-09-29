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
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, data };
      } else {
        throw new Error(data.message || "Error en login");
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });
    } catch (err) {
      console.error(err);
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
