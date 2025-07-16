import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GelCard.css';

const GelCard = ({ name, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/sabores');
  };

  return (
    <div className="gel-card">
      <div className="gel-image-wrapper">
        <div className="gel-bg" />
        <img src={image} alt={name} className="gel-image" />
      </div>
      <h3 className="gel-title">{name}</h3>
      <button className="gel-button" onClick={handleClick}>Personalizar</button>
    </div>
  );
};

export default GelCard;
