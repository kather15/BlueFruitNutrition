import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/Nav/Nav';
import Footer from './components/Footer/Footer';

// Páginas principales
import addProduct from './pages/AddProducts/AddProduct.jsx';
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
import UserForm from './pages/Users/UserForm'; // 👈 faltaba esta




function App() {
  return (
    <Router>
      <NavBar />
      <div className="main-content" style={{ paddingTop: '100px' }}>
        <Routes>
          <Route path="/productos1" element={<Products1 />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/sobre-nosotros" element={<h1>Sobre Nosotros</h1>} />
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="/suscripciones" element={<Suscripciones />} />
          <Route path="/" element={<Homep />} />
          <Route path="/ordenes" element={<Ordenes />} />
          <Route path="/suscripciones" element={<Suscripciones />} />
          <Route path="/homep" element={<Homep />} />
                    <Route path="/enviar-codigo" element={<RequestCode/>}/>
                    <Route path="/verificar-codigo" element={<VerifyCode/>}/>
                    <Route path="/nueva-contraseña" element={<NewPassword/>}/>
                    <Route path="/ventas" element={<Ventas />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/users/edit/:type/:id" element={<UserForm />} /> {/* ✅ esta línea es clave */}s
          {/* Puedes agregar más rutas aquí */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
