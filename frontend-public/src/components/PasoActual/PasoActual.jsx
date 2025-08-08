import React from 'react';
import './PasoActual.css';

const PasoActual = ({ paso, pasos = [] }) => {
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
          >
            <div className={`circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              {isCompleted ? <span className="checkmark">✓</span> : <span className="step-number">{index + 1}</span>}
            </div>
            <span className="label">{p}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PasoActual;
