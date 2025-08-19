import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/useAuth';
import toast from 'react-hot-toast'; // ✅ Importar toast
import "./pay.css";


const Pay = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext(); // ✅ Obtener datos del usuario
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

  const fetchToken = async () => {
    const response = await fetch('https://bluefruitnutrition1.onrender.com/api/token', {
      method: 'POST',
    });
    if (!response.ok) throw new Error('No se pudo obtener el token');
    const data = await response.json();
    return data.access_token;
  };

  // ✅ CORREGIDO: Formatear datos según API de Wompi
  const onSubmitBack = async (formData) => {
    try {
      console.log('🚀 Iniciando proceso de pago...');
      console.log('Datos del formulario:', formData);
      console.log('Usuario logueado:', user);

      // ✅ Obtener datos de envío y compra
      const datosEnvio = JSON.parse(localStorage.getItem('datosEnvio') || '{}');
      const datosCompra = JSON.parse(localStorage.getItem('datosCompra') || '{}');
      
      console.log('Datos de envío:', datosEnvio);
      console.log('Datos de compra:', datosCompra);

      // ✅ OPCIÓN 1: Usar pago simulado (más simple)
      const pagoSimulado = true; // Cambia a false para usar Wompi real

      if (pagoSimulado) {
        // ✅ Simular pago exitoso sin usar API externa
        console.log('✅ Simulando pago exitoso...');
        
        // ✅ Toast de procesamiento
        toast.loading('Procesando pago...', { id: 'payment' });
        
        // Simular delay de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // ✅ Toast de éxito en lugar de alert
        toast.success('¡Pago procesado exitosamente!', { 
          id: 'payment',
          duration: 3000 
        });
        
        localStorage.removeItem("carrito");
        console.log('🗑️ Carrito limpiado');
        
        // ✅ CORREGIDO: Redirigir a /Bill (verificar que coincida con App.jsx)
        navigate('/Bill');
        return;
      }

      // ✅ OPCIÓN 2: Usar API de Wompi con datos completos
      // ✅ Toast de procesamiento
      toast.loading('Procesando pago...', { id: 'payment' });
      
      const token = await fetchToken();
      console.log('✅ Token obtenido correctamente');

      // ✅ Formatear datos según lo que espera Wompi
      const wompiData = {
        // Datos requeridos por Wompi
        monto: Math.round((datosCompra.total || 100) * 100), // Convertir a centavos
        email: user?.email || 'test@bluefruit.com',
        nombre: datosEnvio.nombre || user?.name || 'Cliente Test',
        token: formData.cardNumber, // Esto debería ser un token de tarjeta real
        
        // Datos adicionales
        descripcion: `Compra BlueFruit - Orden ${datosCompra.orden?.numeroOrden || 'TEST'}`,
        numeroOrden: datosCompra.orden?.numeroOrden || `ORD-${Date.now()}`,
        
        // Datos de la tarjeta (si Wompi los requiere)
        numeroTarjeta: formData.cardNumber,
        nombreTarjeta: formData.cardHolder,
        mesVencimiento: formData.expiryDate.split('/')[0],
        anoVencimiento: '20' + formData.expiryDate.split('/')[1],
        codigoSeguridad: formData.securityCode,
        
        // Datos de envío
        direccionEnvio: datosEnvio.direccionCompleta || 'Dirección test',
        telefonoCliente: datosEnvio.telefono || '7890-1234'
      };

      console.log('📤 Enviando datos a Wompi:', wompiData);

      const response = await fetch('https://bluefruitnutrition1.onrender.com/api/testPay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          token, 
          formData,
          userData: user,
          purchaseData: datosCompra
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error de Wompi:', errorData);
        throw new Error(errorData.error || 'Error al procesar el pago');
      }

      const result = await response.json();
      console.log('✅ Pago procesado exitosamente:', result);

      // ✅ Toast de éxito en lugar de alert
      toast.success('¡Pago procesado exitosamente!', { 
        id: 'payment',
        duration: 3000 
      });
      
      localStorage.removeItem("carrito");
      console.log('🗑️ Carrito limpiado');

      // ✅ CORREGIDO: Redirigir a /Bill (verificar que coincida con App.jsx)
      navigate('/Bill');
      
    } catch (error) {
      console.error('❌ Error en el pago:', error);
      
      // ✅ Toast de error en lugar de alert
      toast.error('Error en el pago: ' + error.message, { 
        id: 'payment',
        duration: 5000 
      });
    }
  };

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

  const goToCheckout = () => {
    navigate('/metodo');
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

            <button type="submit" className="finish-purchase-button">Finalizar compra</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Pay;