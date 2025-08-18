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
        ? "https://bluefruitnutrition1.onrender.com/api/registerCustomers"
        : "https://bluefruitnutrition1.onrender.com/api/registerDistributors";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      // Toast si el correo ya está registrado como cliente o distribuidor
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
          <h2 className="tipo-cuenta-titulo">Selecciona tu tipo de cuenta</h2>

          {/* Selección de tipo de usuario */}
          <div className="btn-switch-group">
            <button
              className={`btn-switch ${tipoUsuario === "customer" ? "active" : ""}`}
              onClick={() => setTipoUsuario("customer")}
            >
              Cliente
              <span className="btn-switch-icon">
                <img src={"/customerIcon.png"} alt="Cliente" />
              </span>
            </button>
            <div className="separator"></div>
            <button
              className={`btn-switch ${tipoUsuario === "distributor" ? "active" : ""}`}
              onClick={() => setTipoUsuario("distributor")}
            >
              Distribuidor
              <span className="btn-switch-icon">
                <img src={"/distributorIcon.png"} alt="Distribuidor" />
              </span>
            </button>
          </div>

          <p className="tipo-usuario-texto">
            Registrarse como {tipoUsuario === "customer" ? "Cliente" : "Distribuidor"}
          </p>

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

<VerifyCodeModal isOpen={showModal} onClose={() => setShowModal(false)} tipoUsuario={tipoUsuario} />
        </div>
      </div>
    </div>
  );
}

export default Registro;
