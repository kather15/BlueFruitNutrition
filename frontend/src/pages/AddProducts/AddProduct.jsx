import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import './AddProduct.css';

const AddProduct = () => {
  const fileInputRef = useRef(null);

  const gels = {
    "CarboUpp": ["Banano", "Mora", "Limón", "Manzana", "Piña", "Frambuesa", "Coco"],
    "EnerKik": ["Ponche de Frutas", "Maracuya", "Limón", "Banano", "Frambuesa"],
    "Enerbalance": ["Mora", "Banano", "Manzana"]
  };

  const [formData, setFormData] = useState({
    name: "",
    flavor: "",
    description: "",
    price: "",
  });
  const [availableFlavors, setAvailableFlavors] = useState([]);
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
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload an image with jpg, jpeg or png format");
        e.target.value = null;
        setImageFile(null);
        setImagePreview(null);
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "name") {
      setAvailableFlavors(gels[value] || []);
      setFormData((prev) => ({ ...prev, flavor: "" })); 
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      flavor: "",
      description: "",
      price: "",
    });
    setAvailableFlavors([]);
    setImageFile(null);
    setImagePreview(null);
    toast.success("Formulario limpiado");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.flavor.trim() || !formData.description.trim() || !formData.price || !imageFile) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("flavor", formData.flavor);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("imagen", imageFile);

      const res = await fetch("https://bluefruitnutrition1.onrender.com/api/products", {
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
    <div className="page-container">
      <div className="add-product-wrapper">
        <h2>Agregar Producto</h2>
        <form className="add-product-form" onSubmit={handleSubmit}>
          <div className="left-column">
            <div className="image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" />
              ) : (
                <span className="image-placeholder">Vista previa de la imagen</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="button" className="btn-upload" onClick={handleUploadClick} disabled={loading}>
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
              <select
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Selecciona un gel</option>
                {Object.keys(gels).map((gel) => (
                  <option key={gel} value={gel}>{gel}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="flavor">Sabor</label>
              <select
                id="flavor"
                name="flavor"
                value={formData.flavor}
                onChange={handleChange}
                disabled={loading || !formData.name}
              >
                <option value="">Selecciona un sabor</option>
                {availableFlavors.map((flavor) => (
                  <option key={flavor} value={flavor}>{flavor}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                placeholder="Descripción del producto"
                value={formData.description}
                onChange={handleChange}
                rows={3}
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
                min="0"
                step="0.01"
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
    </div>
  );
};

export default AddProduct;
