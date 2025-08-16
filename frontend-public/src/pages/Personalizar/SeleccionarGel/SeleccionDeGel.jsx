import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Package, Coffee, Droplet } from "lucide-react";
import "./SeleccionDeGel.css";

const steps = ["Seleccionar Gel", "Seleccionar Componentes", "Confirmación", "Producto Final"];

const gels = [
  { name: "Gel Energético A", img: "/gel1.png" },
  { name: "Gel Energético B", img: "/gel2.png" },
  { name: "Gel Energético C", img: "/gel3.png" },
];

export default function ProductCustomizer() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    gel: "",
    carbohidratos: "",
    cafeina: "",
    sabor: "",
  });

  const handleSelect = (key, value) => {
    setSelection({ ...selection, [key]: value });
    const labels = {
      gel: "Gel",
      carbohidratos: "Carbohidratos",
      cafeina: "Cafeína",
      sabor: "Sabor",
    };
    toast.success(`${labels[key]}: ${value} seleccionado`);
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const handleAddToCart = () => toast.success("Producto añadido al carrito 🛒");

  return (
    <div className="contenedorPersonalizar">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="pasoPersonalizar"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="tituloPasoPersonalizar">{steps[step - 1]}</h2>

          {step === 1 && (
            <>
              <div className="gridGelPersonalizar">
                {gels.map((gel) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={gel.name}
                    className={`tarjetaGelPersonalizar ${selection.gel === gel.name ? "selected" : ""}`}
                    onClick={() => handleSelect("gel", gel.name)}
                  >
                    <img src={gel.img} alt={gel.name} />
                    <p>{gel.name}</p>
                  </motion.div>
                ))}
              </div>
              <div className="botonesPersonalizar">
                <button onClick={nextStep} disabled={!selection.gel}>
                  Siguiente
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h4>
                <Package size={18} /> Carbohidratos
              </h4>
              <div className="opcionesPersonalizar">
                {["18g", "22g", "30g"].map((val) => (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    key={val}
                    className={`botonOpcionPersonalizar ${selection.carbohidratos === val ? "selected" : ""}`}
                    onClick={() => handleSelect("carbohidratos", val)}
                    aria-pressed={selection.carbohidratos === val}
                  >
                    {val}
                  </motion.button>
                ))}
              </div>

              <h4>
                <Coffee size={18} /> Cafeína
              </h4>
              <div className="opcionesPersonalizar">
                {["25mg", "50mg", "75mg", "Sin cafeína"].map((val) => (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    key={val}
                    className={`botonOpcionPersonalizar ${selection.cafeina === val ? "selected" : ""}`}
                    onClick={() => handleSelect("cafeina", val)}
                    aria-pressed={selection.cafeina === val}
                  >
                    {val}
                  </motion.button>
                ))}
              </div>

              <h4>
                <Droplet size={18} /> Sabor
              </h4>
              <div className="opcionesPersonalizar">
                {["Banano", "Frambuesa", "Manzana", "Mora"].map((val) => (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    key={val}
                    className={`botonOpcionPersonalizar ${selection.sabor === val ? "selected" : ""}`}
                    onClick={() => handleSelect("sabor", val)}
                    aria-pressed={selection.sabor === val}
                  >
                    {val}
                  </motion.button>
                ))}
              </div>

              <div className="botonesPersonalizar">
                <button onClick={prevStep}>Regresar</button>
                <button
                  onClick={nextStep}
                  disabled={!selection.carbohidratos || !selection.cafeina || !selection.sabor}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <motion.div
                className="tarjetaConfirmacionPersonalizar"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <CheckCircle size={40} color="#0c133f" />
                <h3>Resumen de tu selección</h3>
                <ul>
                  <li>
                    Gel: <strong>{selection.gel}</strong>
                  </li>
                  <li>
                    Carbohidratos: <strong>{selection.carbohidratos}</strong>
                  </li>
                  <li>
                    Cafeína: <strong>{selection.cafeina}</strong>
                  </li>
                  <li>
                    Sabor: <strong>{selection.sabor}</strong>
                  </li>
                </ul>
              </motion.div>
              <div className="botonesPersonalizar">
                <button onClick={prevStep}>Regresar</button>
                <button onClick={nextStep}>Confirmar</button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <motion.div
                className="productoFinalPersonalizar"
                whileHover={{ scale: 1.02 }}
              >
                <h3>{selection.gel}</h3>
                <p>
                  <strong>Carbohidratos:</strong> {selection.carbohidratos}
                </p>
                <p>
                  <strong>Cafeína:</strong> {selection.cafeina}
                </p>
                <p>
                  <strong>Sabor:</strong> {selection.sabor}
                </p>
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
