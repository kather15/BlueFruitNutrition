import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Nav/Nav.jsx";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import toast from "react-hot-toast";
import "./home.css";

const API_PRODUCTS = "http://localhost:4000/api/products";
const API_CUSTOMERS = "http://localhost:4000/api/customers";
const API_DISTRIBUTORS = "http://localhost:4000/api/distributors";
const API_ORDERS_IN_PROCESS = "http://localhost:4000/api/ordenes/enProceso/total";

const COLORS = ["#0C133F", "#1a265f", "#394a85", "#5260a3", "#6878bf"];

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [ordersInProcess, setOrdersInProcess] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_PRODUCTS);
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        setProducts(data.map(p => ({ ...p, id: p.id ?? p._id })));
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchClients = async () => {
      try {
        const [resCustomers, resDistributors] = await Promise.all([
          fetch(API_CUSTOMERS),
          fetch(API_DISTRIBUTORS),
        ]);
        if (!resCustomers.ok || !resDistributors.ok)
          throw new Error("Error al obtener clientes o distribuidores");

        const customers = await resCustomers.json();
        const distributors = await resDistributors.json();

        setClients([
          ...customers.map(c => ({ ...c, role: "Cliente" })),
          ...distributors.map(d => ({ ...d, role: "Distribuidor" })),
        ]);
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(API_ORDERS_IN_PROCESS);
        if (!res.ok) throw new Error("Error al obtener órdenes en proceso");
        const data = await res.json();
        setOrdersInProcess(data.totalEnProceso ?? 0);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchProducts();
    fetchClients();
    fetchOrders();
  }, []);

  const statsCards = [
    { title: "Total Productos", value: products.length },
    { title: "Usuarios Registrados", value: clients.length },
    { title: "Órdenes en Proceso", value: ordersInProcess },
  ];

  const splitCards = [];
  for (let i = 0; i < statsCards.length; i += 2) {
    splitCards.push(statsCards.slice(i, i + 2));
  }

  const roleData = [
    { name: "Clientes", value: clients.filter(c => c.role === "Cliente").length },
    { name: "Distribuidores", value: clients.filter(c => c.role === "Distribuidor").length },
  ];

  return (
    <div className="admin-panel">
      <Sidebar />
      <main className="admin-main-content">
        <div className="admin-welcome-banner">
          <h1>Bienvenido, Administrador</h1>
          <p>Visualiza estadísticas y métricas clave de tu plataforma.</p>
        </div>

        {/* Cards de métricas */}
        {splitCards.map((cardPair, idx) => (
          <div key={idx} className="admin-stats-grid">
            {cardPair.map((card, index) => (
              <div key={index} className="admin-stat-card">
                <h2>{card.value}</h2>
                <span>{card.title}</span>
              </div>
            ))}
          </div>
        ))}

        {/* Gráfica + Productos */}
        <div className="admin-top-section">
          <div className="admin-card">
            <h3>Distribución de Usuarios</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={roleData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  fill="#0C133F"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#e0e6f3", borderRadius: "8px", border: "none" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="admin-card admin-table-container">
            <h3>Lista de Productos</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td>{p.name}</td>
                    <td>${p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Usuarios Registrados */}
        <div className="admin-users-section">
          <div className="admin-table-container">
            <h3>Usuarios Registrados</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c, i) => (
                  <tr key={i}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
