import React, { useState, useEffect, useMemo } from 'react';
import './home.css';
import { BarChart2, Package, Users, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_PRODUCTS = 'http://localhost:4000/api/products';
const API_CUSTOMERS = 'http://localhost:4000/api/customers';
const API_DISTRIBUTORS = 'http://localhost:4000/api/distributors';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');

  // Datos de productos
  const [products, setProducts] = useState([]);
  // Datos combinados clientes + distribuidores
  const [clients, setClients] = useState([]);

  // Estado para el producto que se está editando
  const [editingProduct, setEditingProduct] = useState(null);
  // Formulario de producto
  const [form, setForm] = useState({ name: '', flavor: '', price: '', stock: '' });

  // Estado para filtro de búsqueda clientes y filtro rol
  const [clientSearch, setClientSearch] = useState('');
  const [clientRoleFilter, setClientRoleFilter] = useState('all'); // 'all', 'customer', 'distributor'

  // Cargar productos desde backend y normalizar id
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_PRODUCTS);
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();

      const normalized = data.map(p => ({
        ...p,
        id: p.id ?? p._id, // normalizar id
      }));

      setProducts(normalized);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Cargar clientes y distribuidores y normalizar id + rol
  const fetchClientsAndDistributors = async () => {
    try {
      const [resCustomers, resDistributors] = await Promise.all([
        fetch(API_CUSTOMERS),
        fetch(API_DISTRIBUTORS),
      ]);
      if (!resCustomers.ok || !resDistributors.ok) throw new Error('Error al obtener clientes o distribuidores');

      const customers = await resCustomers.json();
      const distributors = await resDistributors.json();

      const customersWithRole = customers.map(c => ({ ...c, role: 'customer', id: c.id ?? c._id }));
      const distributorsWithRole = distributors.map(d => ({ ...d, role: 'distributor', id: d.id ?? d._id }));

      setClients([...customersWithRole, ...distributorsWithRole]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Carga inicial de datos
  useEffect(() => {
    fetchProducts();
    fetchClientsAndDistributors();
  }, []);

  // Maneja cambio en inputs de formulario producto
  const handleChange = e => {
    const { name, value } = e.target;
    if ((name === 'price' || name === 'stock') && value !== '') {
      if (!/^\d*\.?\d*$/.test(value)) return; // valida solo números y punto decimal
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Crear o actualizar producto en backend
  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.name.trim() || !form.flavor.trim() || form.price === '' || form.stock === '') {
      toast.error('Completa todos los campos correctamente');
      return;
    }

    const priceNum = parseFloat(form.price);
    const stockNum = parseInt(form.stock);

    if (isNaN(priceNum) || priceNum <= 0 || isNaN(stockNum) || stockNum < 0) {
      toast.error('Precio y stock deben ser números válidos');
      return;
    }

    try {
      if (editingProduct) {
        // Actualizar producto
        const res = await fetch(`${API_PRODUCTS}/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            flavor: form.flavor.trim(),
            price: priceNum,
            stock: stockNum,
          }),
        });
        if (!res.ok) throw new Error('Error al actualizar producto');

        await fetchProducts();
        toast.success('Producto actualizado correctamente');
        setEditingProduct(null);
      } else {
        // Crear nuevo producto
        const res = await fetch(API_PRODUCTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name.trim(),
            flavor: form.flavor.trim(),
            price: priceNum,
            stock: stockNum,
          }),
        });
        if (!res.ok) throw new Error('Error al agregar producto');

        await fetchProducts();
        toast.success('Producto agregado correctamente');
      }
      setForm({ name: '', flavor: '', price: '', stock: '' });
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Eliminar producto sin confirmación
  const handleDelete = async id => {
    try {
      const res = await fetch(`${API_PRODUCTS}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar producto');

      await fetchProducts();
      toast.success('Producto eliminado');

      if (editingProduct?.id === id) {
        setEditingProduct(null);
        setForm({ name: '', flavor: '', price: '', stock: '' });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Cargar datos de producto en formulario para editar con protección
  const startEdit = product => {
    if (!product) return;

    setEditingProduct(product);
    setForm({
      name: product.name || '',
      flavor: product.flavor || '',
      price: product.price != null ? product.price.toString() : '',
      stock: product.stock != null ? product.stock.toString() : '',
    });
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingProduct(null);
    setForm({ name: '', flavor: '', price: '', stock: '' });
  };

  // Filtrar clientes según búsqueda y rol
  const filteredClients = useMemo(() => {
    const term = clientSearch.toLowerCase();
    return clients
      .filter(c => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term))
      .filter(c => (clientRoleFilter === 'all' ? true : c.role === clientRoleFilter));
  }, [clients, clientSearch, clientRoleFilter]);

  // Estadísticas
  const totalProducts = products.length;
  const totalClients = clients.length;
  const totalSales = products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2);

  return (
    <div className="admin-panel">
      {/* Sidebar - Siempre visible */}
      <aside className="sidebar">
        <h2>BlueFruit Nutrition</h2>

        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
          aria-label="Ir a gestión de productos"
        >
          <Package /> Productos
        </button>

        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
          aria-label="Ver estadísticas"
        >
          <BarChart2 /> Estadísticas
        </button>

        <button
          className={activeTab === 'clients' ? 'active' : ''}
          onClick={() => setActiveTab('clients')}
          aria-label="Ver clientes y distribuidores"
        >
          <Users /> Clientes
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Productos */}
        {activeTab === 'products' && (
          <>
            <h1>Gestión de Productos</h1>
            <form className="product-form" onSubmit={handleSubmit} noValidate>
              <input
                name="name"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <input
                name="flavor"
                placeholder="Sabor"
                value={form.flavor}
                onChange={handleChange}
                autoComplete="off"
                required
              />
              <input
                name="price"
                type="text"
                placeholder="Precio"
                value={form.price}
                onChange={handleChange}
                required
              />
              <input
                name="stock"
                type="text"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                required
              />

              <div className="form-actions">
                <button type="submit">{editingProduct ? 'Actualizar' : 'Agregar'}</button>
                {editingProduct && (
                  <button type="button" onClick={cancelEdit} className="cancel-btn">
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
                      <strong>{product.name}</strong> ({product.flavor})<br />
                      Precio: ${product.price.toFixed(2)} - Stock: {product.stock}
                    </div>

                    <div className="actions">
                      <button onClick={() => startEdit(product)} title="Editar" className="edit-btn">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} title="Eliminar" className="delete-btn">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Estadísticas */}
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
                <h2>{totalClients}</h2>
                <p>Clientes y distribuidores</p>
              </div>
            </div>
          </>
        )}

        {/* Clientes + Distribuidores */}
        {activeTab === 'clients' && (
          <>
            <h1>Clientes y Distribuidores</h1>

            {/* Filtros */}
            <div className="filters-container">
              <input
                type="search"
                placeholder="Buscar por nombre o email"
                value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                className="client-search"
                autoComplete="off"
                aria-label="Buscar clientes o distribuidores"
              />
              <select
                value={clientRoleFilter}
                onChange={e => setClientRoleFilter(e.target.value)}
                aria-label="Filtrar por rol"
                className="role-filter"
              >
                <option value="all">Todos</option>
                <option value="customer">Clientes</option>
                <option value="distributor">Distribuidores</option>
              </select>
            </div>

            {/* Lista */}
            <div className="clients-list">
              {filteredClients.length === 0 ? (
                <p>No se encontraron resultados.</p>
              ) : (
                filteredClients.map(client => (
                  <div key={client.id} className="client-card">
                    <div>
                      <strong>{client.name}</strong>{' '}
                      <small style={{ fontWeight: 'normal', color: '#555' }}>
                        ({client.role === 'customer' ? 'Cliente' : 'Distribuidor'})
                      </small>
                      <br />
                      <small>{client.email}</small>
                    </div>
                    <div>
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