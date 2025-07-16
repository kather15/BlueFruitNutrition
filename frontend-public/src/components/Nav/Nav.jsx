import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';

const Nav= () => {
  return (
    <nav className="blue-fruit-main-navbar">
      <div className="blue-fruit-navbar-container">
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
        </div>
      </div>
    </nav>
  );
};

export default Nav;