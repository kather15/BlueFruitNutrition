// backend/src/controllers/CtrlContact.js
import { sendContactEmail } from '../utils/mailer.js';

const handleContactForm = async (req, res) => {
  try {
    const { nombre, email, celular, mensaje } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !celular || !mensaje) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios',
        fields: { nombre: !nombre, email: !email, celular: !celular, mensaje: !mensaje }
      });
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Por favor ingresa un email válido' 
      });
    }

    // Validar longitud de campos
    if (nombre.length > 100 || mensaje.length > 1000) {
      return res.status(400).json({ 
        message: 'Nombre debe tener menos de 100 caracteres y mensaje menos de 1000' 
      });
    }

    console.log('📨 Procesando mensaje de contacto de:', nombre);

    // Enviar email
    await sendContactEmail({ nombre, email, celular, mensaje });
    
    res.status(200).json({ 
      message: 'Mensaje enviado correctamente',
      success: true 
    });

  } catch (error) {
    console.error('❌ Error en handleContactForm:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor. Intenta nuevamente.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export { handleContactForm };