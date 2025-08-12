import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./Login.css";

const AdminCodeModal = ({ onClose, email }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      toast.error("Por favor ingresa el código");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/admin/verify-code", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Código inválido");

      toast.success("Código verificado correctamente");
      // Redirigir al panel admin
      window.location.href = "http://localhost:5174";
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Verificación de código</h3>
        <p>
          Ingrese el código que se envió a su correo asociado a <b>{email}</b>
        </p>
        <input
          type="text"
          placeholder="Código de verificación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          disabled={loading}
        />
        <button onClick={handleVerifyCode} disabled={loading}>
          {loading ? "Verificando..." : "Verificar"}
        </button>
        <button onClick={onClose} disabled={loading} className="modal-close-btn">
          Cancelar
        </button>
      </div>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      toast.error("Por favor completa todos los campos");
      return;
    }

    try {
      // 1. Login normal
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");

      // 2. Si es admin, enviar código antes de mostrar modal
      if (data.role === "admin") {
        const sendCodeRes = await fetch("http://localhost:4000/api/admin/send-code", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const sendCodeData = await sendCodeRes.json();

        if (!sendCodeRes.ok) throw new Error(sendCodeData.message || "Error enviando código");

        toast.success("Código enviado al correo. Por favor verifica.");

        setAdminEmail(email);
        setShowAdminModal(true);
        return; // Salir para que no navegue aún
      }

      // 3. Usuario normal: éxito y redirigir
      toast.success("Inicio de sesión exitoso");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Lado izquierdo - Imagen */}
      <div className="left-side">
        <div className="image-container">
          <img src={"/imgregister.png"} alt="Triathlon promotional" className="promo-image" />
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
              <a href="/enviar-codigo" className="forgot-password-link">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de código admin */}
      {showAdminModal && (
        <AdminCodeModal email={adminEmail} onClose={() => setShowAdminModal(false)} />
      )}
    </div>
  );
};

export default Login;
