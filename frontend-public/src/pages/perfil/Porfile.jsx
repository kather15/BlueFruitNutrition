import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Portfile.css";

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // 🔹 Obtener token de cookies
  const getTokenFromCookie = () => {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) return match[2];
    return null;
  };

  // 🔹 Decodificar JWT manualmente
  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1]; // parte central del JWT
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error("Error decodificando token:", error);
      return null;
    }
  };

  // 🔹 Cargar datos del usuario desde el token
  const loadUserFromToken = () => {
    const token = getTokenFromCookie();
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Sesión inválida, por favor inicia sesión de nuevo",
      });
      navigate("/login");
      return;
    }

    setUserData(decoded);
  };

  // 🔹 Cerrar sesión
  const handleLogout = async () => {
    try {
      const res = await fetch("https://bluefruitnutrition1.onrender.com/api/logout", {
        method: "POST",
        credentials: "include", // necesario para borrar cookie de sesión
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cerrar la sesión",
        });
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema con el servidor",
      });
    }
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  if (!userData) return <p>Cargando perfil...</p>;

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

            <div className="perfil-stats">
              <div>
                <span>{userData.orders || 0}</span>
                <p>Órdenes realizadas</p>
              </div>
              <div>
                <span>{userData.pending || 0}</span>
                <p>Productos pendientes</p>
              </div>
              <div>
                <span>{userData.delivered || 0}</span>
                <p>Pedidos entregados</p>
              </div>
            </div>
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
        </section>
      </main>
    </div>
  );
};

export default Perfil;
