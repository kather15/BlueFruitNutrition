import nodemailer from "nodemailer"; //Dependencia para enviar correos
import { config } from "../config.js";

// 1- Transporter = ¿Quién lo envía?
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.email.email_user,
    pass: config.email.email_pass,
  },
});

// 2- Función genérica para enviar correo
const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"Blue Fruit Nutrition" <itbluefruit@gmail.com>', // remitente
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (error) {
    console.log("Error sending recovery email:", error);
    return error;
  }
};

// 3- Plantilla HTML de recuperación de contraseña
const HTMLRecoveryEmail = (code) => {
  return `
    <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Recuperación de contraseña</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #001a4d 0%, #0056b3 100%);
      color: white;
      padding: 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
    }
    .header p {
      margin: 8px 0 0 0;
      opacity: 0.9;
      font-weight: 500;
    }
    .content {
      padding: 30px;
      background: #ffffff;
      color: #333;
    }
    .content h2 {
      color: #001a4d;
      margin-top: 0;
      border-bottom: 2px solid #0056b3;
      padding-bottom: 10px;
    }
    .content p {
      font-size: 16px;
      color: #555555;
      line-height: 1.5;
    }
    .code {
      display: inline-block;
      margin: 20px 0;
      font-size: 28px;
      font-weight: bold;
      background-color: #f1f4f9;
      padding: 15px 30px;
      border-radius: 10px;
      letter-spacing: 4px;
      color: #001a4d;
      border: 2px solid #0056b3;
      user-select: all;
    }
    .footer {
      background: #f8f9fa;
      padding: 15px;
      text-align: center;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BlueFruit Nutrition</h1>
      <p>Solicitud de recuperación de contraseña</p>
    </div>

    <div class="content">
      <h2>Restablece tu contraseña</h2>
      <p>Hemos recibido una solicitud para restablecer tu contraseña. Usa el siguiente código para continuar con el proceso:</p>
      <div class="code">${code}</div>
      <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
    </div>

    <div class="footer">
      &copy; ${new Date().getFullYear()} Blue Fruit Nutrition. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>
  `;
};

export { sendMail, HTMLRecoveryEmail };
