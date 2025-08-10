import { useState } from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 👈 importamos toast

import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Pay from "./pages/Pay/pay";
import Contact from "./pages/Contact/Contact"; 
import ProductC from "./pages/Products/ProductsC";
import Register from './pages/Register/Register';
import RequestCode from '../../frontend-public/src/pages/RecoveryPassword/RequestCode';
import VerifyCode from '../../frontend-public/src/pages/RecoveryPassword/VerifyCode';
import NewPassword from '../../frontend-public/src/pages/RecoveryPassword/NewPasssword';
import Suscripciones from '../../frontend-public/src/pages/Suscripciones/Suscripciones';
import Login from '../../frontend-public/src/pages/Login/Login'; 
import ProductsReview from "../src/pages/Products/ProductsReview";
import Carrito from '../src/pages/Carrito/Carrito.jsx';
import MetodoDePago from "../src/pages/MetodoDePago/CheckoutPage.jsx";
import Personalizar from '../src/pages/Personalizar/SeleccionarGel/SeleccionDeGel.jsx';

function App() {
  const location = useLocation();

  // Rutas donde ocultar Nav y Footer
  const hideNavFooterRoutes = ['/login', '/registro'];

  // Comprobar si la ruta actual requiere ocultar Nav/Footer
  const hideNavFooter = hideNavFooterRoutes.includes(location.pathname);

  return (
    <>
      {/* 👇 Toaster con mismo estilo que tu otra app */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#0C133F',
            color: '#fff',
            fontSize: '16px',
            zIndex: 99999,
          },
        }}
        containerStyle={{
          marginTop: '100px', 
        }}
      />

      {!hideNavFooter && <Nav />}
        
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/enviar-codigo" element={<RequestCode />} />
        <Route path="/verificar-codigo" element={<VerifyCode />} />
        <Route path="/nueva-contraseña" element={<NewPassword />} />
        <Route path="/suscripciones" element={<Suscripciones />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/Metodo" element={<MetodoDePago />} />
        <Route path="/product" element={<ProductC />} />
        <Route path="/producto/:id" element={<ProductsReview />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/personalizar" element={<Personalizar />} />
      </Routes>

      {!hideNavFooter && <Footer />}
    </>
  );
}

export default App;
