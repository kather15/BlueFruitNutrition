import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import './Nav.css';
 
export default function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
 
  const handleLogout = () => {
    navigate('/');
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
 
      {/* Overlay para cerrar menú al tocar fuera */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
}
 