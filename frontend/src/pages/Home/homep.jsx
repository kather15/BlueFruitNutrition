import React, { useState, useEffect, useMemo } from 'react';
import './home.css';
import { BarChart2, Package, Users, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_PRODUCTS = 'http://localhost:4000/api/products';
const API_CUSTOMERS = 'http://localhost:4000/api/customers';
const API_DISTRIBUTORS = 'http://localhost:4000/api/distributors';
const API_ORDENES_EN_PROCESO = 'http://localhost:4000/api/ordenes/en-proceso/total';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', flavor: '', price: '', stock: '' });
  const [clientSearch, setClientSearch] = useState('');
  const [clientRoleFilter, setClientRoleFilter] = useState('all');
  const [ordersInProcess, setOrdersInProcess] = useState(0);

  // Función para obtener productos
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_PRODUCTS);
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      const normalized = data.map(p => ({ ...p, id: p.id ?? p._id }));
      setProducts(normalized);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Función para obtener clientes y distribuidores
  const fetchClientsAndDistributors = async () => {
    try {
      const [resCustomers, resDistributors] = await Promise.all([
        fetch(API_CUSTOMERS),
        fetch(API_DISTRIBUTORS),
      ]);
      if (!resCustomers.ok || !resDistributors.ok)
        throw new Error('Error al obtener clientes o distribuidores');

      const customers = await resCustomers.json();
      const distributors = await resDistributors.json();

      const customersWithRole = customers.map(c => ({
        ...c,
        role: 'customer',
        id: c.id ?? c._id,
      }));
      const distributorsWithRole = distributors.map(d => ({
        ...d,
        role: 'distributor',
        id: d.id ?? d._id,
      }));

      setClients([...customersWithRole, ...distributorsWithRole]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  //Ordenes activas
  const fetchOrdersInProcess = async () => {
    try {
      const res = await fetch(API_ORDENES_EN_PROCESO);
      if (!res.ok) throw new Error('Error al obtener órdenes en proceso');
      const data = await res.json();
 
      setOrdersInProcess(data.totalEnProceso ?? 0);
    } catch (error) {
      toast.error(error.message);
    }
  };


  useEffect(() => {
    fetchProducts(); //ver los productos activos
    fetchClientsAndDistributors(); //ver los usuarios activos
    fetchOrdersInProcess(); //ver las órdenes en proceso
  }, []);



  // Filtrado de clientes con useMemo
  const filteredClients = useMemo(() => {
    const term = clientSearch.toLowerCase();
    return clients
      .filter(c => {
        const name = c.name?.toLowerCase() ?? '';
        const email = c.email?.toLowerCase() ?? '';
        return name.includes(term) || email.includes(term);
      })
      .filter(c => (clientRoleFilter === 'all' ? true : c.role === clientRoleFilter));
  }, [clients, clientSearch, clientRoleFilter]);

  const totalProducts = products.length;
  const totalClients = clients.length;

  return (
    <div className="admin-panel">
      <aside className="sidebar">
        <h2>BlueFruit Nutrition</h2>
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          <Package /> Productos
        </button>
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart2 /> Estadísticas
        </button>
        <button
          className={activeTab === 'clients' ? 'active' : ''}
          onClick={() => setActiveTab('clients')}
        >
          <Users /> Clientes
        </button>
      </aside>

      <main className="main-content">
        {activeTab === 'products' && (
          <>
            <h1>Gestión de Productos</h1>

            {!editingProduct && (
              <p style={{ marginBottom: '1rem', color: '#0C133F', fontWeight: '600' }}>
                Selecciona un producto para editar
              </p>
            )}

            <form className="product-form" onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                disabled={!editingProduct}
              />
              <input
                name="flavor"
                placeholder="Sabor"
                value={form.flavor}
                onChange={handleChange}
                disabled={!editingProduct}
              />
              <input
                name="price"
                placeholder="Precio"
                value={form.price}
                onChange={handleChange}
                disabled={!editingProduct}
              />
              <input
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                disabled={!editingProduct}
              />
              <div className="form-actions">
                {editingProduct && <button type="submit">Actualizar</button>}
                {editingProduct && (
                  <button type="button" className="cancel-btn" onClick={cancelEdit}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <div className="products-list">
              {products.length === 0 ? (
                <p>No hay productos disponibles.</p>
              ) : (
                products.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-info">
                      <strong>{product.name}</strong> ({product.flavor})
                      <br />
                      Precio: ${product.price.toFixed(2)} - Stock: {product.stock}
                    </div>
                    <div className="actions">
                      <button onClick={() => startEdit(product)} className="edit-btn">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="delete-btn">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'stats' && (
          <>
            <h1>Estadísticas</h1>
            <div className="stats-cards">
              <div className="stat-card">
                <h2>{totalProducts}</h2>
                <p>Productos</p>
              </div>

              <div className="stat-card">
                <h2>{ordersInProcess}</h2>
                <p>Ordenes en proceso</p>
              </div>
              <div className="stat-card">
                <h2>{totalClients}</h2>
                <p>Clientes y Distribuidores</p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'clients' && (
          <>
            <h1>Clientes y Distribuidores</h1>
            <div className="filters-container">
              <input
                type="search"
                placeholder="Buscar por nombre o email"
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                className="client-search"
              />
              <select
                value={clientRoleFilter}
                onChange={e => setClientRoleFilter(e.target.value)}
                className="role-filter"
              >
                <option value="all">Todos</option>
                <option value="customer">Clientes</option>
                <option value="distributor">Distribuidores</option>
              </select>
            </div>

            <div className="clients-list">
              {filteredClients.length === 0 ? (
                <p>No se encontraron resultados.</p>
              ) : (
                filteredClients.map(client => (
                  <div key={client.id} className="client-card">
                    <div className="client-info">
                      <div className="client-name-role">
                        <strong>{client.name}</strong>{' '}
                        <small>
                          ({client.role === 'customer' ? 'Cliente' : 'Distribuidor'})
                        </small>
                      </div>
                      <div className="client-email">{client.email}</div>
                    </div>
                    <div className="client-stats">
                      <p>Compras: {client.purchases ?? '-'}</p>
                      <p>Gastado: ${client.spent?.toFixed(2) ?? '-'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
