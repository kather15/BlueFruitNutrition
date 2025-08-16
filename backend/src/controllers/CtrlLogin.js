import customersModel from "../models/Customers.js";
import distributorsModel from "../models/Distributors.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

// Máximo de intentos de inicio de sesión
const loginAttempts = {};
const MAX_ATTEMPTS = 5; // 5 intentos
const BLOCK_TIME_MS = 10 * 60 * 1000; // 10 minutos de espera

loginController.login = async (req, res) => {
  const { email, password } = req.body;
  const now = Date.now();

  // Verificar bloqueo por intentos previos
  const attemptData = loginAttempts[email];
  if (attemptData) {
    if (
      attemptData.attempts >= MAX_ATTEMPTS &&
      now - attemptData.lastAttempt < BLOCK_TIME_MS
    ) {
      const remainingTime = Math.ceil(
        (BLOCK_TIME_MS - (now - attemptData.lastAttempt)) / 60000
      );
      return res
        .status(429)
        .json({
          message: `Demasiados intentos. Intenta en ${remainingTime} minutos.`,
        });
    } else if (now - attemptData.lastAttempt >= BLOCK_TIME_MS) {
      loginAttempts[email] = { attempts: 0, lastAttempt: now };
    }
  }

  try {
    let userFound;
    let userType;

    console.log("Intentando iniciar sesión con:", email);
    // Login de administrador
    if (
      email === config.emailAdmin.email &&
      password === config.emailAdmin.password
    ) {
      userType = "admin";
      console.log("Login de administrador exitoso");
      userFound = { _id: "adminId" };
    } else {
      // Buscar en distribuidores
      userFound = await distributorsModel.findOne({ email });
      userType = "distributor";

      // Si no está, buscar en clientes
      if (!userFound) {
        userFound = await customersModel.findOne({ email });
        userType = "customer";
      }
    }

    if (!userFound) {
      recordFailedAttempt(email, now);
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validar contraseña (excepto admin)
    if (userType !== "admin") {
      const isMatch = await bcrypt.compare(password, userFound.password);
      if (!isMatch) {
        recordFailedAttempt(email, now);
        const remaining = MAX_ATTEMPTS - (loginAttempts[email]?.attempts || 1);
        return res
          .status(401)
          .json({
            message: `Contraseña incorrecta. Te quedan ${remaining} intentos.`,
          });
      }
    }

    // Borrar intentos si es correcto
    if (loginAttempts[email]) delete loginAttempts[email];

    // Crear el token
    const token = jsonwebtoken.sign(
      { id: userFound._id, userType },
      config.JWT.secret,
      { expiresIn: config.JWT.expiresIn }
    );

    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({ message: "Login exitoso", role: userType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

function recordFailedAttempt(email, now) {
  if (!loginAttempts[email]) {
    loginAttempts[email] = { attempts: 1, lastAttempt: now };
  } else {
    loginAttempts[email].attempts += 1;
    loginAttempts[email].lastAttempt = now;
  }
}

export default loginController;
