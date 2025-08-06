import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes limpiar el token o sesión si lo usas
    localStorage.removeItem('token'); // Ejemplo: limpiar token
    navigate('/'); // Redirige al login sin recargar la página
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
          <div className="blue-fruit-search-container">
            <input
              type="text"
              placeholder="¿Qué estás buscando?"
              className="blue-fruit-search-input"
            />
            <button className="blue-fruit-search-btn">
              <img src="/Vector.png" alt="Buscar" />
            </button>
          </div>
          <button 
            className="blue-fruit-logout-btn" 
            onClick={handleLogout}
            title="Cerrar sesión"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

