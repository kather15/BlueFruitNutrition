import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Portfile.css";

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Verificar sesión en el servidor
  const checkSession = async () => {
    try {
     fetch("https://bluefruitnutrition1.onrender.com/api/check-session", {
  method: "GET",
  credentials: "include",
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

      if (!res.ok) throw new Error("Sesión inválida");

      const data = await res.json();
      setUserData(data); // data debería tener { id, email, name, role... }
    } catch (error) {
      navigate("/login"); // si no hay sesión
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cerrar sesión
  const handleLogout = async () => {
    try {
      const res = await fetch("https://bluefruitnutrition1.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
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
    checkSession();
  }, []);

  if (loading) return <p>Cargando perfil...</p>;
  if (!userData) return null; // si no hay datos, redirigido ya a login

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
        </section>
      </main>
    </div>
  );
};

export default Perfil;
