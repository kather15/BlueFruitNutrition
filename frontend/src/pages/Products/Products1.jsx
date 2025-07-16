import React, { useState, useEffect } from 'react';
import './Products1.css';

const API_URL = "http://localhost:4000/api/products";


function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image || "/producticon.png"}
          alt={product.name}
          className="product-image"
        />
      </div>
      <h3 className="product-name">{product.name}</h3>
      
      <p className="product-description">{product.description}</p>
      <p className="product-flavor"><strong>Sabor:</strong> {product.flavor}</p>
      <p className="product-price"><strong>Precio:</strong> ${product.price}</p>
      
      <div className="product-buttons">
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
          🗑️
        </button>
      </div>
    </div>
  );
}

// Componente principal
function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    flavor: "",
    price: "",
    idNutritionalValues: "",
    image: null,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch products al cargar
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (product) => {
    setEditForm({
      name: product.name,
      description: product.description,
      flavor: product.flavor,
      price: product.price,
      idNutritionalValues: product.idNutritionalValues || "",
      image: null,
    });
    setEditingId(product._id);
    setShowEditModal(true);
  };

  const openAddModal = () => {
    setEditForm({
      name: "",
      description: "",
      flavor: "",
      price: "",
      idNutritionalValues: "",
      image: null,
    });
    setEditingId(null);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    setEditingId(null);
    setEditForm({
      name: "",
      description: "",
      flavor: "",
      price: "",
      idNutritionalValues: "",
      image: null,
    });
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setEditForm({ ...editForm, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in editForm) {
      if (editForm[key] !== null && editForm[key] !== "") {
        formData.append(key, editForm[key]);
      }
    }

    try {
      let response;
      if (editingId) {
        // Actualizar producto existente
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Crear nuevo producto
        response = await fetch(API_URL, {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        await fetchProducts();
        closeModal();
        alert(editingId ? "Producto actualizado correctamente" : "Producto agregado correctamente");
      } else {
        alert("Error al guardar el producto.");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar el producto.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { 
          method: "DELETE" 
        });
        
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

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error">Error: {error}</div>
        <button onClick={fetchProducts}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h2 className="products-title">Productos</h2>
      <button
        className="add-product-btn"
        onClick={openAddModal}
      >
        Agregar Productos
      </button>

      {products.length === 0 ? (
        <div className="loading">No hay productos disponibles</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal para agregar/editar */}
      {(showEditModal || showAddModal) && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{editingId ? 'Editar Producto' : 'Agregar Producto'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Nombre del producto"
                value={editForm.name}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Descripción del producto"
                value={editForm.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
              <div className="row-fields">
                <input
                  type="text"
                  name="flavor"
                  placeholder="Sabor"
                  value={editForm.flavor}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Precio"
                  value={editForm.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <input
                type="text"
                name="idNutritionalValues"
                placeholder="ID Valores Nutricionales (opcional)"
                value={editForm.idNutritionalValues}
                onChange={handleInputChange}
              />
              
              <div className="image-preview">
                {editForm.image ? (
                  <img
                    src={URL.createObjectURL(editForm.image)}
                    alt="preview"
                  />
                ) : editingId && products.find(p => p._id === editingId)?.image ? (
                  <img
                    src={products.find(p => p._id === editingId)?.image}
                    alt="current"
                  />
                ) : (
                  <span className="image-preview-text">Vista previa de imagen</span>
                )}
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={closeModal}
                  className="clear-btn"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                >
                  {editingId ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManager;