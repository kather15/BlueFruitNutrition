import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const FormularioRegistro = ({
  register,
  handleSubmit,
  errors,
  showPassword,
  togglePasswordVisibility,
  onSubmit, 
  tipoUsuario,
  minBirthDate,
}) => {
  return (
    <form className="registro-form" onSubmit={handleSubmit(onSubmit)}>
      {/* Cliente */}
      {tipoUsuario === "customer" && (
        <>
          <input type="text" placeholder="Nombre" {...register("name", { required: true })} />
          <input type="text" placeholder="Apellido" {...register("lastName", { required: true })} />
          <input type="tel" placeholder="Número de teléfono" {...register("phone", { required: true })} />
          <input 
            type="date" 
            placeholder="Fecha de nacimiento" 
            max={minBirthDate}
            {...register("dateBirth", { 
              required: "La fecha de nacimiento es obligatoria",
              validate: value => value <= minBirthDate || "Debes tener al menos 18 años"
            })} 
          />
          {errors.dateBirth && <p style={{ color: 'red' }}>{errors.dateBirth.message}</p>}
          <input type="email" placeholder="Correo Electrónico" {...register("email", { required: true })} />
        </>
      )}

      {/* Distribuidor */}
      {tipoUsuario === "distributor" && (
        <>
          <input type="text" placeholder="Nombre de la Empresa" {...register("companyName", { required: true })} />
          <input type="email" placeholder="Correo Electrónico" {...register("email", { required: true })} />
          <input type="text" placeholder="Dirección" {...register("address", { required: true })} />
          <input type="tel" placeholder="Teléfono" {...register("phone", { required: true })} />
          <input type="text" placeholder="NIT o Registro Fiscal" {...register("NIT", { required: true })} />
        </>
      )}

      {/* Contraseña para ambos */}
      <div className="registro-password-container">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          {...register("password", { required: true })}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="toggle-password-btn"
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      <button type="submit" className="btn-crear">Crear Cuenta</button>
    </form>
  );
};

export default FormularioRegistro;
