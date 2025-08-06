const { sendContactEmail } = require('../utils/mailer');

// Controlador que recibe los datos del formulario y usa mailer para enviar el email
const handleContactForm = async (req, res) => {
  const { nombre, email, celular, mensaje } = req.body;

  // Validamos que todos los campos estén llenos
  if (!nombre || !email || !celular || !mensaje) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Enviamos el correo con los datos recibidos
    await sendContactEmail({ nombre, email, celular, mensaje });
    // Respondemos con éxito si no hubo error
    res.json({ message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error enviando email:', error);
    // Respondemos con error si falla el envío
    res.status(500).json({ message: 'Error enviando el mensaje' });
  }
};

module.exports = { handleContactForm };
