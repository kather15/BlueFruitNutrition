import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../../components/Nav/Nav.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./home.css";

const API_PRODUCTS = "http://localhost:4000/api/products";
const API_CUSTOMERS = "http://localhost:4000/api/customers";
const API_DISTRIBUTORS = "http://localhost:4000/api/distributors";
const API_ORDENES_EN_PROCESO = "http://localhost:4000/api/ordenes/enProceso/total";

// Paleta principal azul oscuro y variantes claras para contraste
const COLORS = ["#0C133F", "#1a265f", "#394a85", "#5260a3", "#6878bf"];

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [ordersInProcess, setOrdersInProcess] = useState(0);

  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: "", flavor: "", price: "", stock: "" });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_PRODUCTS);
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      const normalized = data.map((p) => ({ ...p, id: p.id ?? p._id }));
      setProducts(normalized);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch clients + distributors
  const fetchClientsAndDistributors = async () => {
    try {
      const [resCustomers, resDistributors] = await Promise.all([
        fetch(API_CUSTOMERS),
        fetch(API_DISTRIBUTORS),
      ]);
      if (!resCustomers.ok || !resDistributors.ok)
        throw new Error("Error al obtener clientes o distribuidores");

      const customers = await resCustomers.json();
      const distributors = await resDistributors.json();

      const customersWithRole = customers.map((c) => ({
        ...c,
        role: "customer",
        id: c.id ?? c._id,
      }));
      const distributorsWithRole = distributors.map((d) => ({
        ...d,
        role: "distributor",
        id: d.id ?? d._id,
      }));

      setClients([...customersWithRole, ...distributorsWithRole]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch orders en proceso
  const fetchOrdersInProcess = async () => {
    try {
      const res = await fetch(API_ORDENES_EN_PROCESO);
      if (!res.ok) throw new Error("Error al obtener órdenes en proceso");
      const data = await res.json();
      setOrdersInProcess(data.totalEnProceso ?? 0);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchClientsAndDistributors();
    fetchOrdersInProcess();
  }, []);

  // Datos para gráficas
  const productStockData = products.map((p) => ({
    name: p.name,
    stock: p.stock,
  }));

  const roleData = [
    { name: "Clientes", value: clients.filter((c) => c.role === "customer").length },
    { name: "Distribuidores", value: clients.filter((c) => c.role === "distributor").length },
  ];

  const statsCards = [
    { title: "Total Productos", value: products.length },
    { title: "Usuarios Registrados", value: clients.length },
    { title: "Órdenes en Proceso", value: ordersInProcess },
  ];

  return (
    <div className="admin-panel">
      <Sidebar />

      <main className="admin-main-content">
        <div className="admin-welcome-banner">
          <h1 style={{ color: "#0C133F" }}>Bienvenido, Administrador</h1>
          <p style={{ color: "#0C133F" }}>
            Gestiona productos, usuarios y pedidos desde un solo lugar.
          </p>
        </div>

        <div className="admin-stats-grid">
          {statsCards.map((card, idx) => (
            <div
              key={idx}
              className="admin-stat-card"
              style={{ backgroundColor: "#FFFFFF", color: "#0C133F", boxShadow: "0 8px 20px rgba(12, 19, 63, 0.1)" }}
            >
              <h2>{card.value}</h2>
              <span>{card.title}</span>
            </div>
          ))}
        </div>

        <div className="admin-charts-container">
          <div
            className="admin-chart-card"
            style={{ backgroundColor: "#FFFFFF", color: "#0C133F", boxShadow: "0 12px 35px rgba(12, 19, 63, 0.12)" }}
          >
            <h3>Stock de Productos</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={productStockData}
                margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#5260a3" />
                <XAxis dataKey="name" stroke="#0C133F" />
                <YAxis stroke="#0C133F" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#e0e6f3",
                    borderRadius: "8px",
                    border: "none",
                    color: "#0C133F",
                  }}
                  itemStyle={{ color: "#0C133F" }}
                />
                <Bar dataKey="stock" fill="#0C133F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            className="admin-chart-card"
            style={{ backgroundColor: "#FFFFFF", color: "#0C133F", boxShadow: "0 12px 35px rgba(12, 19, 63, 0.12)" }}
          >
            <h3>Distribución de Usuarios</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={roleData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  fill="#0C133F"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#e0e6f3",
                    borderRadius: "8px",
                    border: "none",
                    color: "#0C133F",
                  }}
                  itemStyle={{ color: "#0C133F" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <section className="admin-products-section">
          <h2 style={{ color: "#0C133F" }}>Gestión de Productos</h2>
          {products.length === 0 ? (
            <p style={{ color: "#0C133F" }}>No hay productos disponibles.</p>
          ) : (
            <div className="admin-products-list">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="admin-product-card"
                  style={{
                    background: "linear-gradient(135deg, #dbe1f4, #ffffff)",
                    color: "#0C133F",
                    boxShadow: "0 8px 24px rgba(12, 19, 63, 0.1)",
                  }}
                >
                  <div className="admin-product-info">
                    <strong>{product.name}</strong> ({product.flavor})
                    <br />
                    Precio: ${product.price.toFixed(2)} - Stock: {product.stock}
                  </div>
                  <div className="admin-actions">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="edit-btn"
                      title="Editar producto"
                      style={{ color: "#0C133F" }}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => console.log("Eliminar", product.id)}
                      className="delete-btn"
                      title="Eliminar producto"
                      style={{ color: "#0C133F" }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPanel;
