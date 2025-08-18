// src/components/Nav/Nav.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { toast } from 'react-toastify'; // <-- Importa toast aquí
import './Nav.css';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      toast.error("Error al cerrar sesión");
      return;
    }

    localStorage.removeItem("token");
    toast.success("Sesión cerrada");

    // Redirige al puerto 5173
    window.location.href = "http://localhost:5173";
    
    // Alternativamente si fuese la misma app React en ese puerto:
    // navigate("/", { replace: true });
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <img src="/Logo_Blue_Fruit.png" alt="Logo Blue Fruit" />
      </div>

      <ul className="sidebar-menu">
        <li><Link to="/homep">Inicio</Link></li>
        <li><Link to="/productos1">Productos</Link></li>
        <li><Link to="/ordenes">Órdenes</Link></li>
        <li><Link to="/ventas">Ventas</Link></li>
        <li><Link to="/suscripciones">Suscripciones</Link></li>
        <li><Link to="/usuarios">Usuarios</Link></li>
      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} color="white" style={{ marginRight: 6, verticalAlign: 'middle' }} />
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}
