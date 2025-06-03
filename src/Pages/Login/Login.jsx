import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setServerError("");

    let isValid = true;

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });


      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h3 className={styles.heading}>Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className={`form-label ${styles.formLabel}`}>Email address</label>
            <input
              type="email"
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="text-danger mt-1">{emailError}</div>}
          </div>

          <div className="mb-3">
            <label className={`form-label ${styles.formLabel}`}>Password</label>
            <input
              type="password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
          </div>

          {serverError && <div className="text-danger text-center mb-2">{serverError}</div>}

          <button type="submit" className={`btn ${styles.customLoginBtn} w-100`}>
            Login
          </button>

          <div className="text-center mt-3">
            <span>Don't have an account? </span>
            <a href="/signup" className="text-primary text-decoration-none fw-semibold">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
