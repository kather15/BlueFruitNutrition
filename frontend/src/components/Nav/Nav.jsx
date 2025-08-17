// src/components/Nav/Nav.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import './Nav.css';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes limpiar tokens, etc.
    navigate('/');
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
