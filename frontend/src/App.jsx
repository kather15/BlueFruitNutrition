import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/useAuth';

// Components
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/PrivateRoute/ProtectedRoute';
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

          {/* Rutas protegidas */}
          <Route path="/home" element={<ProtectedRoute><HomeP /></ProtectedRoute>} />
          <Route path="/homep" element={<ProtectedRoute><HomeP /></ProtectedRoute>} />
          <Route path="/productos1" element={<ProtectedRoute><Products1 /></ProtectedRoute>} />
          <Route path="/ordenes" element={<ProtectedRoute><Ordenes /></ProtectedRoute>} />
          <Route path="/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />
          <Route path="/suscripciones" element={<ProtectedRoute><Suscripciones /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
          <Route path="/users/edit/:type/:id" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><PerfilAdmin /></ProtectedRoute>} />

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
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

