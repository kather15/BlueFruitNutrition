import fetch from "node-fetch";

// Lógica para obtener un token de acceso desde Wompi

export const getToken = async (req, res) => {
  try {
    // Enviamos una solicitud POST al servidor de autenticación de Wompi
    const response = await fetch("https://id.wompi.sv/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: process.env.GRANT_TYPE,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        audience: process.env.AUDIENCE,
      }),
    });

    // Si hay error en la respuesta, la devolvemos como mensaje de error
    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    // Devolvemos el token recibido al frontend
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener token" });
  }
};
