import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingCart } from 'react-icons/fi';
import './Nav.css';

const Nav = () => {
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const profileRef = useRef(null);
  const cartRef = useRef(null);

  const cartItems = [
    { id: 1, name: "Manzana Roja", image: "/products/apple.png" },
    { id: 2, name: "Arándano", image: "/products/blueberry.png" }
  ];

  // Cierra menús si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          </ul>
        </div>

        {/* Lado derecho */}
        <div className="blue-fruit-navbar-right">
          {/* Botón Perfil */}
          <div className="blue-fruit-icon-wrapper" ref={profileRef}>
            <button
              className="blue-fruit-icon-btn"
              aria-haspopup="true"
              aria-expanded={profileOpen}
              onClick={() => {
                setProfileOpen(!profileOpen);
                setCartOpen(false); // cerrar carrito si abierto
              }}
              aria-label="Perfil"
            >
              <FiUser size={26} color="#fff" />
            </button>
            {profileOpen && (
              <div className="dropdown-menu">
                {user ? (
                  <>
                    <Link to="/perfil">Mi Perfil</Link>
                    <button onClick={() => { setUser(null); setProfileOpen(false); }}>
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setProfileOpen(false)}>Iniciar sesión</Link>
                    <Link to="/registro" onClick={() => setProfileOpen(false)}>Registrarse</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Botón Carrito */}
          <div className="blue-fruit-icon-wrapper" ref={cartRef}>
            <button
              className="blue-fruit-icon-btn"
              aria-haspopup="true"
              aria-expanded={cartOpen}
              onClick={() => {
                setCartOpen(!cartOpen);
                setProfileOpen(false); // cerrar perfil si abierto
              }}
              aria-label="Carrito"
            >
              <FiShoppingCart size={26} color="#fff" />
            </button>
            {cartOpen && (
              <div className="cart-preview">
                {cartItems.length > 0 ? (
                  <>
                    {cartItems.map(item => (
                      <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                    <div className="cart-preview-buttons" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <Link to="/carrito" className="cart-btn" onClick={() => setCartOpen(false)}>Ver Carrito</Link>
                      <Link to="/checkout" className="cart-btn primary" onClick={() => setCartOpen(false)}>Ir a Pagar</Link>
                    </div>
                  </>
                ) : (
                  <p>Carrito vacío</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
