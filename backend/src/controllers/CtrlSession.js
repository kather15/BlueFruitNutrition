import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const sessionController = {};

//  Verifica sesión usando el middleware authenticate
sessionController.checkSession = (req, res) => {
  try {
    // Si llegamos aquí, el middleware authenticate ya validó el token
    // y puso los datos del usuario en req.user
    res.status(200).json({
      id: req.user.id,
      email: req.user.email,
      role: req.user.userType || req.user.role, 
      isAuthenticated: true
    });
  } catch (error) {
    console.error('Error en checkSession:', error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default sessionController;