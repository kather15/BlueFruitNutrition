import React from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const cartItems = [
    { name: "Ener Kik", price: 2.5, image: "/img/ener-kik.png" },
    { name: "Reppo", price: 2.5, image: "/img/reppo.png" },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handlePay = (e) => {
    e.preventDefault();
    navigate("/pay");
  };

  return (
    <div className="checkout-container">
      <form className="checkout-form" onSubmit={handlePay}>
        <input type="text" placeholder="Primer nombre *" required />
        <input type="text" placeholder="Primer apellido *" required />
        <input type="text" placeholder="Dirección *" required />
        <input
          type="text"
          placeholder="Número de Casa, apartamento, etc. (opcional)"
        />
        <input type="text" placeholder="Ciudad *" required />
        <input type="text" placeholder="Número de Celular *" required />
        <input type="email" placeholder="Correo electrónico *" required />
      </form>

      <div className="checkout-summary">
        {cartItems.map((item, idx) => (
          <div className="summary-item" key={idx}>
            <img src={item.image} alt={item.name} className="item-image" />
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
        ))}
        <hr />
        <div className="summary-total">
          <div>
            <p>Subtotal:</p>
            <p>Total:</p>
          </div>
          <div>
            <p>${subtotal.toFixed(2)}</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
        </div>

        <div className="payment-method">
          <input type="radio" name="payment" checked readOnly />
          <label>Tarjeta</label>
        </div>

        <button className="pay-button" onClick={handlePay}>
          Ir a pagar
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
