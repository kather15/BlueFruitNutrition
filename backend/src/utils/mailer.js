import { config } from "../config.js"

const nodemailer = require('nodemailer');

// Configuramos el transporte de correo con Gmail y autenticación
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
   user: config.emailAdmin.email,        // correo del administrador (remitente)
    pass: config.emailAdmin.password,     // contraseña o app password del administrador
  },
});

// Función que envía el email con los datos del formulario
const sendContactEmail = async ({ nombre, email, celular, mensaje }) => {
  const mailOptions = {
    from: email,   // El correo de quien envía (usuario del formulario)
    to: 'correoencargado@gmail.com', // El correo que recibe el mensaje
    subject: `Nuevo mensaje de ${nombre}`,  // Asunto del email
    text: `Nombre: ${nombre}\nEmail: ${email}\nCelular: ${celular}\nMensaje:\n${mensaje}`, // Contenido del correo
  };

  // Enviamos el email con el transporter configurado
  return transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail };
