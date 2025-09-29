import React from "react";
import "./FlavorSelector.css";

const FlavorDrawer = ({ isOpen, flavors, selectedFlavor, onClose, onFlavorSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="flavor-drawer-overlay" onClick={onClose}>
      <div
        className="flavor-drawer"
        onClick={(e) => e.stopPropagation()} // Evita cerrar si se da click dentro
      >
        <h3 className="drawer-title">Selecciona un sabor</h3>
        <ul className="flavor-list">
          {flavors.map((flavor, idx) => (
            <li
              key={idx}
              className={`flavor-item ${selectedFlavor === flavor ? "selected" : ""}`}
              onClick={() => {
                onFlavorSelect(flavor);
                onClose();
              }}
            >
              {flavor}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FlavorDrawer;
