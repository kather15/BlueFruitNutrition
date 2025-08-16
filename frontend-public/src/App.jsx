import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/useAuth';
import { CarritoProvider } from "./context/CarritoContext";

// Components
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import Error404Public from './components/NotFound/NotFoundPublic';

// Pages - Públicas
import Home from './pages/Home/Home';
import ProductsMenu from './pages/Products/ProductsMenu';
import ProductsReview from './pages/Products/ProductsReview';
import SobreNosotros from './pages/SobreNosotros/SobreNosotros';
import Contact from './components/Contact/Contact';
import Suscripciones from './pages/Suscripciones/Suscripciones';

// Pages - Autenticación
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import RequestCode from './pages/RecoveryPassword/RequestCode';
import VerifyCode from './pages/RecoveryPassword/VerifyCode';
import NewPassword from './pages/RecoveryPassword/NewPasssword';

// Pages - Privadas (temporales públicas)
import Carrito from './pages/Carrito/Carrito';
import Pay from './pages/Pay/pay';
import MetodoDePago from './pages/MetodoDePago/CheckoutPage';
import Personalizar from './pages/Personalizar/SeleccionarGel/SeleccionDeGel';

function App() {
  const location = useLocation();

  // Ocultar Nav/Footer en login y registro
  const hideNavFooterRoutes = ['/login', '/registro'];
  const hideNavFooter = hideNavFooterRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <CarritoProvider>
        <>
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
            containerStyle={{ marginTop: '100px' }}
          />

          {!hideNavFooter && <Nav />}

          <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<ProductsMenu />} />
            <Route path="/producto/:id" element={<ProductsReview />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/suscripciones" element={<Suscripciones />} />

            {/* RUTAS DE AUTENTICACIÓN */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/enviar-codigo" element={<RequestCode />} />
            <Route path="/verificar-codigo" element={<VerifyCode />} />
            <Route path="/nueva-contraseña" element={<NewPassword />} />

            {/* RUTAS PRIVADAS (temporalmente públicas) */}
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/Metodo" element={<MetodoDePago />} />
            <Route path="/personalizar" element={<Personalizar />} />

            {/* 404 */}
            <Route path="*" element={<Error404Public />} />
          </Routes>

          {!hideNavFooter && <Footer />}
        </>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
