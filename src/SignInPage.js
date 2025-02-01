import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "./auth.service.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signin.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      console.log("Form Submitted", values);
      setMessage("");
      setLoading(true);
      setIsSubmitting(true);
    
      try {
        const response = await AuthService.login(values.email, values.password); 
        console.log("Response from login:", response); 
        const { token, memberId, role } = response.data; 
        console.log('Member id:  ', memberId)
        localStorage.setItem("authToken", token);
        localStorage.setItem("memberId", memberId);
        localStorage.setItem('role', role);
        if (role === "admin") {
          navigate("/home");
        } else {
          navigate("/profile");
        }
      } catch (error) {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
      } finally {
        setLoading(false);
        setIsSubmitting(false);
      }
    },
    });


  return (
    <div className="container">
      <div className="card-container">
        <div className="diagonal-shape"></div>
        <div className="form-container">
          <h2>Sign In</h2>
          <form onSubmit={formik.handleSubmit}>
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
              {formik.touched.email && formik.errors.email && (
                <div className="error-text">{formik.errors.email}</div>
              )}
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
              {formik.touched.password && formik.errors.password && (
                <div className="error-text">{formik.errors.password}</div>
              )}
            </div>

            <div className="button-container">
              <button type="submit" className="btn-login">
                Log In
              </button>
              <button className="btn-forgot-password">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password
                </Link>
              </button>
            </div>

            <div className="sign-up-link">
              <p>
                Don't have an account? <Link to="/SignUp">Sign Up</Link>
              </p>
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

export default Login;
