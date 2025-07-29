import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import VerifyCodeModal from "../../components/VerifyCode/VerifyCodeModal"
import './Register.css'
import login from "../Login/Login";

function Registro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Obtener fecha actual en formato yyyy-mm-dd
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  const fechaMax = `${yyyy}-${mm}-${dd}`;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegresar = () => {
    navigate("/");
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:4000/api/registerCustomers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // para guardar cookie con token
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Error en el registro");
        return;
      }

      toast.success("Registro exitoso. Revisa tu correo 📩");
      setShowModal(true); // abrir modal de verificación
    } catch (error) {
      toast.error("Error de red o del servidor");
    }
  };

  return (
    <div className="registro-container">
      <div className="imgre">
        <img src={"/imgregister.png"} alt="Blue Fruit Nutrition" className="registro-img" />
      </div>

      <div className="registro-card">
        <div className="registro-right">
          <h1>Crear cuenta</h1>
          <h2>Ingresa tus datos para continuar</h2>
          <form className="registro-form" onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Nombre" {...register("name", { required: true })} />
            <input type="text" placeholder="Apellido" {...register("lastName", { required: true })} />
            <input type="email" placeholder="Correo Electrónico" {...register("email", { required: true })} />
            <input type="tel" placeholder="Número de teléfono" {...register("phone", { required: true })} />


            <input 
              type="date" 
              placeholder="Fecha de nacimiento" 
              max={fechaMax}
              {...register("dateBirth", { 
                required: "La fecha de nacimiento es obligatoria",
                validate: value => value <= fechaMax || "La fecha no puede ser mayor a hoy"
              })} 
            />
            {errors.dateBirth && <p style={{ color: 'red' }}>{errors.dateBirth.message}</p>}

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
            <button type="submit" className="btn-crear" href="/login">Crear Cuenta</button>
          </form>
          <p className="registro-login">
            ¿Ya tienes una cuenta? <a href="/login">Inicia Sesión</a>
          </p>
          <VerifyCodeModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
      </div>
    </div>
  );
}

export default Registro;
