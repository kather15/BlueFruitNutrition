import React from 'react';
import { useForm } from 'react-hook-form';
import './Pay.css';

const Pay = () => {
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

  const onSubmitFront = (data) => {
    // Validación adicional si quieres, y mostrar parte trasera
    setShowBack(true);
  };

  const [showBack, setShowBack] = React.useState(false);

  // Maneja el formateo automático de MM/AA en expiryDate
  const handleExpiryInput = (e) => {
    let rawValue = e.target.value.replace(/\D/g, ''); // solo números

    if (rawValue.length >= 3) {
      rawValue = rawValue.slice(0, 2) + '/' + rawValue.slice(2, 4);
    }

    if (rawValue.length > 5) {
      rawValue = rawValue.slice(0, 5);
    }

    setValue('expiryDate', rawValue);
  };

  // Maneja el submit de la parte trasera (seguridad)
  const onSubmitBack = (data) => {
    alert('Compra finalizada con éxito');
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
              <span className="card-label">Titular de la Tarjeta:</span>
              <span className="card-value">{watch('cardHolder') || 'Blue Fruit Nutrition'}</span>
            </div>
            <div className="expiration-info">
              <span className="card-label">Fecha de Vencimiento:</span>
              <span className="card-value">{watch('expiryDate') || '10/25'}</span>
            </div>
          </div>
        </div>

      {/* Vista trasera de la tarjeta */}
        <div className="credit-card-mockup back">
          <div className="magnetic-stripe"></div>
          <div className="card-holder-back-info">
            <span className="card-label-back">Titular de la Tarjeta:</span>
            <span className="card-value-back">{watch('cardHolder') || 'Blue Fruit Nutrition'}</span>
          </div>
          <div className="security-code-label">Números de seguridad:</div>
          <div className="security-code-display">{watch('securityCode') || '***'}</div>
        </div>
      </div>

      {!showBack ? (
        <form className="input-fields-group" onSubmit={handleSubmit(onSubmitFront)}>
          <div className="input-field">
            <label htmlFor="cardNumber">Número de Tarjeta</label>
            <input
              id="cardNumber"
              maxLength={16}
              {...register('cardNumber', {
                required: 'Número de tarjeta requerido',
                pattern: {
                  value: /^\d{16}$/,
                  message: 'El número de tarjeta debe tener 16 dígitos'
                }
              })}
            />
            {errors.cardNumber && <small className="error">{errors.cardNumber.message}</small>}
          </div>

          <div className="flex-group">
            <div className="input-field half-width">
              <label htmlFor="cardHolder">Titular de la Tarjeta:</label>
              <input
                id="cardHolder"
                {...register('cardHolder', {
                  required: 'Titular es requerido',
                  minLength: {
                    value: 3,
                    message: 'Nombre demasiado corto'
                  }
                })}
              />
              {errors.cardHolder && <small className="error">{errors.cardHolder.message}</small>}
            </div>

            <div className="input-field half-width">
              <label htmlFor="expiryDate">Fecha de Vencimiento:</label>
              <input
                id="expiryDate"
                placeholder="MM/AA"
                maxLength={5}
                {...register('expiryDate', {
                  required: 'Fecha de vencimiento requerida',
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                    message: 'Formato inválido (MM/AA)'
                  }
                })}
                onChange={handleExpiryInput}
              />
              {errors.expiryDate && <small className="error">{errors.expiryDate.message}</small>}
            </div>
          </div>

          <button type="submit" className="next-step-button">Siguiente Paso</button>
        </form>
      ) : (
        <form className="input-fields-group security-code-group" onSubmit={handleSubmit(onSubmitBack)}>
          <button
            type="button"
            className="back-button"
            onClick={() => setShowBack(false)}
            style={{ marginBottom: '1rem' }}
          >
            ← Volver
          </button>

          <div className="input-field full-width">
            <label htmlFor="securityCode">Números de seguridad</label>
            <input
              id="securityCode"
              maxLength={3}
              {...register('securityCode', {
                required: 'Código de seguridad requerido',
                pattern: {
                  value: /^\d{3}$/,
                  message: 'Debe tener 3 dígitos'
                }
              })}
            />
            {errors.securityCode && <small className="error">{errors.securityCode.message}</small>}
          </div>

          <button type="submit" className="finish-purchase-button">Finalizar Compra</button>
        </form>
      )}
    </div>
    </div>
  );
};

export default Pay;
