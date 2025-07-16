import { useState } from "react";
import './RecoveryPassword.css'
import imgRecovery from '../../assets/recuperar-contraseña.png'


export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("recoveryEmail");

    const res = await fetch("http://localhost:4000/api/passwordRecovery/newPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setMessage(data.message);
    if (res.ok) {
      localStorage.removeItem("/");
    }
  };

  return (
   <div className="contenedor">
                 <div className="wrapper">
             <div className="imgrecovery">
                 <img src={imgRecovery} alt="" className="recovery-img"/>
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
               Enviar código
             </button>
           </form>
           </div>
           </div>
           {message && <p className="mt-4 text-green-600">{message}</p>}
         </div>
  );
}
