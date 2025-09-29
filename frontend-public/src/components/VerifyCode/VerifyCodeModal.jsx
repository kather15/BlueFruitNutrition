import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import "./VerifyCodeModal.css";

const VerifyCodeModal = ({ isOpen, onClose, tipoUsuario }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ requireCode }) => {
    try {
      const endpoint =
        tipoUsuario === "distributor"
          ? "https://bluefruitnutrition-production.up.railway.app/api/registerDistributors/verifyCodeEmail"
          : "https://bluefruitnutrition-production.up.railway.app/api/registerCustomers/verifyCodeEmail";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ requireCode }),
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
          {...register("requireCode", { required: true })}
        />
        {errors.requireCode && (
          <p className="error-msg">El código es obligatorio</p>
        )}
        <button type="submit" className="btn-crear" href="/login">Verificar</button>
      </form>
      <button onClick={onClose} className="cancelar-btn">Cancelar</button>
    </div>
  );
};

export default VerifyCodeModal;
