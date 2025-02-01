
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './Signin.css';

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage("Verification code sent to your email.");
    setTimeout(() => {
      navigate("/reset-password"); 
    }, 1500);
  };

  return (
    <div className="container">
      <div className="card-container">
        <div className="diagonal-shape"></div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="button-container">
              <button type="submit" className="btn-login">
                Submit
              </button>
            </div>
            {message && <div className="alert alert-info mt-3">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;
