import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleCodeChange = (value, index) => {
    if (/^\d$/.test(value) || value === "") {
      const updatedCode = [...code];
      updatedCode[index] = value;
      setCode(updatedCode);

      if (updatedCode.every((digit) => digit !== "")) {
        setIsCodeValid(true);
      } else {
        setIsCodeValid(false);
      }
    }
  };

  const handleKeyUp = (event, index) => {
    if (event.key === "Backspace" && index > 0 && code[index] === "") {
      document.getElementById(`code-box-${index - 1}`).focus();
    } else if (index < 5 && code[index] !== "") {
      document.getElementById(`code-box-${index + 1}`).focus();
    }
  };

  const handleConfirm = () => {
    alert("Password reset successfully! Redirecting to Login...");
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="card-container">
        <div className="diagonal-shape"></div>
        <div className="form-container">
          <h2>Reset Password</h2>
          <div className="form-group code-input-container">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                id={`code-box-${index}`}
                className="code-box"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(e.target.value, index)}
                onKeyUp={(e) => handleKeyUp(e, index)}
              />
            ))}
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!isCodeValid}
            />
          </div>

          <div className="button-container">
            <button
              className="btn-confirm"
              onClick={handleConfirm}
              disabled={!isCodeValid || password === ""}
            >
              Confirm Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
