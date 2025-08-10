import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/useAuth';

// Components
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/PrivateRoute/PrivateRoute';

// Pages - Públicas
import Home from './pages/Home/Home';
import ProductsC from './pages/Products/ProductsC';
import ProductsReview from './pages/Products/ProductsReview';
import Historia from './pages/Historia/Historia';
import Contact from './components/Contact/Contact';

// Pages - Autenticación
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import RequestCode from './pages/RecoveryPassword/RequestCode';
import VerifyCode from './pages/RecoveryPassword/VerifyCode';
import NewPassword from './pages/RecoveryPassword/NewPasssword';

// Pages - Privadas
import Carrito from './pages/Carrito/Carrito';
import Pay from './pages/Pay/pay';
import SeleccionarGel from './pages/Personalizar/SeleccionarGel';
import SaborPage from './pages/Personalizar/Sabores/SaborPage';
import ProductDetail from './pages/Personalizar/productGallery/Product';
import Suscripciones from './pages/Suscripciones/Suscripciones';
import MetodoDePago from './pages/MetodoDePago/CheckoutPage';
import Personalizar from './pages/Personalizar/SeleccionarGel/SeleccionDeGel';

function App() {
  const location = useLocation();

  // Rutas donde ocultar Nav y Footer
  const hideNavFooterRoutes = ['/login', '/registro'];
  const hideNavFooter = hideNavFooterRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      {/* Toaster con estilo de la rama Rodri */}
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
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ProductsC />} />
        <Route path="/producto/:id" element={<ProductsReview />} />
        <Route path="/sobre-nosotros" element={<Historia />} />
        <Route path="/contact" element={<Contact />} />

        {/* RUTAS DE AUTENTICACIÓN */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/enviar-codigo" element={<RequestCode />} />
        <Route path="/verificar-codigo" element={<VerifyCode />} />
        <Route path="/nueva-contraseña" element={<NewPassword />} />

        {/* RUTAS PRIVADAS */}
        <Route path="/carrito" element={<ProtectedRoute><Carrito /></ProtectedRoute>} />
        <Route path="/pay" element={<ProtectedRoute><Pay /></ProtectedRoute>} />
        <Route path="/gel" element={<ProtectedRoute><SeleccionarGel /></ProtectedRoute>} />
        <Route path="/sabores" element={<ProtectedRoute><SaborPage /></ProtectedRoute>} />
        <Route path="/detail" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
        <Route path="/suscripciones" element={<ProtectedRoute><Suscripciones /></ProtectedRoute>} />
        <Route path="/Metodo" element={<ProtectedRoute><MetodoDePago /></ProtectedRoute>} />
        <Route path="/personalizar" element={<ProtectedRoute><Personalizar /></ProtectedRoute>} />
      </Routes>

      {!hideNavFooter && <Footer />}
    </AuthProvider>
  );
}

export default App;
