import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext"; // Usamos el contexto
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
      const res = await fetch("https://bluefruitnutrition1.onrender.com/api/admin/verify-code", {
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
          Ingrese el código enviado a su correo <b>{email}</b>
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
  const [showPassword, setShowPassword] = useState(false);
  const { login: contextLogin } = useAuthContext(); // Contexto de auth
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loadingLogin) return;

    if (!email.trim() || !password.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoadingLogin(true);
    try {
      const res = await fetch("https://bluefruitnutrition1.onrender.com/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al iniciar sesión");

      // Login admin: enviar código y abrir modal
      if (data.role === "admin") {
        if (showAdminModal) return;

        const sendCodeRes = await fetch("https://bluefruitnutrition1.onrender.com/api/admin/send-code", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const sendCodeData = await sendCodeRes.json();
        if (!sendCodeRes.ok) throw new Error(sendCodeData.message || "Error enviando código");

        toast.success("Código enviado al correo. Verifica para continuar.");
        setAdminEmail(email);
        setShowAdminModal(true);
        return;
      }

      // Usuario normal: guardar en contexto y localStorage
      contextLogin(data.user || data, data.token);

      toast.success("Inicio de sesión exitoso");
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <div className="login-container">
      <Toaster position="top-center" />

      <div className="left-side">
        <div className="image-container">
          <img src={"/imgregister.png"} alt="Promoción BlueFruit" className="promo-image" />
        </div>
      </div>

      <div className="right-side">
        <div className="form-wrapper">
          <h2 className="form-title">Inicie sesión en BlueFruit</h2>
          <p className="form-subtitle">Ingresa tus datos a continuación</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Correo electrónico o teléfono"
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
                  padding: 0,
                }}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.81 21.81 0 0 1 5.06-6.06" />
                    <path d="M1 1l22 22" />
                    <path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-5.47" />
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

      {showAdminModal && <AdminCodeModal email={adminEmail} onClose={() => setShowAdminModal(false)} />}
    </div>
  );
};

export default Login;
