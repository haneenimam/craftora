import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Signup.module.css";

function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSignup = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!firstName.trim()) formErrors.firstName = "First name is required.";
    if (!lastName.trim()) formErrors.lastName = "Last name is required.";
    if (!email) formErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      formErrors.email = "Invalid email format.";

    if (!password) formErrors.password = "Password is required.";
    else if (password.length < 6)
      formErrors.password = "Password must be at least 6 characters.";

    if (confirmPassword !== password)
      formErrors.confirmPassword = "Passwords do not match.";

    if (!role) formErrors.role = "Please select a role.";

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password, role }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      navigate("/login");
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <h2 className="text-center mb-4 fw-bold">Create Account</h2>
        <form onSubmit={handleSignup} noValidate>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className={styles.formLabel}>First Name</label>
              <input
                type="text"
                className={`form-control form-control-lg rounded-3 ${
                  errors.firstName ? "is-invalid" : ""
                }`}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrors({ ...errors, firstName: "" });
                }}
              />
              {errors.firstName && (
                <div className="invalid-feedback">{errors.firstName}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className={styles.formLabel}>Last Name</label>
              <input
                type="text"
                className={`form-control form-control-lg rounded-3 ${
                  errors.lastName ? "is-invalid" : ""
                }`}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setErrors({ ...errors, lastName: "" });
                }}
              />
              {errors.lastName && (
                <div className="invalid-feedback">{errors.lastName}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className={styles.formLabel}>Email address</label>
            <input
              type="email"
              className={`form-control form-control-lg rounded-3 ${
                errors.email ? "is-invalid" : ""
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label className={styles.formLabel}>Role</label>
            <select
              className={`form-select form-select-lg rounded-3 ${
                errors.role ? "is-invalid" : ""
              }`}
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setErrors({ ...errors, role: "" });
              }}
            >
              <option value="User">User</option>
              <option value="Seller">Seller</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && (
              <div className="invalid-feedback">{errors.role}</div>
            )}
          </div>

          <div className="mb-3">
            <label className={styles.formLabel}>Password</label>
            <input
              type="password"
              className={`form-control form-control-lg rounded-3 ${
                errors.password ? "is-invalid" : ""
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: "" });
              }}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <div className="mb-4">
            <label className={styles.formLabel}>Confirm Password</label>
            <input
              type="password"
              className={`form-control form-control-lg rounded-3 ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({ ...errors, confirmPassword: "" });
              }}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-lg w-100 rounded-3 shadow-sm ${styles.customSignupBtn}`}
          >
            Sign Up
          </button>

          <div className={styles.loginPrompt}>
            <small>
              Already have an account? <a href="/login">Login</a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
