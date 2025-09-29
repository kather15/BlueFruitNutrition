import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";
import fetch from "node-fetch";
 
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
 
  // ENVIAR CORREO CON BREVO API
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": config.apiKey.api_key,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Blue Fruit Nutrition", email: config.email.email_user },
        to: [{ email: email, name: "Admin" }],
        subject: "Código de verificación - Acceso Admin",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2E86C1; text-align: center;">Bienvenido Administrador</h2>
            <p style="font-size: 16px; text-align: center;">
              Este es su código de acceso. Úselo para completar el inicio de sesión:
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; color: #27AE60;">${verificationCode}</span>
            </div>
            <p style="font-size: 14px; color: #555; text-align: center;">
              Este código expira en 5 minutos.
            </p>
            <p style="font-size: 12px; text-align: center; color: #999;">
              Si usted no solicitó este acceso, por favor ignore este mensaje.
            </p>
          </div>
        `,
      }),
     
    });
 
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al enviar con Brevo:", errorData);
      return res.status(400).json({ message: "Error enviando el correo" });
    }
 
    res.status(200).json({ message: "Código enviado al correo" });
  } catch (error) {
    console.error("Error al usar Brevo:", error);
    res.status(500).json({ message: "Error interno al enviar correo" });
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