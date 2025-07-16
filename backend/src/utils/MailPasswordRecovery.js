import nodemailer from "nodemailer"
import { config } from "../config.js"


//1-
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.email.email_user,
    pass: config.email.email_pass,
  },
});

//2-
const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"Blue Fruit Nutrition" <itbluefruit@gmail.com>"',
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (error) {
    console.log("Error sending recovery email");//error
  }
};


//3-
const HTMLRecoveryEmail = (code) => {
  return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    color: #333333;
                }
                p {
                    color: #555555;
                    font-size: 16px;
                }
                .code {
                    display: inline-block;
                    margin: 20px 0;
                    font-size: 24px;
                    font-weight: bold;
                    background-color: #eaeaea;
                    padding: 10px 20px;
                    border-radius: 6px;
                    letter-spacing: 2px;
                    color: #333;
                }
                .footer {
                    font-size: 12px;
                    color: #888888;
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Solicitud de recuperación de contraseña</h2>
                <p>Hemos recibido una solicitud para restablecer tu contraseña. Usa el siguiente código para continuar con el proceso:</p>
                <div class="code">${code}</div>
                <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Blue Fruit Nutrition. Todos los derechos reservados.
                </div>
            </div>
        </body>
        </html>
    `;
};

export { sendMail, HTMLRecoveryEmail };
