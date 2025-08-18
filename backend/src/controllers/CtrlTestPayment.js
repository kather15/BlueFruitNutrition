// backend/src/controllers/CtrlTestPayment.js

export const testPayment = async (req, res) => {
  try {
    const { token, formData, userData, purchaseData } = req.body;

    console.log('💳 Procesando pago de prueba...');
    console.log('Token:', token ? 'Presente' : 'Ausente');
    console.log('Datos del formulario:', formData);
    console.log('Datos del usuario:', userData);
    console.log('Datos de compra:', purchaseData);

    // ✅ Validaciones básicas
    if (!formData) {
      return res.status(400).json({ error: "Datos de pago requeridos" });
    }

    // ✅ Simular diferentes tipos de respuesta según los datos
    const useRealWompi = false; // Cambia a true para usar Wompi real

    if (!useRealWompi) {
      // ✅ PAGO SIMULADO - Funciona siempre
      console.log('🎭 Usando pago simulado...');

      // Validar datos básicos del formulario
      if (!formData.cardNumber || !formData.cardHolder) {
        return res.status(400).json({
          error: "Datos de tarjeta incompletos",
          mensajes: ["El número de tarjeta es requerido", "El nombre del titular es requerido"]
        });
      }

      // Simular validación de tarjeta
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      
      // Rechazar tarjetas que terminan en 0000 (para simular errores)
      if (cardNumber.endsWith('0000')) {
        return res.status(400).json({
          error: "Tarjeta rechazada",
          mensajes: ["Fondos insuficientes", "La transacción fue declinada"]
        });
      }

      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generar respuesta exitosa
      const transactionId = `SIM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const authCode = Math.random().toString(36).substr(2, 6).toUpperCase();

      const response = {
        success: true,
        message: "Pago de prueba procesado exitosamente",
        transactionId,
        authorizationCode: authCode,
        amount: purchaseData?.total || 100,
        currency: "USD",
        status: "approved",
        timestamp: new Date().toISOString(),
        paymentMethod: "simulated",
        cardInfo: {
          lastFourDigits: cardNumber.slice(-4),
          cardType: getCardType(cardNumber),
          cardHolder: formData.cardHolder
        },
        orderInfo: {
          orderId: purchaseData?.orden?.numeroOrden || `ORD-${Date.now()}`,
          items: purchaseData?.productos?.length || 0,
          customerEmail: userData?.email || 'test@example.com'
        }
      };

      console.log('✅ Pago simulado exitoso:', response);
      return res.status(200).json(response);
    }

    // ✅ WOMPI REAL - Solo si useRealWompi = true
    console.log('🏦 Usando Wompi real...');

    if (!token) {
      return res.status(400).json({ error: "Token de acceso requerido para Wompi" });
    }

    // Formatear datos para Wompi
    const wompiData = {
      monto: Math.round((purchaseData?.total || 100) * 100), // Convertir a centavos
      email: userData?.email || formData.email || 'test@bluefruit.com',
      nombre: userData?.name || formData.cardHolder || 'Cliente Test',
      token: formData.cardNumber, // En producción esto debería ser un token de tarjeta
      descripcion: `Compra BlueFruit - ${purchaseData?.orden?.numeroOrden || 'TEST'}`,
      numeroOrden: purchaseData?.orden?.numeroOrden || `ORD-${Date.now()}`
    };

    console.log('📤 Enviando a Wompi:', wompiData);

    const paymentResponse = await fetch(
      "https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(wompiData),
      }
    );

    if (!paymentResponse.ok) {
      const error = await paymentResponse.text();
      console.error('❌ Error de Wompi:', error);
      return res.status(paymentResponse.status).json({ error });
    }

    const paymentData = await paymentResponse.json();
    console.log('✅ Respuesta de Wompi:', paymentData);
    res.json(paymentData);

  } catch (err) {
    console.error('❌ Error general en testPayment:', err);
    res.status(500).json({ 
      error: "Error al procesar el pago",
      details: err.message 
    });
  }
};

// ✅ Función auxiliar para detectar tipo de tarjeta
function getCardType(cardNumber) {
  const firstDigit = cardNumber.charAt(0);
  const firstTwoDigits = cardNumber.substr(0, 2);
  
  if (firstDigit === '4') return 'Visa';
  if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'Mastercard';
  if (['34', '37'].includes(firstTwoDigits)) return 'American Express';
  if (firstTwoDigits === '62') return 'UnionPay';
  
  return 'Unknown';
}