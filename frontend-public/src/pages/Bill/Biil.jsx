import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/useAuth";
import toast from "react-hot-toast";
import "./Bill.css";

export default function CompraExitosa() {
  const { user } = useAuthContext();
  const [datosCompra, setDatosCompra] = useState(null);
  const [datosEnvio, setDatosEnvio] = useState(null);

  useEffect(() => {
    console.log('🔍 DEBUGGING BILL COMPONENT');
    console.log('Usuario logueado:', user);
    
    // Cargar datos de localStorage
    const compraRaw = localStorage.getItem("datosCompra");
    const envioRaw = localStorage.getItem("datosEnvio");
    
    console.log('📦 Datos compra raw:', compraRaw);
    console.log('📍 Datos envío raw:', envioRaw);
    
    if (compraRaw) {
      const compra = JSON.parse(compraRaw);
      setDatosCompra(compra);
      console.log('✅ Datos compra parseados:', compra);
    } else {
      console.log('❌ No hay datos de compra');
    }
    
    if (envioRaw) {
      const envio = JSON.parse(envioRaw);
      setDatosEnvio(envio);
      console.log('✅ Datos envío parseados:', envio);
    } else {
      console.log('❌ No hay datos de envío');
    }
  }, [user]);

  const handleDescargarFactura = () => {
    console.log('🔽 INICIANDO DESCARGA DE FACTURA');
    console.log('Usuario:', user);
    console.log('Datos compra:', datosCompra);
    console.log('Datos envío:', datosEnvio);

    if (!user) {
      toast.error("Error: Usuario no autenticado");
      console.error('❌ Usuario no autenticado');
      return;
    }

    if (!user.id) {
      toast.error("Error: ID de usuario no encontrado");
      console.error('❌ ID de usuario no encontrado');
      return;
    }

    try {
      // Construir datos para la factura
      const tipoUsuario = user.role === 'customer' ? 'cliente' : 'distribuidor';
      console.log('👤 Tipo de usuario:', tipoUsuario);
      
      const datosFactura = {
        productos: datosCompra?.productos || [
          { nombre: "Producto Test", cantidad: 1, precio: 50.00 }
        ],
        total: datosCompra?.total || 50.00,
        orden: datosCompra?.orden || { numeroOrden: 'TEST-' + Date.now() },
        datosEnvio: datosEnvio || { nombre: 'Cliente Test', direccionCompleta: 'Dirección Test' }
      };
      
      console.log('📄 Datos para factura:', datosFactura);

      // Construir URL
      const params = new URLSearchParams({
        userId: user.id,
        tipo: tipoUsuario,
        datosCompra: JSON.stringify(datosFactura)
      });
      
      const url = `http://localhost:4000/api/Bill/pdf?${params.toString()}`;
      console.log('🔗 URL completa:', url);
      
      // Intentar abrir en nueva ventana
      const newWindow = window.open(url, "_blank");
      
      if (newWindow) {
        console.log('✅ Ventana abierta correctamente');
        toast.success("Generando factura...");
      } else {
        console.log('❌ Falló al abrir ventana - posible bloqueo de popup');
        toast.error("Error: El navegador bloqueó la ventana emergente");
      }
      
    } catch (error) {
      console.error('❌ Error generando factura:', error);
      toast.error("Error al generar la factura: " + error.message);
    }
  };

  const handleEnviarCorreo = async () => {
    console.log('📧 INICIANDO ENVÍO DE EMAIL');
    
    if (!user) {
      toast.error("Error: Usuario no autenticado");
      return;
    }

    try {
      const tipoUsuario = user.role === 'customer' ? 'cliente' : 'distribuidor';
      
      const datosFactura = {
        productos: datosCompra?.productos || [
          { nombre: "Producto Test", cantidad: 1, precio: 50.00 }
        ],
        total: datosCompra?.total || 50.00,
        orden: datosCompra?.orden || { numeroOrden: 'TEST-' + Date.now() },
        datosEnvio: datosEnvio || { nombre: 'Cliente Test', direccionCompleta: 'Dirección Test' }
      };
      
      const payload = {
        userId: user.id,
        tipo: tipoUsuario,
        datosCompra: datosFactura
      };
      
      console.log('📤 Enviando payload:', payload);
      
      toast.loading("Enviando factura al correo...", { id: 'email' });
      
      const response = await fetch("http://localhost:4000/api/Bill/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log('📥 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Email enviado exitosamente:', result);
        toast.success("¡Factura enviada al correo exitosamente!", { id: 'email' });
      } else {
        const errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
        throw new Error(errorData.message || "Error al enviar la factura");
      }
    } catch (error) {
      console.error('❌ Error enviando factura:', error);
      toast.error("Error al enviar la factura: " + error.message, { id: 'email' });
    }
  };

  // Test para verificar que el backend responde
  const testBackend = async () => {
    try {
      console.log('🧪 Probando conexión con backend...');
      const response = await fetch('http://localhost:4000/api/Bill/pdf?test=true');
      console.log('🧪 Respuesta test:', response.status);
    } catch (error) {
      console.error('🧪 Error de conexión:', error);
    }
  };

  // Ejecutar test al cargar
  useEffect(() => {
    testBackend();
  }, []);

  return (
    <div className="compra-exitosa-container">
      <div className="card">
        <h1>¡Compra Exitosa!</h1>
        <p>Gracias por tu compra, {user?.email || 'usuario'}.</p>

        
        {/* Resumen de compra */}
        {datosCompra && (
          <div className="resumen-compra">
            <h3>Resumen de tu pedido:</h3>
            <p><strong>Número de orden:</strong> {datosCompra.orden?.numeroOrden || 'N/A'}</p>
            <p><strong>Total:</strong> ${datosCompra.total?.toFixed(2) || '0.00'}</p>
            
            {datosCompra.productos && datosCompra.productos.length > 0 && (
              <div className="productos-comprados">
                <h4>Productos:</h4>
                {datosCompra.productos.map((producto, index) => (
                  <div key={index} className="producto-item">
                    <span>{producto.nombre} x{producto.cantidad}</span>
                    <span>${(producto.precio * producto.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p>Puedes descargar tu factura o recibirla en tu correo.</p>
        
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