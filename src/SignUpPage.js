import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "./auth.service.js";
import './Signup.css';

const SignUp = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      phoneNumber: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      console.log("Form Submitted", values);
      setMessage("");
      setLoading(true);
      setIsSubmitting(true);

      try {
        const response = await AuthService.register(values.username, values.phoneNumber, values.email, values.password);
        console.log("Response from registration:", response);
         const { token, memberId } = response.data;

    localStorage.setItem("authToken", token);
    localStorage.setItem("memberId", memberId);

        navigate("/home");
      } catch (error) {
        const resMessage = error.response?.data?.message || error.message || error.toString();
        setMessage(resMessage);
        setLoading(false);
      }
    },
  });

  return (
    <div className="container">
      <div className="card-container">
        <div className="diagonal-shape"></div>
        <div className="form-container">
          <h2>Sign Up</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username ? (
                <small className="error-text">{formik.errors.username}</small>
              ) : null}
            </div>

            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <small className="error-text">{formik.errors.phoneNumber}</small>
              ) : null}
            </div>

            <div className="form-group">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <small className="error-text">{formik.errors.email}</small>
              ) : null}
            </div>

            <div className="form-group">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <small className="error-text">{formik.errors.password}</small>
              ) : null}
            </div>

            <div className="form-group">
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <small className="error-text">{formik.errors.confirmPassword}</small>
              ) : null}
            </div>

            <div className="action-container">
              <div className="login-link">
                <p>
                  Already have an Account? 
                  <Link to="/login"> Log in</Link>
                </p>
              </div>

              <button type="submit" className="btn-signup" disabled={loading}>Sign Up</button>
            </div>

            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
