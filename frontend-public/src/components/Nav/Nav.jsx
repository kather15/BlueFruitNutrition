import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { useAuthContext } from "../../context/useAuth";
import "./Nav.css";

const Nav = () => {
  const { isAuthenticated } = useAuthContext();
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu((prev) => !prev);
  const closeMenu = () => setShowMenu(false);

  const location = useLocation(); // 👉 para saber qué ruta está activa

  return (
    <nav className="inwood-navbar">
      <div className="inwood-container">
        <div className="inwood-logo">
          <img src="/Logo_Blue_Fruit.png" alt="Blue Fruit" />
        </div>

        {/* --- Menú central --- */}
        <ul className="inwood-menu">
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/sobre-nosotros"
              className={location.pathname === "/sobre-nosotros" ? "active" : ""}
            >
              Sobre Nosotros
            </Link>
          </li>
          <li>
            <Link
              to="/product"
              className={location.pathname === "/product" ? "active" : ""}
            >
              Productos
            </Link>
          </li>
          <li>
            <Link
              to="/carrito"
              className={location.pathname === "/carrito" ? "active" : ""}
            >
              Carrito
            </Link>
          </li>
        </ul>

        {/* --- Íconos derecha --- */}
        <div className="inwood-icons">
          {/* --- Carrito --- */}
          <Link to="/carrito" className="icon-btn" aria-label="Carrito">
            <FiShoppingCart size={20} />
          </Link>

          {/* --- Perfil --- */}
          <div className="profile-wrapper">
            {isAuthenticated ? (
              <Link to="/perfil" className="icon-btn" aria-label="Perfil">
                <FiUser size={20} />
              </Link>
            ) : (
              <>
                <button
                  onClick={toggleMenu}
                  className="icon-btn"
                  aria-label="Menú perfil"
                >
                  <FiUser size={20} />
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
