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

  // Obtenemos todos los sabores únicos disponibles
  const getAllFlavors = () => {
    const allFlavors = new Set();
    Object.values(gels).forEach(flavors => {
      flavors.forEach(flavor => allFlavors.add(flavor));
    });
    return Array.from(allFlavors).sort();
  };

  const [formData, setFormData] = useState({
    name: "",
    flavor: [], // Mantener como array para múltiples sabores
    description: "",
    price: "",
  });
  const [availableFlavors, setAvailableFlavors] = useState([]);
  const [loadingFlavors, setLoadingFlavors] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showCustomFlavors, setShowCustomFlavors] = useState(false);

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
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error("Por favor, sube una imagen en formato válido (jpg, jpeg, png, webp, gif)");
        e.target.value = null;
        setImageFile(null);
        setImagePreview(null);
        return;
      }

      // Verificar tamaño (opcional: máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error("La imagen es demasiado grande. Máximo 10MB permitido.");
        e.target.value = null;
        setImageFile(null);
        setImagePreview(null);
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Cuando cambias el nombre del producto, cargar sabores asociados
  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, name: value, flavor: [] }));

    if (!value) {
      setAvailableFlavors([]);
      setShowCustomFlavors(false);
      return;
    }

    setLoadingFlavors(true);
    setTimeout(() => {
      // Si es un producto conocido, usar sus sabores específicos
      if (gels[value]) {
        setAvailableFlavors(gels[value]);
        setShowCustomFlavors(false);
      } else {
        // Si es un producto personalizado, mostrar todos los sabores disponibles
        setAvailableFlavors(getAllFlavors());
        setShowCustomFlavors(true);
      }
      setLoadingFlavors(false);
    }, 300);
  };

  // Controla los sabores seleccionados (múltiples)
  const handleFlavorToggle = (flavor) => {
    setFormData(prev => ({
      ...prev,
      flavor: prev.flavor.includes(flavor)
        ? prev.flavor.filter(f => f !== flavor)
        : [...prev.flavor, flavor]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFormData({
      name: "",
      flavor: [],
      description: "",
      price: "",
    });
    setAvailableFlavors([]);
    setShowCustomFlavors(false);
    setImageFile(null);
    setImagePreview(null);
    toast.success("Formulario limpiado");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      formData.flavor.length === 0 ||
      !formData.description.trim() ||
      !formData.price ||
      !imageFile
    ) {
      toast.error("Todos los campos son obligatorios y debes seleccionar al menos un sabor");
      return;
    }

    setLoadingSubmit(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("flavor", JSON.stringify(formData.flavor)); // Enviar como array JSON
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
      setLoadingSubmit(false);
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
              <button type="button" className="btn-upload" onClick={handleUploadClick} disabled={loadingSubmit}>
                {imageFile ? "Cambiar imagen" : "Seleccionar imagen"}
              </button>
              <button type="button" className="btn-clear" onClick={handleClear} disabled={loadingSubmit}>
                Limpiar
              </button>
            </div>

            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png, image/webp, image/gif"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={loadingSubmit}
            />
            
            {imageFile && (
              <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
                Tamaño: {(imageFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            )}
          </div>

          <div className="right-column">
            <div>
              <label htmlFor="name">Nombre del producto</label>
              <input
                id="name"
                name="name"
                list="gels-list"
                value={formData.name}
                onChange={handleNameChange}
                disabled={loadingSubmit}
                placeholder="Escribe o selecciona un gel"
              />
              <datalist id="gels-list">
                {Object.keys(gels).map((gel) => (
                  <option key={gel} value={gel} />
                ))}
              </datalist>
            </div>

            <div className="flavor-section">
              <label>
                {loadingFlavors ? "Cargando sabores..." : "Selecciona los sabores disponibles"}
                {showCustomFlavors && (
                  <span style={{ fontSize: "12px", color: "#666", marginLeft: "5px" }}>
                    (Producto personalizado)
                  </span>
                )}
              </label>
              
              {loadingFlavors ? (
                <div className="loading-spinner">
                  <div className="spinner">Cargando...</div>
                </div>
              ) : availableFlavors.length > 0 ? (
                <div className="flavors-container">
                  {availableFlavors.map(flavor => (
                    <div
                      key={flavor}
                      className={`flavor-option ${formData.flavor.includes(flavor) ? 'selected' : ''}`}
                      onClick={() => handleFlavorToggle(flavor)}
                    >
                      <span className="flavor-name">{flavor}</span>
                      {formData.flavor.includes(flavor) && (
                        <span className="check-icon">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-flavors">
                  {formData.name ? "No hay sabores disponibles" : "Selecciona un producto primero"}
                </div>
              )}

              {formData.flavor.length > 0 && (
                <div className="selected-flavors-display">
                  <strong>Sabores seleccionados ({formData.flavor.length}):</strong>
                  <div className="selected-flavors-list">
                    {formData.flavor.map((flavor, index) => (
                      <span key={flavor} className="selected-flavor-tag">
                        {flavor}
                        <button
                          type="button"
                          className="remove-flavor"
                          onClick={() => handleFlavorToggle(flavor)}
                          title="Quitar sabor"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                placeholder="Descripción del producto"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                disabled={loadingSubmit}
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
                onChange={handleInputChange}
                min="0"
                step="0.01"
                disabled={loadingSubmit}
              />
            </div>

            <div className="button-group" style={{ marginTop: "20px" }}>
              <button type="submit" className="btn-submit" disabled={loadingSubmit}>
                {loadingSubmit ? "Subiendo..." : "Agregar Producto"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;