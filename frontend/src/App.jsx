import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider } from "./context/useAuth";

// Components
import Nav from './components/Nav/Nav';


import ProtectedRoute from './components/PrivateRoute/ProtectedRoute';
import Error404Private from './components/NotFound/NotFoundPrivate.jsx';
import Location from "./components/Maps/Maps.jsx"; 


// Pages - Login (público)
import RequestCode from './pages/RecoveryPassword/RequestCode';
import VerifyCode from './pages/RecoveryPassword/VerifyCode';
import NewPassword from './pages/RecoveryPassword/NewPasssword';

// Pages - Admin
import HomeP from "./pages/Home/homep";
import Products1 from "./pages/Products/Products1";
import Suscripciones from "./pages/Suscripcionees/Suscripcionees";
import Ordenes from "./pages/Ordenes/Ordenes";
import ResumenOrden from "./pages/ResumenOrdenes/ResumenOrden";
import Ventas from "./pages/Ventas/Ventas.jsx";
import UsersList from "./pages/Users/UsersList";
import UserForm from "./pages/Users/UserForm";
import PerfilAdmin from "./pages/AdminPorfile/PerfilAdmin";
import AddProducts from "./pages/AddProducts/AddProduct.jsx";
import ProductsReviews from "./pages/Products/ProductsReview.jsx";


// Context para temas
export const ThemeContext = React.createContext(null);

function AppContent() {
  const location = useLocation();
  const [theme, setTheme] = useState("light");

  // Rutas donde NO mostrar Nav
  const hideNavRoutes = ["/", "/login", "/enviar-codigo", "/verificar-codigo", "/nueva-contraseña"];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#0C133F",
            color: "#fff",
            fontSize: "16px",
            zIndex: 99999,
          },
        }}
        containerStyle={{ marginTop: "100px" }}
      />

      {!shouldHideNav && <Nav />}

      {/* main-content con clase condicional para centrado */}
      <div className={`main-content ${shouldHideNav ? "no-sidebar" : ""}`}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/homep" replace />} />

          <Route path="/enviar-codigo" element={<RequestCode />} />
          <Route path="/verificar-codigo" element={<VerifyCode />} />
          <Route path="/nueva-contraseña" element={<NewPassword />} />

          {/* Rutas protegidas */}
          <Route path="/home" element={<ProtectedRoute><HomeP /></ProtectedRoute>} />
          <Route path="/homep" element={<ProtectedRoute><HomeP /></ProtectedRoute>} />
          <Route path="/productos1" element={<ProtectedRoute><Products1 /></ProtectedRoute>} />
          <Route path="/ordenes" element={<ProtectedRoute><Ordenes /></ProtectedRoute>} />
          <Route path="/ordenes/:id" element={<ProtectedRoute><ResumenOrden /></ProtectedRoute>} />
          <Route path="/ventas" element={<ProtectedRoute><Ventas /></ProtectedRoute>} />
          <Route path="/suscripciones" element={<ProtectedRoute><Suscripciones /></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
          <Route path="/users/edit/:type/:id" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><PerfilAdmin /></ProtectedRoute>} />
          <Route path="/addProduct" element={<ProtectedRoute><AddProducts /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductsReviews /></ProtectedRoute>} />
          <Route path="/location" element={<ProtectedRoute><Location /></ProtectedRoute>} />


          {/* 404 admin */}
          <Route path="*" element={<Error404Private />} />
        </Routes>
      </div>
    </ThemeContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
