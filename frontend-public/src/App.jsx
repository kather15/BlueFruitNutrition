import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/useAuth';

// Components
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/PrivateRoute/PrivateRoute';

// Pages - Públicas
import Home from './pages/Home/Home';
import ProductsMenu from './pages/Products/ProductsMenu';
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

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        
        <Nav />
        
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<ProductsMenu />} />
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
        </Routes>
        
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
