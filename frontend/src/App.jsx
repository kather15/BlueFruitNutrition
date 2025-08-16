import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context
import { AuthProvider } from "./context/useAuth";

// Components
import ProtectedRoute from "./components/PrivateRoute/ProtectedRoute";
import Nav from "./components/Nav/Nav";

// Pages
import RequestCode from "./pages/RecoveryPassword/RequestCode";
import VerifyCode from "./pages/RecoveryPassword/VerifyCode";
import NewPassword from "./pages/RecoveryPassword/NewPasssword";

import HomeP from "./pages/Home/homep";
import Products1 from "./pages/Products/Products1";
import Suscripciones from "./pages/Suscripcionees/Suscripcionees";
import Ordenes from "./pages/Ordenes/Ordenes";
import Ventas from "./pages/Ventas/Ventas.jsx";
import UsersList from "./pages/Users/UsersList";
import UserForm from "./pages/Users/UserForm";
import PerfilAdmin from "./pages/AdminPorfile/PerfilAdmin";
import AddProducts from "./pages/AddProducts/AddProduct.jsx";
import ProductsReviews from "./pages/Products/ProductsReview.jsx";

import Error404Private from "./components/NotFound/NotFoundPrivate.jsx";

// Context para temas (opcional)
export const ThemeContext = React.createContext(null);

function AppContent() {
  const location = useLocation();
  const [theme, setTheme] = useState("light"); // aún puedes usarlo si quieres

  // Rutas donde NO mostrar Nav (sidebar)
  const hideNavRoutes = ["/", "/enviar-codigo", "/verificar-codigo", "/nueva-contraseña"];
  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#0C133F",
            color: "#ffffffff",
            fontSize: "16px",
            zIndex: 99999,
          },
        }}
        containerStyle={{ marginTop: "100px" }}
      />

      {shouldHideNav ? (
        <div className="main-content" style={{ paddingTop: "20px" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/homep" replace />} />
            <Route path="/enviar-codigo" element={<RequestCode />} />
            <Route path="/verificar-codigo" element={<VerifyCode />} />
            <Route path="/nueva-contraseña" element={<NewPassword />} />
          </Routes>
        </div>
      ) : (
        <div className="app-layout">
          <Nav />
          <div className="main-content" style={{ marginLeft: "320px", paddingTop: "30px" }}>
            <Routes>
              <Route path="/" element={<Navigate to="/homep" replace />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomeP />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/homep"
                element={
                  <ProtectedRoute>
                    <HomeP />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/productos1"
                element={
                  <ProtectedRoute>
                    <Products1 />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ordenes"
                element={
                  <ProtectedRoute>
                    <Ordenes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ventas"
                element={
                  <ProtectedRoute>
                    <Ventas />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suscripciones"
                element={
                  <ProtectedRoute>
                    <Suscripciones />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/usuarios"
                element={
                  <ProtectedRoute>
                    <UsersList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/edit/:type/:id"
                element={
                  <ProtectedRoute>
                    <UserForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <PerfilAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addProduct"
                element={
                  <ProtectedRoute>
                    <AddProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute>
                    <ProductsReviews />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Error404Private />} />
            </Routes>
          </div>
        </div>
      )}
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
