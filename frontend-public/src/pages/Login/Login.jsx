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
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loadingLogin) return; // Evita múltiples envíos

    if (email.trim() === "" || password.trim() === "") {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoadingLogin(true);
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

      // Toast de credenciales correctas
      toast.success("Credenciales correctas");

      // 2. Si es admin, enviar código antes de mostrar modal
      if (data.role === "admin") {
        if (showAdminModal) return; // Si ya está abierto el modal, no volver a enviar código

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
    } finally {
      setLoadingLogin(false);
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
          <h2 className="form-title">Inicie sesión in BlueFruit</h2>
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

            <div className="input-group" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0
                }}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  // SVG de ojo abierto
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  // SVG de ojo cerrado
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.81 21.81 0 0 1 5.06-6.06"/>
                    <path d="M1 1l22 22"/>
                    <path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47"/>
                  </svg>
                )}
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={loadingLogin}>
              {loadingLogin ? "Procesando..." : "Iniciar Sesión"}
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
