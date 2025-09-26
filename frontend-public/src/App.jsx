import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Context
import { AuthProvider, useAuthContext } from './context/useAuth';
import { CarritoProvider } from './context/CarritoContext';

// Components
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import Error404Public from './components/NotFound/NotFoundPublic';
import RutaPrivada from './components/PrivateRoute/PrivateRoute';

// Pages
import Home from './pages/Home/Home';
import ProductsMenu from './pages/Products/ProductsMenu';
import ProductsReview from './pages/Products/ProductsReview';
import SobreNosotros from './pages/SobreNosotros/SobreNosotros';
import Contact from './components/Contact/Contact';
import Suscripciones from './pages/Suscripciones/Suscripciones';
import ChatBot from './pages/ChatBot/ChatBot';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import RequestCode from './pages/RecoveryPassword/RequestCode';
import VerifyCode from './pages/RecoveryPassword/VerifyCode';
import NewPassword from './pages/RecoveryPassword/NewPasssword';
import Carrito from './pages/Carrito/Carrito';
import Pay from './pages/Pay/pay.jsx';
import MetodoDePago from './pages/MetodoDePago/CheckoutPage';
import Personalizar from './pages/Personalizar/SeleccionarGel/SeleccionDeGel';
import Bill from './pages/Bill/Biil';
import Perfil from "./pages/perfil/Porfile.jsx";

function AppContent() {
  const location = useLocation();
  const { user } = useAuthContext(); // obtenemos datos del usuario

  const hideNavFooterRoutes = ['/login', '/registro'];
  const hideNavFooter = hideNavFooterRoutes.includes(location.pathname);

  useEffect(() => {
    if (location.pathname === "/" && user) {
      Swal.fire({
        title: ` Bienvenido, ${user}!`,
        text: 'Explora nuestra tienda y descubre productos increíbles ',
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
      });
    }
  }, [location, user]);

  return (
    <>
      {!hideNavFooter && <Nav />}
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<ProductsMenu />} />
        <Route path="/producto/:id" element={<ProductsReview />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/suscripciones" element={<Suscripciones />} />
        <Route path="/chatbot" element={<ChatBot />} />

        {/* RUTAS DE AUTENTICACIÓN */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/enviar-codigo" element={<RequestCode />} />
        <Route path="/verificar-codigo" element={<VerifyCode />} />
        <Route path="/nueva-contraseña" element={<NewPassword />} />

        {/* RUTAS PRIVADAS */}
        <Route path="/carrito" element={<RutaPrivada><Carrito /></RutaPrivada>} />
        <Route path="/pay" element={<RutaPrivada><Pay /></RutaPrivada>} />
        <Route path="/Metodo" element={<RutaPrivada><MetodoDePago /></RutaPrivada>} />
        <Route path="/personalizar" element={<RutaPrivada><Personalizar /></RutaPrivada>} />
        <Route path="/bill" element={<RutaPrivada><Bill /></RutaPrivada>} />

      <Route path="/perfil" element={<Perfil />} />
        {/* 404 */}
        <Route path="*" element={<Error404Public />} />
      </Routes>
      {!hideNavFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <AppContent />
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;

//ok
