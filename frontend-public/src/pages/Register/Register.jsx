// src/pages/Register/Registro.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./Register.css";

function Registro() {
  const [showModal, setShowModal] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("customer");

  // Form hook para ambos, pero diferenciamos con nombres de campos
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onTouched",
  });

  // Restricción: mínimo 18 años
  const getMinBirthDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split("T")[0];
  };
  const minBirthDate = getMinBirthDate();

  const getMaxBirthDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const maxBirthDate = getMaxBirthDate();

  const onSubmit = async (data) => {
    try {
      let payload = {};
      let endpoint = "";

      if (tipoUsuario === "customer") {
        endpoint = "https://bluefruitnutrition1.onrender.com/api/registerCustomers";
        payload = {
          name: data.name,
          lastName: data.lastName,
          email: data.customerEmail,
          password: data.customerPassword,
          phone: data.phone,
          birthDate: data.birthDate,
        };
      } else {
        endpoint = "https://bluefruitnutrition1.onrender.com/api/registerDistributors";
        payload = {
          companyName: data.companyName,
          email: data.distributorEmail,
          password: data.distributorPassword,
          address: data.address,
          phone: data.distributorPhone,
          nie: data.nie,
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (
        result.message === "Distributor already exist" ||
        result.message === "Ya existe un cliente registrado con este correo" ||
        result.message === "Ya existe un distribuidor registrado con este correo" ||
        result.message === "Customer already exist"
      ) {
        toast.error(result.message);
        return;
      }

      if (!res.ok) {
        toast.error(result.message || "Error en el registro");
        return;
      }

      toast.success("Registro exitoso. Revisa tu correo 📩");
      setShowModal(true);
      reset(); // limpiar campos tras enviar
    } catch (error) {
      console.error("Error en onSubmit:", error);
      toast.error("Error de red o del servidor");
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="registro-card" role="region" aria-label="Registro de usuario">
        {/* Lado izquierdo con imagen */}
        <div className="registro-left" aria-hidden="true">
          <img src="/imgregister.png" alt="Ilustración de seguridad" className="registro-img" />
        </div>

        {/* Lado derecho con formulario */}
        <div className="registro-right">
          <h1 className="welcome-title">Welcome!</h1>
          <h2 className="tipo-cuenta-titulo">Selecciona tu tipo de cuenta</h2>

          <div className="btn-switch-group" role="tablist" aria-label="Tipo de cuenta">
            <button
              type="button"
              aria-pressed={tipoUsuario === "customer"}
              className={`btn-switch ${tipoUsuario === "customer" ? "active" : ""}`}
              onClick={() => {
                setTipoUsuario("customer");
                reset();
              }}
            >
              Cliente
              <span className="btn-switch-icon" aria-hidden="true">
                <img src={"/customerIcon.png"} alt="" />
              </span>
            </button>

            <button
              type="button"
              aria-pressed={tipoUsuario === "distributor"}
              className={`btn-switch ${tipoUsuario === "distributor" ? "active" : ""}`}
              onClick={() => {
                setTipoUsuario("distributor");
                reset();
              }}
            >
              Distribuidor
              <span className="btn-switch-icon" aria-hidden="true">
                <img src={"/distributorIcon.png"} alt="" />
              </span>
            </button>
          </div>

          <p className="tipo-usuario-texto">
            Registrarse como {tipoUsuario === "customer" ? "Cliente" : "Distribuidor"}
          </p>

          {/* FORMULARIO */}
          <form className="registro-form" onSubmit={handleSubmit(onSubmit)}>
            {tipoUsuario === "customer" ? (
              <>
                <input
                  type="text"
                  placeholder="Nombre"
                  className={`input-modern ${errors.name ? "input-error" : ""}`}
                  {...register("name", { required: "El nombre es obligatorio" })}
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}

                <input
                  type="text"
                  placeholder="Apellido"
                  className={`input-modern ${errors.lastName ? "input-error" : ""}`}
                  {...register("lastName", { required: "El apellido es obligatorio" })}
                />
                {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}

                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className={`input-modern ${errors.customerEmail ? "input-error" : ""}`}
                  {...register("customerEmail", { required: "El correo es obligatorio" })}
                />
                {errors.customerEmail && <span className="error-message">{errors.customerEmail.message}</span>}

                <input
                  type="password"
                  placeholder="Contraseña"
                  className={`input-modern ${errors.customerPassword ? "input-error" : ""}`}
                  {...register("customerPassword", { required: "La contraseña es obligatoria" })}
                />
                {errors.customerPassword && <span className="error-message">{errors.customerPassword.message}</span>}

                <input
                  type="tel"
                  placeholder="Número de teléfono"
                  className={`input-modern ${errors.phone ? "input-error" : ""}`}
                  {...register("phone", { required: "El teléfono es obligatorio" })}
                />
                {errors.phone && <span className="error-message">{errors.phone.message}</span>}

                <input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  className={`input-modern ${errors.birthDate ? "input-error" : ""}`}
                  {...register("birthDate", { required: "Fecha de nacimiento obligatoria" })}
                  max={minBirthDate}

                />
                {errors.birthDate && <span className="error-message">{errors.birthDate.message}</span>}
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Nombre de la empresa"
                  className={`input-modern ${errors.companyName ? "input-error" : ""}`}
                  {...register("companyName", { required: "El nombre de la empresa es obligatorio" })}
                />
                {errors.companyName && <span className="error-message">{errors.companyName.message}</span>}

                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className={`input-modern ${errors.distributorEmail ? "input-error" : ""}`}
                  {...register("distributorEmail", { required: "El correo es obligatorio" })}
                />
                {errors.distributorEmail && <span className="error-message">{errors.distributorEmail.message}</span>}

                <input
                  type="password"
                  placeholder="Contraseña"
                  className={`input-modern ${errors.distributorPassword ? "input-error" : ""}`}
                  {...register("distributorPassword", { required: "La contraseña es obligatoria" })}
                />
                {errors.distributorPassword && <span className="error-message">{errors.distributorPassword.message}</span>}

                <input
                  type="text"
                  placeholder="Dirección"
                  className={`input-modern ${errors.address ? "input-error" : ""}`}
                  {...register("address", { required: "La dirección es obligatoria" })}
                />
                {errors.address && <span className="error-message">{errors.address.message}</span>}

                <input
                  type="tel"
                  placeholder="Teléfono"
                  className={`input-modern ${errors.distributorPhone ? "input-error" : ""}`}
                  {...register("distributorPhone", { required: "El teléfono es obligatorio" })}
                />
                {errors.distributorPhone && <span className="error-message">{errors.distributorPhone.message}</span>}

                <input
                  type="text"
                  placeholder="NIE / Registro Fiscal"
                  className={`input-modern ${errors.nie ? "input-error" : ""}`}
                  {...register("nie", { required: "El NIE/Registro Fiscal es obligatorio" })}
                />
                {errors.nie && <span className="error-message">{errors.nie.message}</span>}
              </>
            )}

            <div className="actions">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrarse"}
              </button>
            </div>
          </form>

          <p className="registro-login">
            ¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a>
          </p>

          {/* Modal simple */}
          {showModal && (
            <div className="verify-code-modal">
              <p>Modal de verificación</p>
              <button onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Registro;
