import fetch from "node-fetch";

// Controlador para pagos reales con autenticación 3DS

export const payment3ds = async (req, res) => {
  try {
    const { token, formData } = req.body;

    // Validaciones básicas
    if (!token) {
      return res.status(400).json({ error: "Token de acceso requerido" });
    }
    if (!formData) {
      return res.status(400).json({ error: "Datos de pago requeridos" });
    }

    // Realiza la transacción real con 3DS
    const response = await fetch("https://api.wompi.sv/TransaccionCompra/3Ds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    // Si la respuesta es inválida, retornamos el error
    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    // Devolvemos los datos de la transacción al frontend
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};
