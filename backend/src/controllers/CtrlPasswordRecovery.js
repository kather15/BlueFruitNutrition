import jsonwebtoken from "jsonwebtoken"; // Token
import bcryptjs from "bcryptjs"; // Encriptar

import customersModel from "../models/Customers.js";
import distributorsModel from "../models/Distributors.js";
import { config } from "../config.js";
import { sendMail, HTMLRecoveryEmail } from "../utils/MailPasswordRecovery.js";

// Array de funciones
const passwordRecoveryController = {};

// ENVIAR CÓDIGO --------------------------------------------------------------------------------------
passwordRecoveryController.requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    let userFound;
    let userType;

    userFound = await customersModel.findOne({ email });
    if (userFound) {
      userType = "customer";
    } else {
      userFound = await distributorsModel.findOne({ email });
      if (userFound) {
        userType = "distributor";
      }
    }

    // Si no encuentra ni en clientes ni en distribuidores
    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generar un código aleatorio
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // Crear un token que guarde todo
    const token = jsonwebtoken.sign(
      { email, code, userType, verified: false },
      config.JWT.secret,
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", token, {
      maxAge: 20 * 60 * 1000, // 20 minutos
      httpOnly: true,
    });

    // Enviar correo con plantilla HTML
    await sendMail(
      email,
      "Recuperación de contraseña", // Asunto
      `Su código de verificación es: ${code}`, // Texto plano
      HTMLRecoveryEmail(code) // HTML
    );

    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("error: " + error);
  }
};

// VERIFICAR CÓDIGO ----------------------------------------------------------------------------------------
passwordRecoveryController.verfiedCode = async (req, res) => {
  const { code } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    // Verificar si el código coincide
    if (decoded.code !== code) {
      return res.status(422).json({ message: "Invalid Code" });
    }

    // Generamos un nuevo token con verified=true
    const newToken = jsonwebtoken.sign(
      {
        email: decoded.email,
        code: decoded.code,
        userType: decoded.userType,
        verified: true,
      },
      config.JWT.secret,
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", newToken, {
      maxAge: 20 * 60 * 1000,
      httpOnly: true,
    });

    res.json({ message: "Code verified successfully" });
  } catch (error) {
    console.log("error: " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CAMBIAR LA CONTRASEÑA --------------------------------------------------------------------------------
passwordRecoveryController.newPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.json({ message: "Code not verified" });
    }

    const { email, userType } = decoded;

    // Encriptar la nueva contraseña
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    if (userType === "customer") {
      await customersModel.findOneAndUpdate(
        { email },
        { password: hashedPassword }
      );
    } else if (userType === "distributor") {
      await distributorsModel.findOneAndUpdate(
        { email },
        { password: hashedPassword }
      );
    }

    // Eliminar el token
    res.clearCookie("tokenRecoveryCode");

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log("error: " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default passwordRecoveryController;
