import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/useAuth';

// Components
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/PrivateRoute/ProtectedRoute';

// Pages - Login (público)
import Login from './pages/Login/Login';

// Pages - Admin (protegidas)
import HomeP from './pages/Home/homep';
import Products1 from './pages/Products/Products1';
import Ordenes from './pages/Ordenes/Ordenes';
import Ventas from './pages/Ventas/Ventas';
import Suscripciones from './pages/Suscripcionees/Suscripcionees';
import UsersList from './pages/Users/UsersList';
import UserForm from './pages/Users/UserForm';
import PerfilAdmin from './pages/AdminPorfile/PerfilAdmin';

// Recuperación de contraseña
import RequestCode from './pages/RecoveryPassword/RequestCode';
import VerifyCode from './pages/RecoveryPassword/VerifyCode';
import NewPassword from './pages/RecoveryPassword/NewPasssword';

function AppContent() {
  const location = useLocation();

  // Rutas donde NO mostrar Nav y Footer
  const hideLayoutRoutes = ['/', '/enviar-codigo', '/verificar-codigo', '/nueva-contraseña'];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {/* Toaster con estilo Rodri */}
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

          {/* 404 */}
          <Route path="*" element={
            <ProtectedRoute>
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                fontSize: '1.2rem',
                backgroundColor: '#f5f8fa',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  background: 'white',
                  padding: '3rem 4rem',
                  borderRadius: '15px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  maxWidth: '500px'
                }}>
                  <h2 style={{
                    color: '#0C133F',
                    marginBottom: '1rem',
                    fontSize: '1.8rem'
                  }}>
                    📄 Página no encontrada
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    La página de administración que buscas no existe.
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          } />
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

