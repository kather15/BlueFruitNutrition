import React from "react";
import "./Bill.css";

export default function CompraExitosa() {
  const handleDescargarFactura = () => {
    // Aquí llamas a tu backend para obtener la factura como PDF
    window.open("http://localhost:4000/api/Bill/pdf", "_blank");
  };

  const handleEnviarCorreo = async () => {
    try {
      await fetch("http://localhost:4000/api/Bill/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "12345" }), // id del cliente o carrito
      });
      alert("Factura enviada al correo!");
    } catch (error) {
      console.error(error);

    }
  };

  return (
    <div className="compra-exitosa-container">
      <div className="card">
        <h1>Compra Exitosa</h1>
        <p>Gracias por tu compra. Puedes descargar tu factura o recibirla en tu correo.</p>
        <div className="buttons">
          <button className="btn descargar" onClick={handleDescargarFactura}>
            Descargar Factura
          </button>
          <button className="btn correo" onClick={handleEnviarCorreo}>
            Enviar al Correo
          </button>
        </div>
      </div>
    </div>
  );
}
