import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Users, BarChart3 } from 'lucide-react';
import './Home.css';

const SportsGelAdmin = () => {
  const [activeTab, setActiveTab] = useState('productos');
  const [products, setProducts] = useState([
    { id: 1, nombre: 'Gel CarboUpp', sabor: 'Cítrico', precio: 2.50, stock: 150 },
    { id: 2, nombre: 'Gel Ener kik', sabor: 'Frutos Rojos', precio: 2.80, stock: 120 },
    { id: 3, nombre: 'Gel EnerBalance', sabor: 'Tropical', precio: 3.00, stock: 80 }
  ]);

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const TabButton = ({ tab, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`tab-button ${activeTab === tab ? 'active' : ''}`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  const ProductsTab = () => (
    <div className="tab-content">
      <div className="section-header">
        <h2>Gestión de Productos</h2>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-info">
              <h3>{product.nombre}</h3>
              <p className="flavor">Sabor: {product.sabor}</p>
              <div className="price-stock">
                <span className="price">${product.precio}</span>
                <span className={`stock ${product.stock < 100 ? 'low' : ''}`}>
                  Stock: {product.stock}
                </span>
              </div>
            </div>
            <div className="product-actions">
              <button className="btn-edit">
                <Edit size={16} />
              </button>
              <button 
                className="btn-delete"
                onClick={() => handleDeleteProduct(product.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const StatsTab = () => (
    <div className="tab-content">
      <h2>Estadísticas de Ventas</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">1,247</div>
          <div className="stat-label">Productos Vendidos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">$3,421</div>
          <div className="stat-label">Ingresos del Mes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">89</div>
          <div className="stat-label">Clientes Activos</div>
        </div>
      </div>
    </div>
  );

  const CustomersTab = () => (
    <div className="tab-content">
      <h2>Gestión de Clientes</h2>
      <div className="customers-list">
        <div className="customer-item">
          <div className="customer-info">
            <h4>Juan Pérez</h4>
            <span>juan@email.com</span>
          </div>
          <div className="customer-stats">
            <span>15 compras</span>
            <span>$127.50</span>
          </div>
        </div>
        <div className="customer-item">
          <div className="customer-info">
            <h4>María González</h4>
            <span>maria@email.com</span>
          </div>
          <div className="customer-stats">
            <span>8 compras</span>
            <span>$84.20</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-container">


      <nav className="admin-nav">
        <TabButton tab="productos" label="Productos" icon={Package} />
        <TabButton tab="estadisticas" label="Estadísticas" icon={BarChart3} />
        <TabButton tab="clientes" label="Clientes" icon={Users} />
      </nav>

      <main className="admin-main">
        {activeTab === 'productos' && <ProductsTab />}
        {activeTab === 'estadisticas' && <StatsTab />}
        {activeTab === 'clientes' && <CustomersTab />}
      </main>
    </div>
  );
};

export default SportsGelAdmin;