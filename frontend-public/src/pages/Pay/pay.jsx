// src/pages/Pay.js
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './Pay.css';

const Pay = () => {
  const navigate = useNavigate();
  const [showBack, setShowBack] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      securityCode: ''
    }
  });

  const handleExpiryInput = (e) => {
    let rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue.length >= 3) {
      rawValue = rawValue.slice(0, 2) + '/' + rawValue.slice(2, 4);
    }
    if (rawValue.length > 5) {
      rawValue = rawValue.slice(0, 5);
    }
    setValue('expiryDate', rawValue);
  };

  const onSubmitFront = () => {
    setShowBack(true);
  };

  const onSubmitBack = async (data) => {
    try {
      const response = await fetch('http://localhost:4000/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pago');
      }

      const result = await response.json();
      alert('✅ Pago simulado exitoso: ' + result.message);
      navigate('/success');
    } catch (error) {
      alert('❌ Error en el pago: ' + error.message);
    }
  };

  const goToRealPayment = () => {
    navigate('/real-payment');
  };

  const goToCheckout = () => {        
    navigate('/metodo');
  };

  const handleRealPayment = async () => {
  const formData = {
    cardNumber: watch('cardNumber'),
    cardHolder: watch('cardHolder'),
    expiryDate: watch('expiryDate'),
    securityCode: watch('securityCode'),
  };

  try {
    const response = await fetch('http://localhost:4000/api/payment3ds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error en el pago real');
    }

    const result = await response.json();
    alert('✅ Pago real exitoso: ' + result.message);
    navigate('/success');
  } catch (error) {
    alert('❌ Error en el pago real: ' + error.message);
  }
};


  return (
    <div className="page-wrapper">
      <div className="credit-card-container">
        <div className={`card-flip-wrapper ${showBack ? 'flip' : ''}`}>
          <div className="credit-card-mockup front">
            <div className="chip"></div>
            <div className="card-number">{watch('cardNumber') || '1234 5678 9010 1234'}</div>
            <div className="card-info-bottom">
              <div className="card-holder-info">
                <span className="card-label">Titular:</span>
                <span className="card-value">{watch('cardHolder') || 'Nombre Apellido'}</span>
              </div>
              <div className="expiration-info">
                <span className="card-label">Vencimiento:</span>
                <span className="card-value">{watch('expiryDate') || 'MM/AA'}</span>
              </div>
            </div>
          </div>

          <div className="credit-card-mockup back">
            <div className="magnetic-stripe"></div>
            <div className="card-holder-back-info">
              <span className="card-label-back">Titular:</span>
              <span className="card-value-back">{watch('cardHolder') || 'Nombre Apellido'}</span>
            </div>
            <div className="security-code-label">Código:</div>
            <div className="security-code-display">{watch('securityCode') || '***'}</div>
          </div>
        </div>

        {!showBack ? (
          <form className="input-fields-group" onSubmit={handleSubmit(onSubmitFront)}>
            <button type="button" className="back-button" onClick={goToCheckout}>← Volver</button>

            <div className="input-field">
              <label htmlFor="cardNumber">Número de Tarjeta</label>
              <input
                id="cardNumber"
                maxLength={16}
                {...register('cardNumber', {
                  required: 'Requerido',
                  pattern: { value: /^\d{16}$/, message: '16 dígitos' }
                })}
              />
              {errors.cardNumber && <small className="error">{errors.cardNumber.message}</small>}
            </div>

            <div className="flex-group">
              <div className="input-field half-width">
                <label htmlFor="cardHolder">Titular</label>
                <input
                  id="cardHolder"
                  {...register('cardHolder', {
                    required: 'Requerido',
                    minLength: { value: 3, message: 'Muy corto' }
                  })}
                />
                {errors.cardHolder && <small className="error">{errors.cardHolder.message}</small>}
              </div>

              <div className="input-field half-width">
                <label htmlFor="expiryDate">Vencimiento (MM/AA)</label>
                <input
                  id="expiryDate"
                  placeholder="MM/AA"
                  maxLength={5}
                  {...register('expiryDate', {
                    required: 'Requerido',
                    pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Formato inválido' }
                  })}
                  onChange={handleExpiryInput}
                />
                {errors.expiryDate && <small className="error">{errors.expiryDate.message}</small>}
              </div>
            </div>

            <button type="submit" className="next-step-button">Siguiente</button>
          </form>
        ) : (
          <form className="input-fields-group" onSubmit={handleSubmit(onSubmitBack)}>
            <button type="button" className="back-button" onClick={() => setShowBack(false)}>← Volver</button>

            <div className="input-field full-width">
              <label htmlFor="securityCode">Código de Seguridad</label>
              <input
                id="securityCode"
                maxLength={3}
                {...register('securityCode', {
                  required: 'Requerido',
                  pattern: { value: /^\d{3}$/, message: '3 dígitos' }
                })}
              />
              {errors.securityCode && <small className="error">{errors.securityCode.message}</small>}
            </div>

            <button type="submit" className="finish-purchase-button">Finalizar compra </button>
            <br/>
              <button
               type="button"
               className="finish-purchase-button"
              onClick={handleRealPayment}
              >
               Pago real
             </button>

               
          </form>
        )}
      </div>
    </div>
  );
};

export default Pay;
