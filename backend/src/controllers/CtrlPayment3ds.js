import fetch from "node-fetch";
import dotenv from "dotenv";

// Carga las variables de entorno
dotenv.config();

const ACCESS_TOKEN = process.env.WOMPI_ACCESS_TOKEN;

export const payment3ds = async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({ error: "Datos de pago requeridos" });
    }

    const response = await fetch("https://api.wompi.sv/TransaccionCompra/3Ds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar el pago" });
  }
};
