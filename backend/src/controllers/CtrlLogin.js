import customersModel from "../models/Customers.js";
import distributorsModel from "../models/Distributors.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

// Registro de intentos fallidos por email
const loginAttempts = {};
const MAX_ATTEMPTS = 5; // 5 intentos permitidos
const BLOCK_TIME_MS = 10 * 60 * 1000; // 10 minutos

loginController.login = async (req, res) => {
  const { email, password } = req.body;
  const now = Date.now();

  // Verificar si el usuario está bloqueado por demasiados intentos fallidos
  const attemptData = loginAttempts[email];
  if (attemptData) {
    if (
      attemptData.attempts >= MAX_ATTEMPTS &&
      now - attemptData.lastAttempt < BLOCK_TIME_MS
    ) {
      const remainingTime = Math.ceil(
        (BLOCK_TIME_MS - (now - attemptData.lastAttempt)) / 60000
      );
      return res.status(429).json({
        message: `Demasiados intentos. Intenta en ${remainingTime} minutos.`,
      });
    } else if (now - attemptData.lastAttempt >= BLOCK_TIME_MS) {
      // Reiniciar contador después de que pase el tiempo de bloqueo
      loginAttempts[email] = { attempts: 0, lastAttempt: now };
    }
  }

  try {
    let userFound;
    let userType;

    console.log("Intentando iniciar sesión con:", email);

    /** 
     * -----------------------------
     * LOGIN DE ADMINISTRADOR
     * -----------------------------
     * El admin se valida con las credenciales guardadas en config.js
     */
    if (
      email === config.emailAdmin.email &&
      password === config.emailAdmin.password
    ) {
      userType = "admin";
      console.log("Login de administrador exitoso");

      // Simulamos un usuario admin con un _id fijo
      userFound = {
        _id: "adminId",
        email: config.emailAdmin.email,
        name: "Administrador"
      };
    } else {
      /**
       * -----------------------------
       * LOGIN DE DISTRIBUIDOR O CLIENTE
       * -----------------------------
       */
      userFound = await distributorsModel.findOne({ email });
      userType = "distributor";

      // Si no es distribuidor, buscar en clientes
      if (!userFound) {
        userFound = await customersModel.findOne({ email });
        userType = "customer";
      }
    }

    // Si no se encontró usuario en ninguna categoría
    if (!userFound) {
      recordFailedAttempt(email, now);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    /**
     * -----------------------------
     * VALIDACIÓN DE CONTRASEÑA
     * -----------------------------
     * El admin no necesita validar contraseña contra la base de datos
     */
    if (userType !== "admin") {
      const isMatch = await bcrypt.compare(password, userFound.password);
      if (!isMatch) {
        recordFailedAttempt(email, now);
        const remaining = MAX_ATTEMPTS - (loginAttempts[email]?.attempts || 1);
        return res.status(401).json({
          message: `Contraseña incorrecta. Te quedan ${remaining} intentos.`,
        });
      }
    }

    // Si el login fue correcto, limpiar intentos fallidos
    if (loginAttempts[email]) delete loginAttempts[email];

    /**
     * -----------------------------
     * CREAR TOKEN JWT
     * -----------------------------
     */
    const tokenPayload = {
      id: userFound._id,
      email: userFound.email || email,
      userType,
      role: userType // rol explícito para el frontend
    };

    const token = jsonwebtoken.sign(
      tokenPayload,
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn }
    );

    /**
     * -----------------------------
     * CREAR COOKIE
     * -----------------------------
     */
   res.cookie("authToken", token, {
  httpOnly: true,
  secure: true,            // Render siempre usa HTTPS
  sameSite: "none",        // Permite compartir cookie entre dominios distintos
  maxAge: 24 * 60 * 60 * 1000 // 1 día
});


    /**
     * -----------------------------
     * RESPUESTA FINAL
     * -----------------------------
     */
    const userData = {
      id: userFound._id,
      email: userFound.email || email,
      name: userFound.name || userFound.companyName || "Usuario",
      role: userType,
      isAuthenticated: true
    };
    
    //nombre del usuario
    console.log("Usuario autenticado:", userData.name);

    return res.json({
      message: "Login exitoso",
      role: userType,
      user: userData,
      namek: userData.name,
      token: token
      
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Función auxiliar para registrar intentos fallidos
 */
function recordFailedAttempt(email, now) {
  if (!loginAttempts[email]) {
    loginAttempts[email] = { attempts: 1, lastAttempt: now };
  } else {
    loginAttempts[email].attempts += 1;
    loginAttempts[email].lastAttempt = now;
  }
}

export default loginController;
