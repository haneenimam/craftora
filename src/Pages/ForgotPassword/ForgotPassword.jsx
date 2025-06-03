import React, { useState } from "react";
import styles from "./ForgotPassword.module.css";
import axiosInstance from '../../Apis/config'; 
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/api/auth/forgot-password", { email });

      setMessage("Password reset link sent! Check your email.");
    } catch (err) {
    
      setError(
        err.response?.data?.message || "Failed to send reset email. Try again later."
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className="mb-4 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className={styles.label}>Email address</label>
            <input
              type="email"
              className={`${styles.input} form-control`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {error && <div className="text-danger mb-2">{error}</div>}
          {message && <div className="text-success mb-2">{message}</div>}

          <button type="submit" className={`btn w-100 ${styles.resetBtn}`}>
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
