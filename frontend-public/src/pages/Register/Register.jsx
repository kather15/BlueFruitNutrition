import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormularioRegistro from "../../components/Register/RegisterForm";
import VerifyCodeModal from "../../components/VerifyCode/VerifyCodeModal";
import './Register.css';

function Registro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("customer");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getMinBirthDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split("T")[0];
  };

  const minBirthDate = getMinBirthDate();

  const onSubmit = async (data) => {
    try {
      const endpoint = tipoUsuario === "customer"
        ? "http://localhost:4000/api/registerCustomers"
        : "http://localhost:4000/api/registerDistributors";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Error en el registro");
        return;
      }

      toast.success("Registro exitoso. Revisa tu correo 📩");
      setShowModal(true);
    } catch (error) {
      toast.error("Error de red o del servidor");
    }
  };

  return (
    <div className="registro-container">
      <div className="imgre">
        <img src="/imgregister.png" alt="Blue Fruit Nutrition" className="registro-img" />
      </div>

      <div className="registro-card">
        <div className="registro-right">
          <h1>Crear cuenta</h1>
          <h2>Registro como {tipoUsuario === "customer" ? "Cliente" : "Distribuidor"}</h2>

          <button
            onClick={() => setTipoUsuario(prev => prev === "customer" ? "distributor" : "customer")}
            className="btn-switch"
          >
            Cambiar a {tipoUsuario === "customer" ? "Distribuidor" : "Cliente"}
          </button>

          <FormularioRegistro
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            onSubmit={onSubmit}
            tipoUsuario={tipoUsuario}
            minBirthDate={minBirthDate}
          />

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
