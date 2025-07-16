import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./VerifyCodeModal.css";

const VerifyCodeModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

const onSubmit = async ({ verificationCode }) => {
  try {
    const res = await fetch("http://localhost:4000/api/registerCustomers/verifyCodeEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🚨 Enviar cookie con el token
      body: JSON.stringify({ verificationCode }),  // Solo envía el código de verificación
    });

    const data = await res.json();

    if (!res.ok) {
      return toast.error(data.message || "Código incorrecto");
    }

    toast.success("Cuenta verificada con éxito");
    onClose();
  } catch (error) {
    toast.error("Hubo un error al verificar el código");
  }
};

  if (!isOpen) return null;

  return (

 <div className="registro-verificacion">
    <h3>Verifica tu cuenta</h3>
    <form onSubmit={handleSubmit(onSubmit)} className="registro-form">
      <input
        type="text"
        placeholder="Código de verificación"
        {...register("verificationCode", { required: true })}
      />
      {errors.verificationCode && (
        <p className="error-msg">El código es obligatorio</p>
      )}
      <button type="submit" className="btn-crear">Verificar</button>
    </form>
    <button onClick={onClose} className="cancelar-btn">Cancelar</button>
  </div>
  );
};

export default VerifyCodeModal;
