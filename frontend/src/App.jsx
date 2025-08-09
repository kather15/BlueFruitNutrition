import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import NavBar from './components/Nav/Nav';
import Footer from './components/Footer/Footer';

// Páginas principales
import AddProduct from './pages/AddProducts/AddProduct';
import Products1 from './pages/Products/Products1';
import Suscripciones from './pages/Suscripcionees/Suscripcionees';
import Ordenes from './pages/Ordenes/Ordenes';
import Homep from './pages/Home/Homep';
import RequestCode from './pages/RecoveryPassword/RequestCode';
import VerifyCode from './pages/RecoveryPassword/VerifyCode';
import NewPassword from './pages/RecoveryPassword/NewPasssword';
import Ventas from './pages/Ventas/Ventas.jsx';
import Usuarios from './pages/Users/UsersList.jsx';
import Login from './pages/Login/Login.jsx'; 
import Error404Private from './components/NotFound/NotFoundPrivate.jsx'; // ⬅ IMPORTACIÓN


// Componente envolvente para manejar Nav y Footer
function AppContent() {
  const location = useLocation();

  // Rutas donde NO quieres que aparezcan el NavBar y el Footer
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

      {/* Mostrar NavBar solo si no está en las rutas ocultas */}
      {!shouldHideLayout && <NavBar />}

      <div className="main-content" style={{ paddingTop: !shouldHideLayout ? '100px' : '0' }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/productos1" element={<Products1 />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="/suscripciones" element={<Suscripciones />} />
          <Route path="/home" element={<Homep />} />
          <Route path="/homep" element={<Homep />} />
          <Route path="/enviar-codigo" element={<RequestCode />} />
          <Route path="/verificar-codigo" element={<VerifyCode />} />
          <Route path="/nueva-contraseña" element={<NewPassword />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/usuarios" element={<Usuarios />} />

           {/* Ruta comodín para páginas no encontradas */}
          <Route path="*" element={<Error404Private />} />

        </Routes>
      </div>

      {/* Mostrar Footer solo si no está en las rutas ocultas */}
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

export default App;
