import React, { useState } from 'react';
import './PasoActual.css';

// Componente PasoActual mejorado
const PasoActual = ({ 
  paso, 
  pasos = ['Elegir Producto', 'Sabores', 'Producto Final'] 
}) => {
  // Validar que el paso esté dentro del rango válido
  const clampedPaso = Math.max(0, Math.min(paso, pasos.length - 1));
  
  return (
    <div className="stepper-container">
      {pasos.map((p, index) => {
        const isActive = clampedPaso === index;
        const isCompleted = clampedPaso > index;
        
        return (
          <div 
            className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`} 
            key={index}
            role="step"
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Paso ${index + 1}: ${p}`}
          >
            <div className={`circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              {isCompleted && <span className="checkmark">✓</span>}
              {!isCompleted && <span className="step-number">{index + 1}</span>}
            </div>
            <span className="label">{p}</span>
          </div>
        );
      })}
    </div>
  );
};

// Componente de ejemplo para demostración
const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 2));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  return (
    <div className="app-container">
      <h1 className="title">Proceso de Personalización</h1>
      
      <PasoActual paso={currentStep} />
      
      <div className="current-step-info">
        <h3 className="step-title">
          Paso Actual: {currentStep + 1} de 3
        </h3>
        <p className="step-description">
          {currentStep === 0 && "Selecciona tu producto base"}
          {currentStep === 1 && "Elige los sabores que prefieres"}
          {currentStep === 2 && "Revisa tu producto personalizado"}
        </p>
      </div>
      
      <div className="controls">
        <button 
          className="btn btn-secondary" 
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Anterior
        </button>
        <button 
          className="btn btn-primary" 
          onClick={nextStep}
          disabled={currentStep === 2}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PasoActual;