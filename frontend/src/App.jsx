import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/useAuth';

// Components
import Nav from './components/Nav/Nav';
import Footer from './components/footer/footer';
import ProtectedRoute from './components/PrivateRoute/ProtectedRoute';

// Pages - Login (público)
import Login from './pages/Login/Login';

// Pages - Admin (todas protegidas)
import HomeP from './pages/Home/homep';
import Products1 from './pages/Products/Products1';
import Ordenes from './pages/Ordenes/Ordenes';
import Ventas from './pages/Ventas/Ventas';
import Suscripciones from './pages/Suscripcionees/Suscripcionees';
import UsersList from './pages/Users/UsersList';
import UserForm from './pages/Users/UserForm';

// Pages de recuperación
import RequestCode from './pages/RecoveryPassword/RequestCode';
import VerifyCode from './pages/RecoveryPassword/VerifyCode';
import NewPassword from './pages/RecoveryPassword/NewPasssword';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0C133F',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500'
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          
          {/* Recuperación de contraseña */}
          <Route path="/enviar-codigo" element={<RequestCode />} />
          <Route path="/verificar-codigo" element={<VerifyCode />} />
          <Route path="/nueva-contraseña" element={<NewPassword />} />

          {/* RUTAS ADMIN (PROTEGIDAS) */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Nav />
              <HomeP />
              <Footer />
            </ProtectedRoute>
          } />

          <Route path="/homep" element={
            <ProtectedRoute>
              <Nav />
              <HomeP />
              <Footer />
            </ProtectedRoute>
          } />

          <Route path="/productos1" element={
            <ProtectedRoute>
              <Nav />
              <Products1 />
              <Footer />
            </ProtectedRoute>
          } />

          <Route path="/ordenes" element={
            <ProtectedRoute>
              <Nav />
              <Ordenes />
              <Footer />
            </ProtectedRoute>
          } />

          <Route path="/ventas" element={
            <ProtectedRoute>
              <Nav />
              <Ventas />
              <Footer />
            </ProtectedRoute>
          } />

          <Route path="/suscripciones" element={
            <ProtectedRoute>
              <Nav />
              <Suscripciones />
              <Footer />
            </ProtectedRoute>
          } />

          <Route path="/usuarios" element={
            <ProtectedRoute>
              <Nav />
              <UsersList />
              <Footer />
            </ProtectedRoute>
          } />

          <Route path="/users/edit/:type/:id" element={
            <ProtectedRoute>
              <Nav />
              <UserForm />
              <Footer />
            </ProtectedRoute>
          } />

          {/* Ruta 404 protegida */}
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
    </AuthProvider>
  );
}

export default App;
