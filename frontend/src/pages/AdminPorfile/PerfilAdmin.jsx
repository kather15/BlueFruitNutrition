import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./PerfilAdmin.css";

const PerfilAdmin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Simulación de datos de ejemplo
        const exampleData = {
          nombre: "Ana Ramírez",
          email: "ana.ramirez@bluefruit.com",
          telefono: "+503 7123 4567",
          role: "Administrador"
        };

        // Simular un retardo y establecer los datos
        setTimeout(() => {
          setUser(exampleData);
          setFormData(exampleData);
          setLoading(false);
        }, 1000);

        // Para usar datos reales, descomenta lo siguiente:
        /*
        const res = await fetch("http://localhost:4000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al cargar perfil");
        const data = await res.json();
        setUser(data);
        setFormData(data);
        setLoading(false);
        */
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditToggle = () => {
    setEditMode(true);
    setFormData(user);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(user);
  };

  const handleSave = async () => {
    if (!formData.nombre?.trim() || !formData.email?.trim()) {
      toast.error("Nombre y correo son obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // Simular actualización con datos locales
      setUser(formData);
      setEditMode(false);
      toast.success("Perfil actualizado correctamente");

      // Para datos reales, descomenta esto:
      /*
      const res = await fetch("http://localhost:4000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Error al actualizar perfil");
      }
      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditMode(false);
      toast.success("Perfil actualizado");
      */
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (!user) return <p>Error cargando perfil.</p>;

  return (
    <div className="perfil-admin-wrapper">
      <h2>Perfil de Administrador</h2>
      <div className="perfil-admin-form">
        <label>Nombre:</label>
        {editMode ? (
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            type="text"
          />
        ) : (
          <p>{user.nombre}</p>
        )}

        <label>Email:</label>
        {editMode ? (
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
          />
        ) : (
          <p>{user.email}</p>
        )}

        <label>Teléfono:</label>
        {editMode ? (
          <input
            name="telefono"
            value={formData.telefono || ""}
            onChange={handleChange}
            type="tel"
          />
        ) : (
          <p>{user.telefono || "-"}</p>
        )}

        <label>Rol:</label>
        <p>{user.role || "Administrador"}</p>

        <div className="button-group">
          {editMode ? (
            <>
              <button className="btn-cancel" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSave}>
                Guardar
              </button>
            </>
          ) : (
            <>
              <button className="btn-edit" onClick={handleEditToggle}>
                Editar Perfil
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilAdmin;
