import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
//import { AuthProvider } from './context/useAuth';

// Components
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
//import ProtectedRoute from './components/PrivateRoute/ProtectedRoute';
import Error404Private from './components/NotFound/NotFoundPrivate.jsx'; // 404 admin

// Pages - Login (público)
import Login from './pages/Login/Login';
import RequestCode from './pages/RecoveryPassword/RequestCode';
import VerifyCode from './pages/RecoveryPassword/VerifyCode';
import NewPassword from './pages/RecoveryPassword/NewPasssword';

// Pages - Admin (protegidas)
import HomeP from './pages/Home/homep';
import Products1 from './pages/Products/Products1';
import Suscripciones from './pages/Suscripcionees/Suscripcionees';
import Ordenes from './pages/Ordenes/Ordenes';
import Ventas from './pages/Ventas/Ventas.jsx';
import UsersList from './pages/Users/UsersList';
import UserForm from './pages/Users/UserForm';
import PerfilAdmin from './pages/AdminPorfile/PerfilAdmin';
import AddProducts from "./pages/AddProducts/AddProduct.jsx";
import ProductsReviews from "./pages/Products/ProductsReview.jsx";

function AppContent() {
  const location = useLocation();

  // Rutas donde NO mostrar Nav y Footer
  const hideLayoutRoutes = ['/', '/enviar-codigo', '/verificar-codigo', '/nueva-contraseña'];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
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
        containerStyle={{
          marginTop: '100px',
        }}
      />

      {!shouldHideLayout && <Nav />}

      <div className="main-content" style={{ paddingTop: !shouldHideLayout ? '100px' : '0' }}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/enviar-codigo" element={<RequestCode />} />
          <Route path="/verificar-codigo" element={<VerifyCode />} />
          <Route path="/nueva-contraseña" element={<NewPassword />} />

          {/* Rutas públicas (antes protegidas) */}
          <Route path="/home" element={<HomeP />} />
          <Route path="/homep" element={<HomeP />} />
          <Route path="/productos1" element={<Products1 />} />
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/suscripciones" element={<Suscripciones />} />
          <Route path="/usuarios" element={<UsersList />} />
          <Route path="/users/edit/:type/:id" element={<UserForm />} />
          <Route path="/perfil" element={<PerfilAdmin />} />
          <Route path="/addProduct" element={<AddProducts />} />
          <Route path="/product/:id" element={<ProductsReviews />} />



          {/* 404 admin */}
          <Route path="*" element={<Error404Private />} />
        </Routes>
      </div>

      {!shouldHideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
   
      <Router>
        <AppContent />
      </Router>
    
  );
}

export default App;

