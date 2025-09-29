import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Portfile.css";

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const API_URL = "https://bluefruitnutrition1.onrender.com/api";

  const checkSession = async () => {
    try {
      const res = await fetch(`${API_URL}/check-session`, { method: "GET", credentials: "include" });
      if (!res.ok) throw new Error("Sesión inválida");
      const data = await res.json();
      setUserData(data);
      setFormData({ name: data.name, email: data.email, phone: data.phone || "", address: data.address || "" });
      fetchOrders(data.id);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/ordenes/user/${userId}`, { credentials: "include" });
      if (!res.ok) throw new Error("No se pudo cargar historial");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });
      if (res.ok) {
        setUserData(null);
        setOrders([]);
        Swal.fire({ icon: "success", title: "Sesión cerrada", timer: 1500 });
        navigate("/login");
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error en el servidor" });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al actualizar perfil");
      const updated = await res.json();
      setUserData(updated);
      setEditing(false);
      Swal.fire({ icon: "success", title: "Perfil actualizado", timer: 1500 });
    } catch (error) {
      Swal.fire({ icon: "error", title: error.message });
    }
  };

  useEffect(() => { checkSession(); }, []);

  if (loading) return <p>Cargando perfil...</p>;
  if (!userData) return null;

  return (
    <div className="dashboard-container">
      {/* Contenedor grande: Perfil */}
      <div className="profile-container">
        <h2>Mi Perfil</h2>
        <div className="profile-fields">
          <label>Nombre:</label>
          <input name="name" value={formData.name} onChange={handleInputChange} disabled={!editing} />
          
          <label>Email:</label>
          <input name="email" value={formData.email} onChange={handleInputChange} disabled={!editing} />
          
          <label>Teléfono:</label>
          <input name="phone" value={formData.phone} onChange={handleInputChange} disabled={!editing} />
          
          <label>Dirección:</label>
          <input name="address" value={formData.address} onChange={handleInputChange} disabled={!editing} />
        </div>
        <div className="profile-actions">
          {editing ? (
            <button onClick={handleSaveProfile}>Guardar</button>
          ) : (
            <button onClick={() => setEditing(true)}>Editar</button>
          )}
          <button className="logout-small" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>

      {/* Contenedor 2: Historial de órdenes */}
      <div className="orders-container">
        <h2>Historial de Órdenes</h2>
        {orders.length === 0 ? <p>No hay órdenes aún</p> :
          orders.map(order => (
            <div key={order._id} className="order-item">
              <p><strong>Orden #{order._id.slice(-6)}</strong></p>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
          ))
        }
      </div>

      {/* Contenedor 3: Placeholder */}
      <div className="extra-container">
        <h2>Información adicional</h2>
        <p>Aquí puedes mostrar saldo, cuentas, notificaciones, etc.</p>
      </div>
    </div>
  );
};

export default Perfil;
