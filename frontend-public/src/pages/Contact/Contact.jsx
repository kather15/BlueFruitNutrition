import React from 'react';
import './Contact.css';

const Contacto = () => {
  return (
    <>
      

     <main>
        <section className="blue-fruit-contact-section">
          <div className="blue-fruit-contact-wrapper">
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

            <div className="blue-fruit-contact-form">
              <form onSubmit={(e) => e.preventDefault()}>
                <input type="text" placeholder="Tu Nombre*" required />
                <input type="email" placeholder="Tu Email*" required />
                <input type="tel" placeholder="Tu Celular*" required />
                <textarea placeholder="Tu mensaje" rows="5" required></textarea>
                <button type="submit">Enviar Mensaje</button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contacto;
