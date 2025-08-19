import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import './Nav.css';
 
export default function Sidebar() {
  const navigate = useNavigate();
<<<<<<< HEAD

  const handleLogout = async () => {
    try {
      await fetch("https://bluefruitnutrition1.onrender.com/api/logout", {
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
=======
  const [isOpen, setIsOpen] = useState(false);
 
  const handleLogout = () => {
    navigate('/');
>>>>>>> a09778a12ccbb0f87b5db3ed41f92ffb7063334a
  };
 
  return (
    <>
      {/* Botón hamburguesa visible en mobile */}
      <button
        className="hamburger-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
 
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/Logo_Blue_Fruit.png" alt="Logo Blue Fruit" />
        </div>
 
        <ul className="sidebar-menu">
          <li><Link to="/homep">Inicio</Link></li>
          <li><Link to="/productos1">Productos</Link></li>
          <li><Link to="/ordenes">Órdenes</Link></li>
          <li><Link to="/ventas">Ventas</Link></li>
          {/*<li><Link to="/suscripciones">Suscripciones</Link></li>*/}
          <li><Link to="/usuarios">Usuarios</Link></li>
        </ul>
 
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} color="white" style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Cerrar Sesión
          </button>
        </div>
      </nav>
 
      {/* Overlay para cerrar menú al tocar fuera */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}
 