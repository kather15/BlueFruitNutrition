import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import './AddProduct.css';

const AddProduct = () => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    flavor: "",
    price: "",
    idNutritionalValues: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Validar tipo de imagen permitido
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an image with jpg, jpeg or png format");
      // Limpiar input y estado de imagen
      e.target.value = null;
      setImageFile(null);
      setPreviewImage(null);
      return;
    }

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      name: "",
      description: "",
      flavor: "",
      price: "",
      idNutritionalValues: "",
    });
    setImageFile(null);
    setImagePreview(null);
    toast.success("Formulario limpiado");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

if (
  !formData.name.trim() ||
  !formData.description.trim() ||
  !formData.flavor.trim() ||
  !formData.price || // si es número, solo validar que exista
  !formData.idNutritionalValues.trim() ||
  !imageFile
) {
  toast.error("Todos los campos son obligatorios");
  return;
}


    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("flavor", formData.flavor);
      data.append("price", formData.price);
      data.append("idNutritionalValues", formData.idNutritionalValues);
     data.append("imagen", imageFile);

      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Error al subir el producto");

      toast.success("Producto agregado correctamente");
      handleClear();
    } catch (error) {
      toast.error(error.message || "Error del servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-wrapper">
      <h2>Agregar Producto</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="left-column">
          <div className={`image-preview ${!imagePreview ? "error-border" : ""}`}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" />
            ) : (
              <span className="image-placeholder">Vista previa de la imagen</span>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              className="btn-upload"
              onClick={handleUploadClick}
              disabled={loading}
            >
              {imageFile ? "Cambiar imagen" : "Seleccionar imagen"}
            </button>
            <button type="button" className="btn-clear" onClick={handleClear} disabled={loading}>
              Limpiar
            </button>
          </div>

          <input
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <div className="right-column">
          <div>
            <label htmlFor="name">Nombre del producto</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Nombre del producto"
              value={formData.name}
              onChange={handleChange}
              className={!formData.name.trim() ? "error-border" : ""}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              placeholder="Descripción del producto"
              value={formData.description}
              onChange={handleChange}
              className={!formData.description.trim() ? "error-border" : ""}
              rows={3}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="flavor">Sabor</label>
            <input
              id="flavor"
              name="flavor"
              type="text"
              placeholder="Sabor del producto"
              value={formData.flavor}
              onChange={handleChange}
              className={!formData.flavor.trim() ? "error-border" : ""}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="price">Precio</label>
            <input
              id="price"
              name="price"
              type="number"
              placeholder="Precio"
              value={formData.price}
              onChange={handleChange}
              className={!formData.price ? "error-border" : ""}
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="idNutritionalValues">ID de Valores Nutricionales</label>
            <input
              id="idNutritionalValues"
              name="idNutritionalValues"
              type="text"
              placeholder="ID Valores Nutricionales"
              value={formData.idNutritionalValues}
              onChange={handleChange}
              className={!formData.idNutritionalValues.trim() ? "error-border" : ""}
              disabled={loading}
            />
          </div>

          <div className="button-group" style={{ marginTop: "20px" }}>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Subiendo..." : "Agregar Producto"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
