import React, { useState } from "react";  
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Coffee, Droplet, CheckCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import "./SeleccionDeGel.css";

const steps = ["Seleccionar Componentes", "Confirmación", "Producto Final"];
const saboresPorDefecto = ["Banano", "Mora", "Limón", "Manzana", "Piña", "Frambuesa", "Coco", "Ponche de Frutas", "Maracuya"];

export default function ProductCustomizer() {
  const { state } = useLocation(); // nombre e imagen del producto
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({ carbohidratos: "", cafeina: "", sabor: "" });

  const handleSelect = (key, value) => {
    setSelection({ ...selection, [key]: value });
    const labels = { carbohidratos: "Carbohidratos", cafeina: "Cafeína", sabor: "Sabor" };
    toast.success(`${labels[key]}: ${value} seleccionado`);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleAddToCart = () => {
    const producto = {
      id: uuidv4(),
      nombre: state?.nombre ? `Gel Personalizado: ${state.nombre}` : `Gel Personalizado`,
      imagen: state?.imagen || "https://via.placeholder.com/50",
      carbohidratos: selection.carbohidratos,
      cafeina: selection.cafeina,
      sabor: selection.sabor,
      precio: 2.5,
      cantidad: 1
    };

    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoActual.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carritoActual));

    toast.success("Producto añadido al carrito 🛒");
    navigate('/carrito'); // redirige al carrito
  };

  return (
    <div className="contenedorPersonalizar">
      <AnimatePresence mode="wait">
        <motion.div key={step} className="pasoPersonalizar"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4 }}
        >
          <h2>{steps[step - 1]}</h2>
          {step === 1 && (
            <>
              <h4><Package size={18}/> Carbohidratos</h4>
              <div className="opcionesPersonalizar">
                {["18g","22g","30g"].map(val => (
                  <motion.button key={val} whileTap={{scale:0.9}}
                    className={selection.carbohidratos===val?"selected":""}
                    onClick={()=>handleSelect("carbohidratos",val)}>{val}</motion.button>
                ))}
              </div>
              <h4><Coffee size={18}/> Cafeína</h4>
              <div className="opcionesPersonalizar">
                {["25mg","50mg","75mg","Sin cafeína"].map(val => (
                  <motion.button key={val} whileTap={{scale:0.9}}
                    className={selection.cafeina===val?"selected":""}
                    onClick={()=>handleSelect("cafeina",val)}>{val}</motion.button>
                ))}
              </div>
              <h4><Droplet size={18}/> Sabor</h4>
              <div className="opcionesPersonalizar">
                {saboresPorDefecto.map(val => (
                  <motion.button key={val} whileTap={{scale:0.9}}
                    className={selection.sabor===val?"selected":""}
                    onClick={()=>handleSelect("sabor",val)}>{val}</motion.button>
                ))}
              </div>
              <div className="botonesPersonalizar">
                <button disabled>Regresar</button>
                <button onClick={nextStep} disabled={!selection.carbohidratos || !selection.cafeina || !selection.sabor}>Siguiente</button>
              </div>
            </>
          )}
          {step===2 && (
            <>
              <motion.div className="tarjetaConfirmacionPersonalizar" initial={{scale:0.9}} animate={{scale:1}}>
                <CheckCircle size={40} color="#0c133f"/>
                <h3>Resumen de tu selección</h3>
                <ul>
                  <li>Carbohidratos: <strong>{selection.carbohidratos}</strong></li>
                  <li>Cafeína: <strong>{selection.cafeina}</strong></li>
                  <li>Sabor: <strong>{selection.sabor}</strong></li>
                </ul>
              </motion.div>
              <div className="botonesPersonalizar">
                <button onClick={prevStep}>Regresar</button>
                <button onClick={nextStep}>Confirmar</button>
              </div>
            </>
          )}
          {step===3 && (
            <>
              <motion.div className="productoFinalPersonalizar" whileHover={{scale:1.02}}>
                <h3>Gel Personalizado</h3>
                <p><strong>Carbohidratos:</strong> {selection.carbohidratos}</p>
                <p><strong>Cafeína:</strong> {selection.cafeina}</p>
                <p><strong>Sabor:</strong> {selection.sabor}</p>
                <p><strong>Producto base:</strong> {state?.nombre}</p>
              </motion.div>
              <div className="botonesPersonalizar">
                <button onClick={prevStep}>Regresar</button>
                <button onClick={handleAddToCart}>Añadir al Carrito 🛒</button>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
