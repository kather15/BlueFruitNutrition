import fetch from 'node-fetch';
import { config } from '../config.js';

const apiKey = config.email.apiKey; 

const sendContactEmail = async ({ nombre, email, celular, mensaje }) => {
  console.log('Enviando email vía API Brevo...');

  const bodyPayload = {
    sender: {
      name: "BlueFruit Nutrition",
      email: config.email.email_user,
    },
    to: [
      {
        email: config.email.to || config.email.email_user,
        name: "Administrador"
      }
    ],
    replyTo: {
      email: email,
      name: nombre
    },
    subject: `Nuevo mensaje de contacto de ${nombre}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #001a4d 0%, #0056b3 100%); color: white; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 26px;">BlueFruit Nutrition</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Nuevo mensaje de contacto</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #001a4d; margin-top: 0; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">
            Información del Cliente
          </h2>

          <div style="background: #f1f4f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #001a4d; width: 120px;">👤 Nombre:</td>
                <td style="padding: 10px 0; color: #333;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #001a4d;"> Email:</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #0056b3; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #001a4d;">📱 Celular:</td>
                <td style="padding: 10px 0; color: #333;">${celular}</td>
              </tr>
            </table>
          </div>

          <div style="background: #ffffff; padding: 20px; border-left: 4px solid #0056b3; border-radius: 6px; margin: 20px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
            <h3 style="color: #001a4d; margin-top: 0; display: flex; align-items: center;">
              💬 Mensaje del Cliente
            </h3>
            <div style="background: #f1f4f9; padding: 15px; border-radius: 5px; line-height: 1.6; white-space: pre-wrap; color: #333;">
              ${mensaje}
            </div>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${email}?subject=Re: Tu consulta en BlueFruit Nutrition" 
               style="background: #0056b3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">
               Responder Email
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            Enviado el ${new Date().toLocaleString('es-ES')} desde el formulario de contacto de BlueFruit Nutrition
          </p>
        </div>
      </div>
    `,
    textContent: `
Nuevo mensaje de contacto - BlueFruit Nutrition

Nombre: ${nombre}
Email: ${email}
Celular: ${celular}

Mensaje:
${mensaje}

Enviado el ${new Date().toLocaleString('es-ES')}
    `
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Error en Brevo API: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    console.log('Email enviado exitosamente vía API Brevo:', data);
    return data;
  } catch (error) {
    console.error('Error al enviar email:', error.message);
    throw error;
  }
};

export { sendContactEmail };
