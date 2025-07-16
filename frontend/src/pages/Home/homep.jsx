import React, { useState, useEffect } from 'react';
import './home.css';
import { BarChart2, Package, Users, Plus, Edit, Trash2, Moon, Sun } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [darkMode, setDarkMode] = useState(false);

  // Estados de productos y clientes
  const [products, setProducts] = useState([
    { id: 1, name: 'Gel CarboUpp', flavor: 'Cítrico', price: 2.5, stock: 150 },
    { id: 2, name: 'Gel Ener Kik', flavor: 'Frutos Rojos', price: 2.8, stock: 120 },
    { id: 3, name: 'Gel EnerBalance', flavor: 'Tropical', price: 3.0, stock: 80 },
  ]);

  const [clients, setClients] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', purchases: 15, spent: 127.5 },
    { id: 2, name: 'María González', email: 'maria@email.com', purchases: 8, spent: 84.2 },
  ]);

  // Para edición/agregado
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', flavor: '', price: '', stock: '' });

  // Tema dark mode toggle
  const toggleTheme = () => setDarkMode(!darkMode);

  // Manejar cambios en formulario
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Guardar nuevo producto o edición
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.flavor || !form.price || !form.stock) return alert('Completa todos los campos');

    if (editingProduct) {
      // Editar
      setProducts(products.map(p => p.id === editingProduct.id ? {...form, id: editingProduct.id, price: +form.price, stock: +form.stock} : p));
      setEditingProduct(null);
    } else {
      // Agregar
      const newProduct = {
        ...form,
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
        price: +form.price,
        stock: +form.stock,
      };
      setProducts([...products, newProduct]);
    }
    setForm({ name: '', flavor: '', price: '', stock: '' });
  };

  // Borrar producto
  const handleDelete = id => {
    if (window.confirm('¿Eliminar producto?')) {
      setProducts(products.filter(p => p.id !== id));
      if (editingProduct && editingProduct.id === id) {
        setEditingProduct(null);
        setForm({ name: '', flavor: '', price: '', stock: '' });
      }
    }
  };

  // Editar producto
  const startEdit = product => {
    setEditingProduct(product);
    setForm({ name: product.name, flavor: product.flavor, price: product.price, stock: product.stock });
  };

  // Estadísticas básicas
  const totalSales = products.reduce((sum, p) => sum + (p.price * (p.stock > 100 ? 50 : 30)), 0).toFixed(2);
  const totalProducts = products.length;
  const activeClients = clients.length;

  return (
    <div className={`admin-panel ${darkMode ? 'dark' : 'light'}`}>
      <aside className="sidebar">
        <h2>BlueFruit Nutrition</h2>
        <button onClick={() => setActiveTab('products')} className={activeTab === 'products' ? 'active' : ''}>
          <Package /> Productos
        </button>
        <button onClick={() => setActiveTab('stats')} className={activeTab === 'stats' ? 'active' : ''}>
          <BarChart2 /> Estadísticas
        </button>
        <button onClick={() => setActiveTab('clients')} className={activeTab === 'clients' ? 'active' : ''}>
          <Users /> Clientes
        </button>
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? <Sun /> : <Moon />} Tema
        </button>
      </aside>

      <main className="main-content">
        {activeTab === 'products' && (
          <>
            <h1>Gestión de Productos</h1>
            <form className="product-form" onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
              />
              <input
                name="flavor"
                placeholder="Sabor"
                value={form.flavor}
                onChange={handleChange}
              />
              <input
                name="price"
                type="number"
                step="0.01"
                placeholder="Precio"
                value={form.price}
                onChange={handleChange}
              />
              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
              />
              <button type="submit">{editingProduct ? 'Actualizar' : 'Agregar'}</button>
              {editingProduct && <button type="button" onClick={() => { setEditingProduct(null); setForm({name:'',flavor:'',price:'',stock:''}) }}>Cancelar</button>}
            </form>
            <div className="products-list">
              {products.length === 0 && <p>No hay productos.</p>}
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <div>
                    <strong>{product.name}</strong> ({product.flavor})<br />
                    Precio: ${product.price.toFixed(2)} - Stock: {product.stock}
                  </div>
                  <div className="actions">
                    <button onClick={() => startEdit(product)} title="Editar"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(product.id)} title="Eliminar"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <h1>Estadísticas</h1>
            <div className="stats-cards">
              <div className="stat-card">
                <h2>{totalProducts}</h2>
                <p>Productos disponibles</p>
              </div>
              <div className="stat-card">
                <h2>${totalSales}</h2>
                <p>Ingresos estimados</p>
              </div>
              <div className="stat-card">
                <h2>{activeClients}</h2>
                <p>Clientes activos</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'clients' && (
          <>
            <h1>Clientes Registrados</h1>
            <div className="clients-list">
              {clients.length === 0 && <p>No hay clientes registrados.</p>}
              {clients.map(client => (
                <div key={client.id} className="client-card">
                  <div>
                    <strong>{client.name}</strong><br />
                    <small>{client.email}</small>
                  </div>
                  <div>
                    <p>Compras: {client.purchases}</p>
                    <p>Gastado: ${client.spent.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
