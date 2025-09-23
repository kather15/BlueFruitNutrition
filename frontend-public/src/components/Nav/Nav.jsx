import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi'; // agregamos FiUser
import './Nav.css';

const Nav = () => {
  return (
    <nav className="blue-fruit-main-navbar">
      <div className="blue-fruit-navbar-container">
        {/* Lado izquierdo */}
        <div className="blue-fruit-navbar-left">
          <div className="blue-fruit-logo">
            <img src="/Logo_Blue_Fruit.png" alt="Blue Fruit" />
          </div>
          <ul className="blue-fruit-nav-menu">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
            <li><Link to="/product">Productos</Link></li>
            <li><Link to="/carrito">Carrito</Link></li>
            <li><Link to="/personalizar">Personalizar</Link></li>
            {/*<li><Link to="/suscripciones">Suscripciones</Link></li>*/}
          </ul>
        </div>

        {/* Lado derecho */}
        <div className="blue-fruit-navbar-right">
          {/* Botón Carrito */}
          <Link to="/carrito" className="blue-fruit-icon-btn" aria-label="Carrito">
            <FiShoppingCart size={26} color="#fff" />
          </Link>

          {/* Botón Perfil 👤 */}
          <Link to="/perfil" className="blue-fruit-icon-btn profile-btn" aria-label="Perfil">
            <FiUser size={26} color="#fff" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
