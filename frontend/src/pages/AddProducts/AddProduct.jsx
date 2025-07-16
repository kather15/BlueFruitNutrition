// src/pages/AddProducts/AddProduct.jsx
import React, { useState } from 'react';
import './AddProduct.css';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    flavor: '',
    price: '',
    image: null
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      flavor: '',
      price: '',
      image: null
    });
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('flavor', formData.flavor);
    data.append('price', formData.price);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const response = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert('Producto agregado exitosamente');
        handleReset();
      } else {
        const error = await response.json();
        alert('Error al agregar producto: ' + (error.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al enviar producto:', error);
      alert('Error al enviar el formulario');
    }
  };

  return (
    <div className="add-product-form">
      <h2>Añadir un nuevo Producto</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="image-upload">
          {preview ? (
            <img src={preview} alt="Vista previa" className="preview-image" />
          ) : (
            <div className="image-placeholder">?</div>
          )}
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="form-fields">
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="flavor"
            placeholder="Sabor"
            value={formData.flavor}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Contenido Neto"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={handleReset}>Limpiar Formulario</button>
          <button type="submit">Agregar Producto</button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
