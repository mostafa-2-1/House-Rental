import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();

  const handlePaymentMethod = (method) => {
    alert(`You selected ${method}`);
  };

  return (
    <div className="payment-container">
      <h1>Choose Your Payment Method</h1>
      <button onClick={() => handlePaymentMethod("Credit Card")}>
        Credit Card
      </button>
      <button onClick={() => handlePaymentMethod("PayPal")}>PayPal</button>
      <button onClick={() => handlePaymentMethod("Bank Transfer")}>
        Bank Transfer
      </button>
      <button onClick={() => navigate(-1)}>Cancel</button>
    </div>
  );
};

export default PaymentPage;