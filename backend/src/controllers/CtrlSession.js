import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const sessionController = {};

sessionController.checkSession = (req, res) => {
  const token = req.cookies.authToken; // Cambia "token" si tu cookie se llama diferente

  if (!token) {
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const userData = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      // agrega más campos si están en el token
    };
    res.json({ user: userData });
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export default sessionController;