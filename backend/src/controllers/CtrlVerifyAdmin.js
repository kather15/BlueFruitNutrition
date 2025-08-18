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

  // Guardar token en cookie
  res.cookie("adminVerificationToken", tokenCode, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // Cambiar a true en producción con HTTPS
    maxAge: 5 * 60 * 1000
  });

  // HTML con diseño
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #001a4d 0%, #0056b3 100%); color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px;">BlueFruit Nutrition</h1>
        <p style="margin: 8px 0 0 0; opacity: 0.9;">Código de verificación de administrador</p>
      </div>

      <div style="padding: 30px; background: #ffffff;">
        <h2 style="color: #001a4d; margin-top: 0; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">
          Verifica tu acceso
        </h2>

        <p style="font-size: 16px; color: #555;">
          Usa el siguiente código de verificación para continuar. Este código es válido por 5 minutos:
        </p>

        <div style="display: inline-block; font-size: 28px; font-weight: bold; background-color: #f1f4f9; padding: 15px 30px; border-radius: 10px; letter-spacing: 4px; color: #001a4d; border: 2px solid #0056b3; user-select: all;">
          ${verificationCode}
        </div>

        <p style="margin-top: 20px; font-size: 14px; color: #888;">
          Si no solicitaste este acceso, puedes ignorar este correo.
        </p>
      </div>

      <div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
        <p style="margin: 0; color: #666; font-size: 12px;">
          &copy; ${new Date().getFullYear()} BlueFruit Nutrition. Todos los derechos reservados.
        </p>
      </div>
    </div>
  `;

  // Configurar transporte de correo
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.emailverification.emailV_user,
      pass: config.emailverification.emailV_pass, // Usa App Password si Gmail tiene 2FA
    },
    secure: true,
  });

  const mailOptions = {
    from: `"BlueFruit Nutrition" <${config.emailverification.emailV_user}>`,
    to: email,
    subject: "Código de verificación - Acceso Admin",
    html: htmlTemplate,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Código enviado al correo" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ message: "Error enviando correo" });
  }
};

// Verificar el código ingresado
adminVerificationController.verifyCode = async (req, res) => {
  const { code } = req.body;
  const token = req.cookies.adminVerificationToken;

  if (!token) {
    return res.status(400).json({ message: "No hay token de verificación" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    if (decoded.verificationCode !== code) {
      return res.status(422).json({ message: "Código inválido" });
    }

    res.clearCookie("adminVerificationToken");

    // Aquí podrías guardar en sesión o generar un token de sesión admin
    res.status(200).json({ message: "Verificación de admin exitosa" });
  } catch (error) {
    console.error("Token inválido o expirado:", error);
    res.status(400).json({ message: "Token inválido o expirado" });
  }
};

export default adminVerificationController;