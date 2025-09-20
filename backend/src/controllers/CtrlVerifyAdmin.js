import jsonwebtoken from "jsonwebtoken";
import nodemailer from "nodemailer";
import { config } from "../config.js";

const adminVerificationController = {};

adminVerificationController.sendCode = async (req, res) => {
  const { email, password } = req.body;

  if (email !== config.emailAdmin.email || password !== config.emailAdmin.password) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Generar código de 6 dígitos
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Crear token con el código
  const tokenCode = jsonwebtoken.sign(
    { email, verificationCode },
    config.JWT.secret,
    { expiresIn: "5m" }
  );

// Detectar si estamos en producción o local
const isProduction = process.env.NODE_ENV === "production";

res.cookie("adminVerificationToken", tokenCode, {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax", // none para cross-site prod
  secure: isProduction,                   // true solo en prod con HTTPS
  maxAge: 5 * 60 * 1000
});


  // Configurar transporte de correo
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email.email_user,
      pass: config.email.email_pass
    }
  });

  const mailOptions = {
    from: config.email.email_user,
    to: email,
    subject: "Código de verificación - Acceso Admin",
    text: `Tu código de verificación es: ${verificationCode} (expira en 5 minutos)`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Código enviado al correo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error enviando correo" });
  }
};

adminVerificationController.verifyCode = async (req, res) => {
  const { code } = req.body;
  const token = req.cookies.adminVerificationToken;

  if (!token) return res.status(400).json({ message: "No hay token de verificación" });

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    if (decoded.verificationCode !== code) {
      return res.status(422).json({ message: "Código inválido" });
    }

    res.clearCookie("adminVerificationToken");

    // Aquí puedes marcar en sesión que el admin ya está validado si usas sesiones
    res.status(200).json({ message: "Verificación de admin exitosa" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token inválido o expirado" });
  }
};

export default adminVerificationController;
