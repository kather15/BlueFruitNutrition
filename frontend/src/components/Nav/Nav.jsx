import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import { FiUser } from 'react-icons/fi';  
import './Nav.css';

const Nav = () => {
  const navigate = useNavigate(); // Hook para navegación programática

  const handleProfileClick = () => {
    navigate('/perfil'); // Navega a la ruta perfil
  };

  return (
    <nav className="blue-fruit-main-navbar">
      <div className="blue-fruit-navbar-container">
        <div className="blue-fruit-navbar-left">
          <div className="blue-fruit-logo">
            <img src="/Logo_Blue_Fruit.png" alt="Blue Fruit" />
          </div>
          <ul className="blue-fruit-nav-menu">
            <li><Link to="/homep">Inicio</Link></li>
            <li><Link to="/productos1">Productos</Link></li>
            <li><Link to="/ordenes">Órdenes</Link></li>
            <li><Link to="/ventas">Ventas</Link></li>
            <li><Link to="/suscripciones">Suscripciones</Link></li>
            <li><Link to="/usuarios">Usuarios</Link></li>
          </ul>
        </div>

        <div className="blue-fruit-navbar-right">
          <button
            className="blue-fruit-profile-btn"
            title="Perfil"
            aria-label="Perfil"
            onClick={handleProfileClick}  // Evento click navega
          >
            <FiUser className="blue-fruit-profile-icon" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
