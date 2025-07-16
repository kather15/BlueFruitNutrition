import React from "react";
import { Link } from "react-router-dom";
import './CardProducts.css';

function CardProduct({ id, imagen, titulo, precio, flavor, description }) {
  return (
    <div className="card card-product">
      <img src={imagen} className="card-img-top" alt={titulo} />
      <div className="card-body">
        <h5 className="card-title">{titulo}</h5>
        <p className="card-flavor">{flavor}</p>
        <p className="card-description">{description}</p>
        <p className="card-price">${precio}</p>
        <Link to={`/products/${id}`} className="btn btn-product">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
}

export default CardProduct;