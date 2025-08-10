
import React from 'react';
import { useForm } from 'react-hook-form';
import './Contact.css';

const Contacto = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data) => {
    try {
      // Hace una solicitud POST al backend con los datos del formulario
      const response = await fetch('http://localhost:4000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Convierte los datos a JSON
      });

      // Si el envío fue exitoso
      if (response.ok) {
        alert('Mensaje enviado correctamente');
        reset(); // Limpia el formulario
      } else {
        // Manejo de errores de respuesta del servidor
        let errorText = response.statusText;
        try {
          const errorData = await response.json();
          errorText = errorData.message || errorText;
        } catch {}
        alert('Error al enviar el mensaje: ' + errorText);
      }
    } catch (error) {
      // Manejo de errores de conexión
      console.error('Error:', error);
      alert('Error de conexión: ' + error.message);
    }
  };

  // Estructura visual del formulario de contacto
  return (
    <main>
      <section className="blue-fruit-contact-section">
        <div className="blue-fruit-contact-wrapper">
          {/* Información de contacto */}
          <div className="blue-fruit-contact-info">
            <h2>Contáctanos</h2>
            <h3>Llámanos</h3>
            <p>Estamos disponibles 24 horas al día, 7 días a la semana.</p>
            <p>Celular: +503 6859 7103</p>
            <hr />
            <h3>Escríbenos</h3>
            <p>Llena nuestro formulario y nos pondremos en contacto contigo en 24 horas.</p>
            <p>Email: info@blueletrunutrition.com</p>
          </div>

          {/* Formulario */}
          <div className="blue-fruit-contact-form">
            {/* handleSubmit ejecuta la función onSubmit al enviar */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Campo nombre - requerido */}
              <input
                type="text"
                placeholder="Tu Nombre*"
                {...register('nombre', { required: 'El nombre es requerido' })}
              />
              {errors.nombre && <p className="error">{errors.nombre.message}</p>}

              {/* Campo email - requerido y con formato de email */}
              <input
                type="email"
                placeholder="Tu Email*"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: 'Email no válido',
                  },
                })}
              />
              {errors.email && <p className="error">{errors.email.message}</p>}

              {/* Campo celular - requerido, solo acepta 7 números */}
              <input
                type="tel"
                placeholder="Tu Celular*"
                maxLength={7} // Limita la cantidad de caracteres a 7
                {...register('celular', {
                  required: 'El celular es requerido',
                  pattern: {
                    value: /^[0-9]{7}$/, // Permite exactamente 7 números
                    message: 'Debe contener exactamente 7 números',
                  },
                })}
              />
              {errors.celular && <p className="error">{errors.celular.message}</p>}

              {/* Campo mensaje - requerido */}
              <textarea
                rows="5"
                placeholder="Tu mensaje"
                {...register('mensaje', { required: 'El mensaje es requerido' })}
              ></textarea>
              {errors.mensaje && <p className="error">{errors.mensaje.message}</p>}

              {/* Botón de envío */}
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};


export default Contacto;
