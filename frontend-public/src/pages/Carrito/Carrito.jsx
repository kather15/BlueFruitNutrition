import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importa el hook
import "./Carrito.css";

const productosIniciales = [
  {
    id: 1,
    nombre: "Sabor Azul",
    precio: 2.5,
    cantidad: 1,
    imagen: "/img/gel1.png",
  },
  {
    id: 2,
    nombre: "Sabor Rojo",
    precio: 2.5,
    cantidad: 2,
    imagen: "/img/gel2.png",
  },
  {
    id: 3,
    nombre: "Sabor Amarillo",
    precio: 2.5,
    cantidad: 3,
    imagen: "/img/gel3.png",
  },
];

const Carrito = () => {
  const [productos, setProductos] = useState(productosIniciales);
  const navigate = useNavigate(); // 👈 Hook para redirigir

  const actualizarCantidad = (id, nuevaCantidad) => {
    const actualizados = productos.map((producto) =>
      producto.id === id
        ? { ...producto, cantidad: parseInt(nuevaCantidad) || 1 }
        : producto
    );
    setProductos(actualizados);
  };

  const eliminarProducto = (id) => {
    setProductos(productos.filter((producto) => producto.id !== id));
  };

  const calcularSubtotal = (producto) =>
    (producto.precio * producto.cantidad).toFixed(2);

  const total = productos
    .reduce((acc, p) => acc + p.precio * p.cantidad, 0)
    .toFixed(2);

  const irAMetodoDePago = () => {
    navigate("/Metodo"); // 👈 Redirige a la ruta
  };

  return (
    <div className="carrito-container">
      <h1>Tu Carrito</h1>
      <div className="carrito">
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
      </div>
    </div>
  );
};

export default Carrito;
