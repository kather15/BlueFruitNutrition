import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UserForm.css";

function UserForm() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const endpoint =
      type === "clientes"
        ? `http://localhost:4000/api/customers`
        : `http://localhost:4000/api/distributors`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        const user = data.find((u) => u._id === id);
        setFormData(user);
      });
  }, [id, type]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      type === "clientes"
        ? `http://localhost:4000/api/customers/${id}`
        : `http://localhost:4000/api/distributors/${id}`;

    await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    navigate("/usuarios");
  };

  if (!formData) return <p className="loading-text">Cargando...</p>;

  return (
    <div className="user-form-page">
      <div className="user-form-header">
        <h1 className="page-title">Editar Empleado</h1>
      </div>
      
      <div className="user-form-container">
        <div className="user-form-card">
          <div className="user-form-content">
            {/* Avatar del usuario */}
            <div className="user-avatar-section">
              <div className="user-avatar">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-fields">
                {type === "clientes" ? (
                  <>
                    <div className="input-group">
                      <label className="input-label">Nombre:</label>
                      <input
                        className="input"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        placeholder="Nombre"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Apellido:</label>
                      <input
                        className="input"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleChange}
                        placeholder="Apellido"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Correo:</label>
                      <input
                        className="input"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        placeholder="Correo"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Teléfono:</label>
                      <input
                        className="input"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        placeholder="Teléfono"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="input-group">
                      <label className="input-label">Empresa:</label>
                      <input
                        className="input"
                        name="companyName"
                        value={formData.companyName || ''}
                        onChange={handleChange}
                        placeholder="Empresa"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Correo:</label>
                      <input
                        className="input"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        placeholder="Correo"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Teléfono:</label>
                      <input
                        className="input"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        placeholder="Teléfono"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserForm;