import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies?.authToken;

  console.log('🔹 Verificando autenticación...');
  console.log('Token presente:', !!token);

  if (!token) {
    console.log('❌ No hay token');
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT.secret);
    console.log('✅ Token válido:', decoded);

    // Aseguramos que req.user tenga información completa
    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
      ...decoded
    };

    console.log('👤 Usuario autenticado:', req.user);
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const requireAdmin = (req, res, next) => {
  console.log('🔹 Verificando permisos de admin...');
  console.log('Usuario actual:', req.user);

  if (req.user?.role !== "admin") {
    console.log('❌ Acceso denegado - no es admin');
    return res.status(403).json({ message: "Acceso denegado" });
  }

  console.log('✅ Usuario es admin');
  next();
};
