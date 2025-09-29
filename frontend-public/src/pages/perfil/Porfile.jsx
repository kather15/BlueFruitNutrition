import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FiEdit,
  FiSave,
  FiLogOut,
  FiUser,
  FiMail,
  FiPhone,
  FiPackage,
} from "react-icons/fi";
import "./Portfile.css";

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const API_URL = "https://bluefruitnutrition-production.up.railway.app/api";

  // ✅ Cargar sesión y datos
  const checkSession = async () => {
    try {
      const res = await fetch(`${API_URL}/session/auth/session`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Sesión inválida");
      const data = await res.json();
      setUserData(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
      });
      fetchOrders(data.id);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Traer órdenes del usuario
  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/ordenes/user/${userId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No se pudo cargar historial");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Guardar perfil
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
      setEditingProfile(false);
      Swal.fire({ icon: "success", title: "Perfil actualizado", timer: 1500 });
    } catch (error) {
      Swal.fire({ icon: "error", title: error.message });
    }
  };

  // ✅ Cerrar sesión
  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "¿Cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUserData(null);
        Swal.fire({ icon: "success", title: "Sesión cerrada", timer: 1500 });
        navigate("/login");
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error en el servidor" });
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (loading) return <p className="loading">Cargando perfil...</p>;
  if (!userData) return null;

  return (
    <div className="perfil-page">
      {/* 👤 Perfil */}
      <div className="perfil-left">
        <div className="perfil-card">
          <h2>
            <FiUser /> Mi Perfil
          </h2>
          <div className="perfil-fields">
            <label>
              <FiUser /> Nombre
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!editingProfile}
            />

            <label>
              <FiMail /> Email
            </label>
            <input name="email" value={formData.email} disabled />

            <label>
              <FiPhone /> Teléfono
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!editingProfile}
            />
          </div>

          <div className="perfil-actions">
            {editingProfile ? (
              <button className="btn-save" onClick={handleSaveProfile}>
                <FiSave /> Guardar
              </button>
            ) : (
              <button className="btn-edit" onClick={() => setEditingProfile(true)}>
                <FiEdit /> Editar
              </button>
            )}
            <button className="btn-logout" onClick={handleLogout}>
              <FiLogOut /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* 📦 Órdenes */}
      <div className="perfil-right">
        <div className="orders-card">
          <h2>
            <FiPackage /> Historial de Órdenes
          </h2>
          {orders.length === 0 ? (
            <p className="empty-orders">No hay órdenes aún</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-item">
                <div>
                  <strong>Orden #{order._id.slice(-6)}</strong>
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-info">
                  <span>Total: ${order.total.toFixed(2)}</span>
                  <span className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
