import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies?.authToken;
  if (!token) return res.status(401).json({ message: "No autenticado" });

  try {
    const decoded = jwt.verify(token, config.JWT.secret);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
};
