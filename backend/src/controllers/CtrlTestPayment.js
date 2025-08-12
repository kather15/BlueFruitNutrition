import fetch from "node-fetch";

// Controlador para realizar un pago de prueba sin autenticación 3DS

export const testPayment = async (req, res) => {
  try {
    const { token, formData } = req.body;

    // Validaciones básicas
    if (!token) {
      return res.status(400).json({ error: "Token de acceso requerido" });
    }
    if (!formData) {
      return res.status(400).json({ error: "Datos de pago requeridos" });
    }

    // Realiza la transacción de prueba hacia Wompi
    const paymentResponse = await fetch(
      "https://api.wompi.sv/TransaccionCompra/TokenizadaSin3Ds",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Usa el token como autorización
        },
        body: JSON.stringify(formData),
      }
    );

    // Manejo de errores
    if (!paymentResponse.ok) {
      const error = await paymentResponse.text();
      return res.status(paymentResponse.status).json({ error });
    }

    // Respuesta del pago
    const paymentData = await paymentResponse.json();
    res.json(paymentData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};
