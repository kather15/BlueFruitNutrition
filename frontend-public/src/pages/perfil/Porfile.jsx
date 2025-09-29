import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Portfile.css";

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Verificar sesión en el servidor
  const checkSession = async () => {
    try {
      const res = await fetch(
  "https://bluefruitnutrition-production.up.railway.app/api/check-session",
  {
    method: "GET",
    credentials: "include", // 🔑 manda la cookie
  }
);

      if (!res.ok) throw new Error("Sesión inválida");

      const data = await res.json();
      setUserData(data);
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Cargar historial de órdenes del usuario
  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(
        `https://bluefruitnutrition-production.up.railway.app/api/ordenes/user/${userId}`,
        { credentials: "include" }
      );

      if (!res.ok) throw new Error("No se pudo cargar historial");

      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    }
  };

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      const res = await fetch(
        "https://bluefruitnutrition-production.up.railway.app/api/logout",
        { method: "POST", credentials: "include" }
      );

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con el servidor",
      });
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (userData?._id) {
      fetchOrders(userData._id);
    }
  }, [userData]);

  if (loading) return <p>Cargando perfil...</p>;
  if (!userData) return null;

  return (
    <div className="perfil-dashboard">
      <main className="perfil-main">
        <header className="perfil-header">
          <h1>Mi Perfil</h1>
          <p>Bienvenido de nuevo, {userData.name || "usuario"} 👋</p>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </header>

        <section className="perfil-content">
          <div className="perfil-card">
            <img src="/user.png" alt="Foto perfil" className="perfil-avatar" />
            <h2>{userData.name} {userData.lastName || ""}</h2>
            <p className="perfil-email">{userData.email}</p>
          </div>

          <div className="perfil-details">
            <h3>Detalles personales</h3>
            <p><strong>Nombre:</strong> {userData.name || userData.companyName}</p>
            {userData.lastName && <p><strong>Apellido:</strong> {userData.lastName}</p>}
            <p><strong>Email:</strong> {userData.email}</p>
            {userData.phone && <p><strong>Teléfono:</strong> {userData.phone}</p>}
            {userData.address && <p><strong>Dirección:</strong> {userData.address}</p>}
            {userData.dateBirth && (
              <p><strong>Nacimiento:</strong> {new Date(userData.dateBirth).toLocaleDateString()}</p>
            )}
            <p><strong>Verificado:</strong> {userData.isVerified ? "✅ Sí" : "❌ No"}</p>
          </div>

          {/* 🔹 Historial de órdenes */}
          <div className="perfil-orders">
            <h3>Historial de órdenes</h3>
            {orders.length === 0 ? (
              <p>No tienes órdenes registradas.</p>
            ) : (
              <ul>
                {orders.map((order) => (
                  <li key={order._id} className="order-item">
                    <strong>Orden:</strong> {order.numeroOrden} |{" "}
                    <strong>Fecha:</strong> {order.fecha} |{" "}
                    <strong>Estado:</strong> {order.estado} |{" "}
                    <strong>Total:</strong> ${order.total}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Perfil;
