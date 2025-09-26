import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { useAuthContext } from '../../context/useAuth'; // 👈 contexto de sesión
import './Nav.css';

const Nav = () => {
  const { isAuthenticated } = useAuthContext();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu((prev) => !prev);
  const closeMenu = () => setShowMenu(false);

  return (
    <nav className="blue-fruit-main-navbar">
      <div className="blue-fruit-navbar-container">
        {/* --- Lado izquierdo --- */}
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
          </ul>
        </div>

        {/* --- Lado derecho --- */}
        <div className="blue-fruit-navbar-right">
          {/* Botón Carrito */}
          <Link to="/carrito" className="blue-fruit-icon-btn" aria-label="Carrito">
            <FiShoppingCart size={26} color="#fff" />
          </Link>

          {/* Botón / Menú de Perfil */}
          <div className="blue-fruit-profile-wrapper">
            {isAuthenticated ? (
              // Si hay sesión → icono lleva directo al perfil
              <Link
                to="/perfil"
                className="blue-fruit-icon-btn profile-btn"
                aria-label="Perfil"
              >
                <FiUser size={26} color="#fff" />
              </Link>
            ) : (
              // Si NO hay sesión → desplegable
              <>
                <button
                  onClick={toggleMenu}
                  className="blue-fruit-icon-btn profile-btn"
                  aria-label="Menú de perfil"
                >
                  <FiUser size={26} color="#fff" />
                </button>

                {showMenu && (
                  <ul className="profile-dropdown">
                    <li>
                      <Link to="/login" onClick={closeMenu}>
                        Iniciar Sesión
                      </Link>
                    </li>
                    <li>
                      <Link to="/registro" onClick={closeMenu}>
                        Registrarse
                      </Link>
                    </li>
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
