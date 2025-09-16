// src/pages/Login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/useAuth";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./Login.css";

const AdminCodeModal = ({ onClose, email }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Código vacío",
        text: "Por favor ingresa el código",
      });
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

      Swal.fire({
        icon: "success",
        title: "Código verificado",
        text: "Acceso permitido",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      window.location.href = "http://localhost:5174";
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Verificación de código</h3>
        <p>
          Ingrese el código enviado al correo <b>{email}</b>
        </p>
        <input
          type="text"
          placeholder="Código de verificación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          disabled={loading}
        />
        <button onClick={handleVerifyCode} disabled={loading} className="btn-primary">
          {loading ? "Verificando..." : "Verificar"}
        </button>
        <button onClick={onClose} disabled={loading} className="btn-secondary">
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

  const navigate = useNavigate();
  const { login, checkSession } = useAuthContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loadingLogin) return;

    if (email.trim() === "" || password.trim() === "") {
      return Swal.fire({
        icon: "error",
        title: "Campos vacíos",
        text: "Por favor completa todos los campos",
      });
    }

    setLoadingLogin(true);
    try {
      const result = await login(email, password);
      if (!result.success) throw new Error(result.error);

      if (result.data.role === "admin") {
        const sendCodeRes = await fetch("https://bluefruitnutrition1.onrender.com/api/admin/send-code", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const sendCodeData = await sendCodeRes.json();
        if (!sendCodeRes.ok) throw new Error(sendCodeData.message || "Error enviando código");

        Swal.fire({
          icon: "success",
          title: "Código enviado",
          text: "Revisa tu correo electrónico",
          timer: 2500,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });

        setAdminEmail(email);
        setShowAdminModal(true);
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Login correcto",
        text: "Bienvenido de nuevo",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      await checkSession();
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-left">
          <img src="/imgregister.png" alt="Login illustration" className="login-img" />
        </div>

        <div className="login-right">
          <h1 className="welcome-title">Bienvenido de nuevo</h1>
          <p className="form-subtitle">Ingresa tus credenciales para continuar</p>

          <form className="login-form" onSubmit={handleLogin}>
            <input type="email" placeholder="Correo electrónico" className="input-modern" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" className="input-modern" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button type="submit" className="btn-primary" disabled={loadingLogin}>
              {loadingLogin ? "Procesando..." : "Iniciar Sesión"}
            </button>

            <p className="forgot-password">
              <a href="/enviar-codigo">¿Olvidaste tu contraseña?</a>
            </p>
          </form>
        </div>
      </div>

      {showAdminModal && <AdminCodeModal email={adminEmail} onClose={() => setShowAdminModal(false)} />}
    </div>
  );
};

export default Login;
