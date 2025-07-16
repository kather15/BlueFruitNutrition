import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import "./Login.css";
import triathlonImage from "../../assets/imgregister.png"; // Asegúrate de que la ruta sea correcta

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  if (email.trim() === "" || password.trim() === "") {
    toast.error("Por favor completa todos los campos");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:4000/api/login",
      { email, password },
      { withCredentials: true }
    );

    if (res.data.message === "login successful") {
      toast.success("Inicio de sesión exitoso");

      if (res.data.role === "admin") {
        // 🔁 Redirección completa a la app del admin (en otro puerto)
        window.location.href = "http://localhost:5174";
      } else {
        // 🧭 Para usuarios normales, redirige dentro de la misma app
        navigate("/");
      }
    } else {
      toast.error(res.data.message || "Error al iniciar sesión");
    }
  } catch (error) {
    toast.error("Error en el servidor");
  }
};


  return (
    <div className="login-container">
      {/* Lado izquierdo - Imagen */}
      <div className="left-side">
        <div className="image-container">
          <img 
            src={triathlonImage} 
            alt="Triathlon promotional" 
            className="promo-image"
          />
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="right-side">
        <div className="form-wrapper">
          <h2 className="form-title">Inicie sesión en BlueFruit</h2>
          <p className="form-subtitle">Ingresa tus datos a continuación</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Correo electrónico o número de teléfono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
            </div>
            
            <button type="submit" className="login-btn">
              Iniciar Sesión
            </button>
            
            <div className="forgot-password-container">
              <a href="/enviar-codigo" className="forgot-password-link">¿Olvidaste tu contraseña?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
