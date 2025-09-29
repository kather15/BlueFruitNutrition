import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/useAuth"; // hook de sesión
import "./Carrito.css";

const Carrito = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  const { user, checkSession } = useAuthContext(); // obtenemos el usuario

  // Verificar sesión al abrir el carrito
  useEffect(() => {
    const verificarSesion = async () => {
      await checkSession(); // actualiza estado de sesión
      if (!user) {
        alert("Debes iniciar sesión para ver el carrito");
        navigate("/login");
      }
    };
    verificarSesion();
  }, [user, navigate, checkSession]);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setProductos(carritoGuardado);
  }, []);

  const actualizarCantidad = (id, nuevaCantidad) => {
    const actualizados = productos.map((producto) =>
      producto.id === id
        ? { ...producto, cantidad: parseInt(nuevaCantidad) || 1 }
        : producto
    );
    setProductos(actualizados);
    localStorage.setItem("carrito", JSON.stringify(actualizados));
  };

  const eliminarProducto = (id) => {
    const actualizados = productos.filter((producto) => producto.id !== id);
    setProductos(actualizados);
    localStorage.setItem("carrito", JSON.stringify(actualizados));
  };

  const calcularSubtotal = (producto) =>
    (producto.precio * producto.cantidad).toFixed(2);

  const total = productos
    .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
    .toFixed(2);

  const irAMetodoDePago = async () => {
    const orden = {
      numeroOrden: `ORD-${Date.now()}`,
      fecha: new Date().toLocaleDateString(),
      total: parseFloat(total),
      items: productos.reduce((acc, p) => acc + p.cantidad, 0),
      estado: "En proceso",
      productos: productos.map((p) => ({
        id: p.id.toString(),
        nombre: p.nombre,
        precio: p.precio,
        cantidad: p.cantidad,
      })),
    };

    try {
      const response = await fetch(
        "https://bluefruitnutrition-production.up.railway.app/api/ordenes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orden),
        }
      );

      if (response.ok) {
        alert("Orden enviada correctamente");

        // Guardar datos para la factura
        const datosCompra = {
          orden,
          productos,
          total: parseFloat(total),
          fecha: new Date().toISOString(),
        };
        localStorage.setItem("datosCompra", JSON.stringify(datosCompra));

        navigate("/metodo");
      } else {
        alert("Error al enviar la orden");
      }
    } catch (error) {
      console.error("Error al enviar la orden:", error);
      alert("Hubo un problema al conectar con el servidor.");
    }
  };

  // No renderizar carrito si no hay usuario
  if (!user) return null;

  return (
    <div className="carrito-container">
      <h1>Tu Carrito</h1>
      <div className="carrito">
        {productos.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                      <img src={producto.imagen} alt={producto.nombre} />
                      <span>{producto.nombre}</span>
                    </td>
                    <td>${producto.precio.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        value={producto.cantidad}
                        min="1"
                        onChange={(e) =>
                          actualizarCantidad(producto.id, e.target.value)
                        }
                      />
                    </td>
                    <td>${calcularSubtotal(producto)}</td>
                    <td>
                      <button onClick={() => eliminarProducto(producto.id)}>
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="resumen">
              <h2>Total del carrito</h2>
              <div className="linea">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="linea total">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <button className="checkout" onClick={irAMetodoDePago}>
                Check Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Carrito;
