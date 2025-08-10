import React, { useState } from "react";
import toast from "react-hot-toast"; // Importa la librería para mostrar notificaciones tipo toast
import "./AddProduct.css"; // Importa estilos CSS

const API_URL = "http://localhost:4000/api/products"; // URL base de la API para agregar productos

const AddProduct = () => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    flavor: "",
    price: "",
    idNutritionalValues: "",
  });

  // Estado para la imagen seleccionada y su preview
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Estado para controlar errores de validación en los campos
  const [errors, setErrors] = useState({});

  // Maneja cambios en los inputs de texto y textarea
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value })); // Actualiza el valor correspondiente
    setErrors((prev) => ({ ...prev, [e.target.name]: false })); // Quita el error de ese campo si existía
  };

  // Maneja la selección de archivo para la imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Obtiene el primer archivo seleccionado
    if (!file) return; // Si no hay archivo, sale de la función
    setImage(file); // Guarda la imagen en el estado
    setPreview(URL.createObjectURL(file)); // Crea una URL para mostrar vista previa
    setErrors((prev) => ({ ...prev, image: false })); // Quita el error en imagen si había
  };

  // Función que valida todos los campos requeridos
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = true; // Nombre obligatorio
    if (!formData.description.trim()) newErrors.description = true; // Descripción obligatoria
    if (!formData.flavor.trim()) newErrors.flavor = true; // Sabor obligatorio
    if (!formData.price || Number(formData.price) < 0) newErrors.price = true; // Precio obligatorio y no negativo
    if (!image) newErrors.image = true; // Imagen obligatoria
    setErrors(newErrors); // Guarda los errores en estado
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  // Limpia todos los campos y estados a su valor inicial
  const handleClear = () => {
    setFormData({
      name: "",
      description: "",
      flavor: "",
      price: "",
      idNutritionalValues: "",
    });
    setImage(null);
    setPreview(null);
    setErrors({});
  };

  // Envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    if (!validate()) {
      toast.error("Por favor, completa todos los campos correctamente y sube una imagen."); // Muestra error si no validó
      return;
    }

    // Crea un objeto FormData para enviar datos con archivo
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value); // Añade cada campo del formulario
    });
    data.append("image", image); // Añade la imagen seleccionada

    try {
      toast.loading("Subiendo producto...", { id: "loading" }); // Muestra toast de carga

      const response = await fetch(API_URL, {
        method: "POST",
        body: data, // Envia FormData directamente
      });

      if (!response.ok) {
        const errorText = await response.text(); // Lee texto de error del servidor
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`); // Lanza error para catch
      }

      toast.dismiss("loading"); // Oculta toast de carga
      toast.success("Producto añadido con éxito."); // Muestra toast de éxito
      handleClear(); // Limpia formulario
    } catch (error) {
      toast.dismiss("loading"); // Oculta toast de carga
      console.error("Error al subir el producto:", error);
      toast.error(`Error al subir el producto: ${error.message}`); // Muestra toast de error con mensaje
    }
  };

  return (
    <div className="add-product-wrapper">
      <h2>Añadir Productos</h2> {/* Título del formulario */}
      <form
        className="add-product-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data" // Importante para envío de archivos
        noValidate // Evita validación nativa html5 para usar la propia
      >
        <div className="left-column">
          {/* Contenedor vista previa imagen */}
          <div
            className={`image-preview ${errors.image ? "error-border" : ""}`} // Clase extra si hay error
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: "220px" }}
              />
            ) : (
              <span className="image-placeholder">Vista previa</span> // Texto si no hay imagen
            )}
          </div>
          {/* Label para subir imagen */}
          <label htmlFor="file-upload" className="file-label">
            Subir Imagen
          </label>
          {/* Input oculto para archivo */}
          <input
            type="file"
            id="file-upload"
            className="file-input"
            accept="image/*"
            onChange={handleFileChange}
          />
          {/* Mensaje de error para imagen */}
          {errors.image && (
            <small className="error-text">Debe subir una imagen.</small>
          )}
        </div>

        <div className="right-column">
          {/* Input Nombre */}
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={formData.name}
            onChange={handleInputChange}
            autoComplete="off"
            className={errors.name ? "error-border" : ""}
          />

          {/* Textarea Descripción */}
          <label>Descripción</label>
          <textarea
            name="description"
            placeholder="Descripción del producto"
            value={formData.description}
            onChange={handleInputChange}
            className={errors.description ? "error-border" : ""}
          />

          {/* Input Sabor */}
          <label>Sabor</label>
          <input
            type="text"
            name="flavor"
            placeholder="Sabor"
            value={formData.flavor}
            onChange={handleInputChange}
            autoComplete="off"
            className={errors.flavor ? "error-border" : ""}
          />

          {/* Input Precio */}
          <label>Precio</label>
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            className={errors.price ? "error-border" : ""}
          />

          {/* Input ID Valores Nutricionales */}
          <label>ID Valores Nutricionales</label>
          <input
            type="text"
            name="idNutritionalValues"
            placeholder="ID Nutricional"
            value={formData.idNutritionalValues}
            onChange={handleInputChange}
            autoComplete="off"
          />

          {/* Botones Limpiar y Añadir */}
          <div className="button-group">
            <button type="button" className="btn-clear" onClick={handleClear}>
              Limpiar
            </button>
            <button type="submit" className="btn-submit">
              Añadir
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
