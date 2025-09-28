// src/pages/Register/Registro.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./Register.css";

function Registro() {
  const [tipoUsuario, setTipoUsuario] = useState("customer");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ mode: "onTouched" });

  const getMinBirthDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split("T")[0];
  };
  const minBirthDate = getMinBirthDate();

  const onSubmit = async (data) => {
    try {
      let payload = {};
      let endpoint = "";

      if (tipoUsuario === "customer") {
        endpoint = "bluefruitnutrition-production.up.railway.app/api/registerCustomers";
        payload = {
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phone: data.phone,
          dateBirth: data.dateBirth,
        };
      } else {
        endpoint = "bluefruitnutrition-production.up.railway.app/api/registerDistributors";
        payload = {
          companyName: data.companyName,
          email: data.email,
          password: data.password,
          address: data.address,
          phone: data.phone,
          NIT: data.NIT,
        };

      }
      console.log("Datos enviados:", data);

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
        return Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text: result.message,
        });
      }

      if (!res.ok) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Error en el registro",
        });
      }

      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Revisa tu correo 📩",
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      reset();
    } catch (error) {
      console.error("Error en onSubmit:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error de red o del servidor",
      });
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="registro-card" role="region" aria-label="Registro de usuario">
        <div className="registro-left" aria-hidden="true">
          <img src="/imgregister.png" alt="Ilustración de seguridad" className="registro-img" />
        </div>

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

          <form className="registro-form" onSubmit={handleSubmit(onSubmit)}>
            {tipoUsuario === "customer" ? (
              <>
                <input type="text" placeholder="Nombre" className={`input-modern ${errors.name ? "input-error" : ""}`} {...register("name", { required: "El nombre es obligatorio" })} />
                {errors.name && <span className="error-message">{errors.name.message}</span>}

                <input type="text" placeholder="Apellido" className={`input-modern ${errors.lastName ? "input-error" : ""}`} {...register("lastName", { required: "El apellido es obligatorio" })} />
                {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}

                <input type="email" placeholder="Correo electrónico" className={`input-modern ${errors.email ? "input-error" : ""}`} {...register("email", { required: "El correo es obligatorio" })} />
                {errors.email && <span className="error-message">{errors.email.message}</span>}

                <input type="password" placeholder="Contraseña" className={`input-modern ${errors.password ? "input-error" : ""}`} {...register("password", { required: "La contraseña es obligatoria" })} />
                {errors.password && <span className="error-message">{errors.password.message}</span>}

                <input type="tel" placeholder="Número de teléfono" className={`input-modern ${errors.phone ? "input-error" : ""}`} {...register("phone", { required: "El teléfono es obligatorio" })} />
                {errors.phone && <span className="error-message">{errors.phone.message}</span>}

                <input type="date" placeholder="Fecha de nacimiento" className={`input-modern ${errors.dateBirth ? "input-error" : ""}`} {...register("dateBirth", { required: "Fecha de nacimiento obligatoria" })} max={minBirthDate} />
                {errors.dateBirth && <span className="error-message">{errors.dateBirth.message}</span>}
              </>
            ) : (
              <>
                <input type="text" placeholder="Nombre de la empresa" className={`input-modern ${errors.companyName ? "input-error" : ""}`} {...register("companyName", { required: "El nombre de la empresa es obligatorio" })} />
                {errors.companyName && <span className="error-message">{errors.companyName.message}</span>}

                <input type="email" placeholder="Correo electrónico" className={`input-modern ${errors.email ? "input-error" : ""}`} {...register("email", { required: "El correo es obligatorio" })} />
                {errors.email && <span className="error-message">{errors.email.message}</span>}

                <input type="password" placeholder="Contraseña" className={`input-modern ${errors.password ? "input-error" : ""}`} {...register("password", { required: "La contraseña es obligatoria" })} />
                {errors.password && <span className="error-message">{errors.password.message}</span>}

                <input type="text" placeholder="Dirección" className={`input-modern ${errors.address ? "input-error" : ""}`} {...register("address", { required: "La dirección es obligatoria" })} />
                {errors.address && <span className="error-message">{errors.address.message}</span>}

                <input type="tel" placeholder="Teléfono" className={`input-modern ${errors.phone ? "input-error" : ""}`} {...register("phone", { required: "El teléfono es obligatorio" })} />
                {errors.phone && <span className="error-message">{errors.phone.message}</span>}

                <input type="text" placeholder="NIT / Registro Fiscal" className={`input-modern ${errors.NIT ? "input-error" : ""}`} {...register("NIT", { required: "El NIT/Registro Fiscal es obligatorio" })} />
                {errors.NIT && <span className="error-message">{errors.NIT.message}</span>}
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
        </div>
      </div>
    </div>
  );
}

export default Registro;
