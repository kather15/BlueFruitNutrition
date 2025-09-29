import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importa navigate
import './RecoveryPassword.css';

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // 👈 Inicializa navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("recoveryEmail");

    const res = await fetch("https://bluefruitnutrition-production.up.railway.app/api/passwordRecovery/newPassword", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: password, email }) // 👈 Asegúrate de enviar también el email
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      localStorage.removeItem("recoveryEmail"); // 👈 Limpia el email guardado
      // Espera un poquito para mostrar el mensaje y luego redirige
      setTimeout(() => {
        navigate("/login"); // 👈 Redirige al login
      }, 1500);
    }
  };

  return (
    <div className="contenedor">
      <div className="wrapper">
        <div className="imgrecovery">
          <img src={"/recuperar-contraseña.png"} alt="" className="recovery-img"/>
        </div>
        <div className="recovery-card">
          <h2 className="text-xl font-bold mb-4">¿Olvidaste tu contraseña?</h2>
          <h4>Ingresa tus datos a continuación</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Ingrese la contraseña nueva"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="btnrecovery">
              Guardar nueva contraseña
            </button>
          </form>
        </div>
      </div>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
