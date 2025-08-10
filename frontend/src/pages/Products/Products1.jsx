import React, { useState, useEffect } from 'react';
import './Products1.css';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:4000/api/products";

function ProductCard({ product, onView, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image || "/producticon.png"}
          alt={product.name}
          className="product-image"
          onError={(e) => { e.target.src = "/producticon.png"; }}
        />
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-flavor"><strong>Sabor:</strong> {product.flavor}</p>
      <p className="product-price"><strong>Precio:</strong> ${product.price}</p>
      <div className="product-buttons">
        <button 
          className="view-btn"
          onClick={() => onView(product)}
        >
          Ver producto
        </button>
        <button 
          className="edit-btn"
          onClick={() => onEdit(product)}
        >
          Editar
        </button>
        <button 
          className="delete-btn"
          onClick={() => onDelete(product._id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (response.ok) {
          await fetchProducts();
          alert("Producto eliminado correctamente");
        } else {
          alert("Error al eliminar el producto");
        }
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("Error al eliminar el producto");
      }
    }
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product._id}`);
  };

  const handleView = (product) => {
    navigate(`/productsReviews`);
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2 className="products-title">Productos</h2>
        <button
          className="add-product-btn"
          onClick={() => navigate('/addProduct')}
        >
          Agregar Productos
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : error ? (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={fetchProducts}>Reintentar</button>
        </div>
      ) : products.length === 0 ? (
        <div className="loading">No hay productos disponibles</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductManager;
