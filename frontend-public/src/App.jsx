import { useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Nav from "./components/Nav/Nav";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Pay from "./pages/Pay/pay";
import Contact from "./pages/Contact/Contact"; 
import ProductC from "./pages/Products/ProductsC";
import Register from './pages/Register/Register'
import RequestCode from '../../frontend-public/src/pages/RecoveryPassword/RequestCode'
import VerifyCode from '../../frontend-public/src/pages/RecoveryPassword/VerifyCode';
import NewPassword from '../../frontend-public/src/pages/RecoveryPassword/NewPasssword';
import Personalizar from '../../frontend-public/src/pages/Personalizar/SeleccionarGel';
import Sabores from '../../frontend-public/src/pages/Personalizar/Sabores/SaborPage';
import Suscripciones from '../../frontend-public/src/pages/Suscripciones/Suscripciones';
import ProductDetail from '../../frontend-public/src/pages/Personalizar/productGallery/Product';
import Login from '../../frontend-public/src/pages/Login/Login'; 
import ProductsReview from "../src/pages/Products/ProductsReview";
import Carrito from '../src/pages/Carrito/Carrito.jsx'
import MetodoDePago from "../src/pages/MetodoDePago/CheckoutPage.jsx"



function App() {


  return (
    <>
    
      <Nav />
        
      <Routes>
        <Route path="/" element={<Home />} />
       <Route path="/pay" element={<Pay />} />
          <Route path="/registro" element={<Register />}/>
          <Route path="/enviar-codigo" element={<RequestCode/>}/>
          <Route path="/personalizar" element={<Personalizar/>}/>
          <Route path="/verificar-codigo" element={<VerifyCode/>}/>
          <Route path="/nueva-contraseña" element={<NewPassword/>}/>
          <Route path="/sabores" element={<Sabores/>}/>
          <Route path="/suscripciones" element={<Suscripciones />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/detail" element={<ProductDetail />} />
          <Route path="/carrito" element={<Carrito/>} />
          <Route path="/Metodo" element={<MetodoDePago/>} />



            <Route path="/product" element={<ProductC />} />
            <Route path="/producto/:id" element={<ProductsReview />} />
          {/* Puedes agregar más rutas aquí según sea necesario */}

      
        <Route path="/contact" element={<Contact/>} />
      
      </Routes>

      <Footer />
    </>
  );
}

export default App;