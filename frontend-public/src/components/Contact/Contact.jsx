import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast'; 
import './Contact.css';


const Contacto = () => {
  // Desestructura las funciones y propiedades de useForm
  const {
    register,        // Para registrar campos del formulario
    handleSubmit,    // Para manejar el evento de envío
    reset,           // Para limpiar el formulario después de enviarlo
    formState: { errors, isSubmitting }, // Para manejar errores y estado de envío
  } = useForm();

  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data) => {
    try {
      // Envía los datos del formulario al backend usando fetch
      const response = await fetch('https://bluefruitnutrition1.onrender.com/api/contact', {
        method: 'POST', // Método HTTP
        headers: {
          'Content-Type': 'application/json', // Indica que el cuerpo es JSON
        },
        body: JSON.stringify(data), // Convierte los datos a JSON
      });

      // Si la respuesta del servidor es correcta (status 200-299)
      if (response.ok) {
        toast.success('Mensaje enviado correctamente'); // Muestra notificación de éxito
        reset(); // Limpia los campos del formulario
      } else {
        // Si hay un error, intenta extraer el mensaje del cuerpo de la respuesta
        let errorText = response.statusText;
        try {
          const errorData = await response.json();
          errorText = errorData.message || errorText;
        } catch {} // Si no se puede leer JSON, deja el texto por defecto

        // Muestra notificación de error
        toast.error(' Error al enviar el mensaje: ' + errorText);
      }
    } catch (error) {
      // En caso de error de red u otro problema
      console.error('Error:', error);
      toast.error(' Error de conexión: ' + error.message);
    }
  };

  // Lo que se visualiza en la pantalla
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

          {/* Formulario de contacto */}
          <div className="blue-fruit-contact-form">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              
              {/* Campo: Nombre */}
              <input
                type="text"
                placeholder="Tu Nombre*"
                {...register('nombre', { required: 'El nombre es requerido' })}
              />
              {errors.nombre && <p className="error">{errors.nombre.message}</p>}

              {/* Campo: Email */}
              <input
                type="email"
                placeholder="Tu Email*"
                {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, // Validación de formato de correo
                    message: 'Email no válido',
                  },
                })}
              />
              {errors.email && <p className="error">{errors.email.message}</p>}

              {/* Campo: Celular */}
              <input
                type="tel"
                placeholder="Tu Celular*"
                maxLength={7}
                {...register('celular', {
                  required: 'El celular es requerido',
                  pattern: {
                    value: /^[0-9]{7}$/, // Solo acepta 7 dígitos
                    message: 'Debe contener exactamente 7 números',
                  },
                })}
              />
              {errors.celular && <p className="error">{errors.celular.message}</p>}

              {/* Campo: Mensaje */}
              <textarea
                rows="5"
                placeholder="Tu mensaje"
                {...register('mensaje', { required: 'El mensaje es requerido' })}
              ></textarea>
              {errors.mensaje && <p className="error">{errors.mensaje.message}</p>}

              {/* Botón de envío, deshabilitado mientras se está enviando */}
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
